import assert from 'node:assert/strict';

export const COMBINED_SOURCES = ['real', 'real-derived', 'hard'];

// Pool accuracy counts only. Separate-process timing/RSS cannot describe a combined run.
export function withCombinedSummary(summary) {
  const original = summary.filter(row => row.dataset !== 'combined');
  const combined = [];
  for (const first of original.filter(row => row.dataset === COMBINED_SOURCES[0])) {
    const rows = COMBINED_SOURCES.map(dataset => {
      const matches = original.filter(row => row.dataset === dataset && row.variant === first.variant && row.strategy === first.strategy);
      assert(matches.length <= 1, `Duplicate summary: ${dataset}/${first.variant}/${first.strategy}`);
      return matches[0];
    });
    if (rows.some(row => !row)) continue;
    const sum = field => rows.reduce((total, row) => total + row[field], 0);
    const scored = sum('scored'), correct = sum('correct');
    combined.push({ dataset: 'combined', variant: first.variant, strategy: first.strategy,
      sources: [...COMBINED_SOURCES], aggregation: 'pooled-saved-results',
      total: sum('total'), scored, correct, accuracy: scored ? correct / scored : null,
      macroAccuracy: rows.reduce((total, row) => total + row.accuracy, 0) / rows.length,
      fixed: sum('fixed'), regressed: sum('regressed'),
      differences: rows.flatMap(row => row.differences.map(item => ({ ...item, sourceDataset: row.dataset }))) });
  }
  return [...original, ...combined];
}

export function combinedOverview(summary) {
  const rows = withCombinedSummary(summary).filter(row => row.dataset === 'combined');
  if (!rows.length) return '';
  const percent = value => `${(value * 100).toFixed(1).replace('.', ',')}%`;
  return [
    '## Combined — wszystkie trzy zbiory', '',
    'Połączenie zapisanych wyników real + real-derived + hard: 321 przypadków, 312 ocenianych; 9 bez folderu poza trafnością. Zachowano 6 powtórzonych zapisów z hard. To mieszanka 21 rzeczywistych i 300 syntetycznych przypadków, z zachowaniem folderów kandydatów w obrębie użytkownika.', '',
    'Combined = suma trafień / suma ocenianych przypadków. Średnia po zbiorach = średnia trzech trafności, każdy zbiór z wagą 1/3. Uwzględniono tylko strategie obecne we wszystkich trzech zbiorach dla danego wariantu. Nie uruchamiano ponownie modeli; nie podajemy czasu ani RAM dla wspólnego uruchomienia.', '',
    '| Wariant | Strategia | Poprawnie | Combined | Średnia po zbiorach |',
    '|---|---|---:|---:|---:|',
    ...rows.map(row => `| ${row.variant} | ${row.strategy} | ${row.correct}/${row.scored} | ${percent(row.accuracy)} | ${percent(row.macroAccuracy)} |`), ''
  ].join('\n');
}
