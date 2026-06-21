export function downloadCsv(filename, rows, columns) {
  const header = columns.map(c => c.label).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') ? `"${str}"` : str;
    }).join(',')
  ).join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonAsFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
