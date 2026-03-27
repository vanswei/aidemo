import * as XLSX from 'xlsx';

export type SheetRowsMap = Record<string, Array<Record<string, unknown>>>;

function readFile(file: File, mode: 'arrayBuffer' | 'text'): Promise<ArrayBuffer | string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
    reader.onload = () => resolve(reader.result ?? (mode === 'text' ? '' : new ArrayBuffer(0)));

    if (mode === 'text') {
      reader.readAsText(file);
      return;
    }

    reader.readAsArrayBuffer(file);
  });
}

function parseDelimitedRows(text: string): string[][] {
  const workbook = XLSX.read(text, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  return XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    raw: true,
    defval: '',
  });
}

function formatCell(column: string, value: unknown): string {
  if (
    typeof value === 'number' &&
    (column.includes('时间') ||
      column.includes('日期') ||
      column.toLowerCase().includes('date'))
  ) {
    return XLSX.SSF.format('yyyy/mm/dd', value);
  }

  return String(value ?? '').trim();
}

function scoreHeaderRow(row: string[]): number {
  const normalized = row.map((value) => value.trim().toLowerCase());
  const canonicalMatches = [
    'platform',
    'account',
    'title',
    'publishdate',
    'contenttype',
    '时间',
    '播放',
    '喜欢',
    '评论',
    '分享',
    '关注',
    '日期',
    '数值',
  ];

  return canonicalMatches.filter((header) => normalized.includes(header)).length;
}

export function parseCsvText(text: string): Array<Record<string, unknown>> {
  const rows = parseDelimitedRows(text).filter((row) =>
    row.some((value) => String(value ?? '').trim().length > 0),
  );

  if (rows.length === 0) {
    return [];
  }

  let headerIndex = rows.findIndex((row) => scoreHeaderRow(row) >= 2);
  if (headerIndex === -1) {
    headerIndex = 0;
  }

  const header = rows[headerIndex].filter((column) => column.length > 0);

  return rows.slice(headerIndex + 1).map((row) =>
    Object.fromEntries(
      header.map((column, index) => [column, formatCell(column, row[index] ?? '')]),
    ),
  );
}

export async function readSpreadsheet(file: File): Promise<SheetRowsMap> {
  const buffer = await readFile(file, 'arrayBuffer');
  const workbook = XLSX.read(buffer, { type: 'array' });

  return Object.fromEntries(
    workbook.SheetNames.map((sheetName) => [
      sheetName,
      XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
        defval: '',
      }),
    ]),
  );
}

export async function readCsv(file: File): Promise<Array<Record<string, unknown>>> {
  const text = String(await readFile(file, 'text'));
  return parseCsvText(text);
}
