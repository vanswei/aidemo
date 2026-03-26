import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="download_youtube", description="Download a YouTube video to a local folder")
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("-o", "--output-dir", default=".", help="Output directory")
    parser.add_argument("-f", "--format", default="best", help="yt-dlp format selector")
    parser.add_argument("-A", "--audio-only", action="store_true", help="Download audio-only and extract to mp3")
    parser.add_argument("--subs-lang", default=None, help="Subtitle language code, e.g., en, zh-CN")
    return parser


def ensure_ytdlp() -> str:
    tool = shutil.which("yt-dlp")
    if tool:
        return tool
    code = subprocess.run([sys.executable, "-m", "pip", "install", "-U", "yt-dlp[default]"], capture_output=True, text=True)
    if code.returncode != 0:
        sys.stderr.write(code.stderr.strip() + "\n")
        sys.exit(code.returncode)
    tool = shutil.which("yt-dlp")
    if not tool:
        print("yt-dlp still not found after install", file=sys.stderr)
        sys.exit(1)
    return tool


def ensure_ffmpeg(bin_dir: Path) -> Path:
    ff = shutil.which("ffmpeg")
    if ff:
        return Path(ff)
    bin_dir.mkdir(parents=True, exist_ok=True)
    url = "https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
    tmp = Path(tempfile.mkdtemp())
    zip_path = tmp / "ffmpeg.zip"
    try:
        urllib.request.urlretrieve(url, str(zip_path))
    except Exception as e:
        print(f"Failed to download ffmpeg: {e}", file=sys.stderr)
        sys.exit(1)
    try:
        with zipfile.ZipFile(zip_path, "r") as z:
            target = None
            for name in z.namelist():
                if name.endswith("/ffmpeg.exe") or name.endswith("\\ffmpeg.exe") or name.endswith("ffmpeg.exe"):
                    target = name
                    break
            if not target:
                print("ffmpeg.exe not found in archive", file=sys.stderr)
                sys.exit(1)
            z.extract(target, tmp)
            src = next((p for p in (tmp / target).parent.glob("ffmpeg.exe")), None)
            if src is None:
                src = tmp / target
            dst = bin_dir / "ffmpeg.exe"
            shutil.copy2(src, dst)
    finally:
        try:
            shutil.rmtree(tmp, ignore_errors=True)
        except Exception:
            pass
    return bin_dir / "ffmpeg.exe"


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    tool = ensure_ytdlp()
    ffmpeg_path = ensure_ffmpeg(Path(__file__).parent / "bin")
    output_template = str(output_dir / "%(title)s.%(ext)s")
    base_cmd = [tool, args.url, "-o", output_template, "--no-playlist", "--ffmpeg-location", str(ffmpeg_path)]
    if args.audio_only:
        cmd = base_cmd + ["-f", "bestaudio", "-x", "--audio-format", "mp3", "--print", "after_move:filepath"]
    else:
        fmt = args.format if args.format else "bestvideo+bestaudio/best"
        cmd = base_cmd + ["-f", fmt, "--merge-output-format", "mp4", "--print", "after_move:filepath"]
    if args.subs_lang:
        cmd += ["--write-subs", "--sub-langs", args.subs_lang, "--convert-subs", "srt"]
    env = os.environ.copy()
    env["PATH"] = str(Path(ffmpeg_path).parent) + os.pathsep + env.get("PATH", "")
    result = subprocess.run(cmd, text=True, capture_output=True, env=env)
    if result.returncode != 0:
        sys.stderr.write(result.stderr.strip() + "\n")
        sys.exit(result.returncode)
    if result.stdout.strip():
        print(result.stdout.strip())


if __name__ == "__main__":
    main()
