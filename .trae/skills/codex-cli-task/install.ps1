param(
  [string]$RepoUrl = "https://github.com/openai/skills",
  [string]$Target = "$env:USERPROFILE\.codex\skills\openai-skills"
)

$ErrorActionPreference = "Continue"

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Get-TempDir {
  $td = Join-Path $env:TEMP ("codex-skill-" + [System.Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $td | Out-Null
  return $td
}

function Download-And-ExtractZip {
  param([string]$ZipUrl, [string]$DestDir)
  $zipPath = Join-Path (Get-TempDir) "repo.zip"
  Invoke-WebRequest -Uri $ZipUrl -OutFile $zipPath
  $extractDir = Join-Path (Get-TempDir) "extract"
  Expand-Archive -Path $zipPath -DestinationPath $extractDir
  $sub = Get-ChildItem -Path $extractDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1
  if (-not $sub) {
    Write-Host "Zip 解压目录结构异常" -ForegroundColor Red
    exit 1
  }
  Ensure-Dir -Path (Split-Path -Parent $DestDir)
  if (Test-Path -LiteralPath $DestDir) { Remove-Item -Recurse -Force $DestDir }
  Copy-Item -Recurse -Force -Path $sub.FullName -Destination $DestDir
}

$skillsRoot = "$env:USERPROFILE\.codex\skills"
Ensure-Dir -Path $skillsRoot

$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) {
  $tmp = Get-TempDir
  git clone --depth 1 $RepoUrl $tmp | Out-Null
  Ensure-Dir -Path (Split-Path -Parent $Target)
  if (Test-Path -LiteralPath $Target) { Remove-Item -Recurse -Force $Target }
  Copy-Item -Recurse -Force -Path $tmp -Destination $Target
} else {
  $zipUrl = ($RepoUrl.TrimEnd('/')) + "/archive/refs/heads/main.zip"
  Download-And-ExtractZip -ZipUrl $zipUrl -DestDir $Target
}

Write-Host "Install completed" -ForegroundColor Green
Write-Host ("Skills folder: " + $Target)
Write-Host "If you use Codex CLI, restart Codex to load new skills."
