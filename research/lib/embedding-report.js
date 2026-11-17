import assert from 'node:assert/strict';
import { withCombinedSummary } from './combined-summary.js';
import { rerankerOverview } from './reranker-report.js';

const DATASETS = { real: 'Prawdziwe zakładki', 'real-derived': 'Rozszerzenie folderów — dane syntetyczne', hard: 'Trudny zbiór — dane syntetyczne' };
const STRATEGIES = {
  closest: ['Najbliższa zakładka', 'Folder najbardziej podobnej zapisanej zakładki.'],
  'folder-closest': ['Nazwa folderu + zakładka', '30% podobieństwa do nazwy/ścieżki folderu + 70% do najbliższej zakładki.'],
  'manual-closest': ['Ręczny opis + zakładka', '30% podobieństwa do ścieżki i ręcznego opisu + 70% do najbliższej zakładki.'],
  'generated-closest': ['Opis AI + zakładka', 'Jak wyżej, z wcześniej wygenerowanym opisem zamiast ręcznego.'],
  'top3-average': ['Średnia 3 zakładek', 'Średnie podobieństwo do maksymalnie 3 najbliższych zakładek w folderze.'],
  centroid: ['Centroid folderu', 'Podobieństwo do znormalizowanego średniego wektora zakładek folderu.'],
  'domain-closest': ['Opis z kontekstem domen + zakładka', 'Jak strategia z opisem, z wcześniej zapisanym opisem wzbogaconym o kontekst domen.'],
  hybrid: ['Słowa kluczowe + embedding', '80% podobieństwa do najbliższej zakładki + 20% pokrycia słów kluczowych.']
};
const fmt = (value, digits = 1) => value.toFixed(digits).replace('.', ',');
const pct = value => `${fmt(value * 100)}%`;
const signed = value => `${value > 0 ? '+' : ''}${fmt(value)}`;
const escape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/([*_`\[\]])/g, '\\$1').replace(/[\r\n]+/g, ' ');
const key = row => `${row.collectionId}/${row.id}`;
const label = id => STRATEGIES[id]?.[0] ?? id;
const folder = row => row.correct === false ? `**BŁĄD: ${escape(row.topFolder)}**` : row.correct === null ? `${escape(row.topFolder)} (nieoceniane)` : `${escape(row.topFolder)} ✓`;

export function collectEmbeddingCases(runs) {
  const cases = [];
  for (const dataset of Object.keys(DATASETS)) {
    const select = variant => runs.find(entry => entry.dataset === dataset && entry.variant === variant && entry.repeat === 1)?.run;
    const mini = select('minilm-128'), bge = select('bge-128');
    assert(mini && bge, `Missing comparison runs: ${dataset}`);
    assert.equal(mini.validation.fingerprint, bge.validation.fingerprint);
    assert.deepEqual(mini.results.map(result => result.id), bge.results.map(result => result.id));
    const maps = [mini, bge].map(run => new Map(run.results.map(result => [result.id, new Map(result.rows.map(row => [key(row), row]))])));
    for (const source of mini.results[0].rows) {
      const decisions = mini.results.map(result => {
        const [a, b] = maps.map(map => map.get(result.id).get(key(source)));
        assert(a && b, `Missing case: ${key(source)}`);
        assert.equal(a.expectedFolder, b.expectedFolder);
        assert.equal(a.queryText, b.queryText);
        return { strategy: result.id, mini: a, bge: b };
      });
      cases.push({ dataset, source, decisions, anchor: `case-${cases.length + 1}`,
        errors: decisions.reduce((total, row) => total + Number(row.mini.correct === false) + Number(row.bge.correct === false), 0) });
    }
  }
  return cases;
}

export function embeddingModelSummary(data) {
  const { summary, weights, repeats } = data;
  const rows = withCombinedSummary(summary);
  const datasets = [...Object.keys(DATASETS), 'combined'];
  const select = (dataset, variant) => {
    const row = data.rerankerSummary?.find(row => row.dataset === dataset && row.variant === variant)
      ?? rows.find(row => row.dataset === dataset && row.variant === variant && row.strategy === 'manual-closest');
    assert(row, `Missing model summary: ${dataset}/${variant}`);
    return row;
  };
  const lines = ['# MiniLM vs BGE — podsumowanie', '',
    '**MiniLM-L12 Q8 i BGE-M3 Q8, oba z limitem 128 tokenów.** Bazowe strategie działają bez rerankera. Tytuł + opis, identyczne dane i foldery kandydatów dla obu modeli.', '',
    '## Porównanie modeli — wspólna strategia', '',
    'Wspólna strategia porównania: **ręczny opis + najbliższa zakładka** (`manual-closest`). Każdy model używa tej samej strategii we wszystkich zbiorach. Różnica = BGE minus MiniLM.', '',
    '| Dataset | Oceniane / wszystkie | MiniLM — trafność (poprawne) | BGE — trafność (poprawne) | Różnica |',
    '|---|---:|---:|---:|---:|'];
  for (const dataset of datasets) {
    const a = select(dataset, 'minilm-128'), b = select(dataset, 'bge-128');
    lines.push(`| ${dataset} | ${a.scored}/${a.total} | ${pct(a.accuracy)} (${a.correct}) | ${pct(b.accuracy)} (${b.correct}) | ${signed((b.accuracy - a.accuracy) * 100)} pp |`);
  }
  const a = rows.find(row => row.dataset === 'combined' && row.variant === 'minilm-128' && row.strategy === 'manual-closest');
  const b = rows.find(row => row.dataset === 'combined' && row.variant === 'bge-128' && row.strategy === 'manual-closest');
  lines.push('', `Średnia trafności po trzech zbiorach (każdy z wagą 1/3): **MiniLM ${pct(a.macroAccuracy)} · BGE ${pct(b.macroAccuracy)}**.`, '',
    '`real`: rzeczywiste zakładki. `real-derived` i `hard`: dane syntetyczne. `combined`: suma tych trzech zbiorów, zdominowana liczebnie przez dane syntetyczne. Dziewięć przypadków bez folderu wykluczono z trafności, zachowano w pomiarach czasu. Trafność combined jest sumowana z trzech zbiorów; pomiary czasu i RAM, jeśli dostępne, pochodzą z osobnych uruchomień combined.', '',
    rerankerOverview(data),
    embeddingStrategyComparison(data),
    '## Czas i pamięć w każdym zbiorze', '',
    'Ta sama strategia `manual-closest`. Czas obejmuje embedding zapytania i wybór folderu.', '',
    '| Dataset | MiniLM — średni czas | BGE — średni czas | BGE / MiniLM | MiniLM — RAM | BGE — RAM |',
    '|---|---:|---:|---:|---:|---:|');
  for (const dataset of datasets) {
    const a = select(dataset, 'minilm-128'), b = select(dataset, 'bge-128');
    if (!Number.isFinite(a.meanMs) || !Number.isFinite(b.meanMs)) {
      lines.push('| combined | brak pomiaru | brak pomiaru | — | brak pomiaru | brak pomiaru |');
      continue;
    }
    lines.push(`| ${dataset} | ${fmt(a.meanMs, 2)} ms | ${fmt(b.meanMs, 2)} ms | ${fmt(b.meanMs / a.meanMs)}× | ${fmt(a.peakRssMiB, 0)} MiB | ${fmt(b.peakRssMiB, 0)} MiB |`);
  }
  lines.push('', `Czas: mediana średnich czasów zapytania z ${repeats} uruchomień po rozgrzewce. RAM: mediana szczytowego zużycia całego procesu (Node, model, indeks i wyniki). Ładowanie i indeksowanie są poza czasem zapytania.`, '',
    '## Rozmiar modeli', '', '| Zasób | MiniLM-L12 | BGE-M3 |', '|---|---:|---:|',
    `| Wagi ONNX Q8 | ${fmt(weights.find(row => row.id === 'minilm-128').weightsMB)} MB | ${fmt(weights.find(row => row.id === 'bge-128').weightsMB)} MB |`, '',
    '[Wszystkie strategie](comparison.md#porównanie-wszystkich-strategii) · [Pomiary techniczne, p95 i BGE-8192](metrics.md) · [Problematyczne zakładki](problematic-cases.md)', '');
  return lines.join('\n');
}

export function embeddingStrategyComparison(data) {
  const summary = withCombinedSummary(data.summary);
  const lines = ['## Porównanie wszystkich strategii', '',
    'Każdy wiersz to jedna strategia, obie kolumny modeli dotyczą tych samych przypadków. Pogrubienie oznacza najlepszą trafność w kolumnie (także remisy). Różnica = BGE minus MiniLM. Kolejność strategii jest stała we wszystkich zbiorach.', '',
    'Czas to mediana średnich czasów zapytania, obejmująca embedding i scoring. Embedding jest współdzielony między strategiami; małe różnice czasu nie stanowią wiarygodnego rankingu szybkości strategii. RAM był mierzony dla całego procesu ze wszystkimi strategiami.', ''];
  for (const [dataset, title] of Object.entries({ ...DATASETS, combined: 'Wszystkie trzy zbiory' })) {
    const mini = summary.filter(row => row.dataset === dataset && row.variant === 'minilm-128');
    const bge = summary.filter(row => row.dataset === dataset && row.variant === 'bge-128');
    assert(mini.length && mini.length === bge.length);
    const bestMini = Math.max(...mini.map(row => row.accuracy)), bestBge = Math.max(...bge.map(row => row.accuracy));
    lines.push(`### ${dataset} — ${title}`, '',
      `${mini[0].scored} ocenianych / ${mini[0].total} wszystkich przypadków.`, '',
      '| Strategia | MiniLM — trafność | BGE — trafność | Różnica | MiniLM — czas | BGE — czas |',
      '|---|---:|---:|---:|---:|---:|');
    for (const a of mini) {
      const b = bge.find(row => row.strategy === a.strategy);
      assert(b);
      const cell = (row, best) => { const text = `${pct(row.accuracy)} (${row.correct}/${row.scored})`; return row.accuracy === best ? `**${text}**` : text; };
      const time = row => {
        const measured = data.rerankerSummary?.find(item => item.dataset === dataset && item.variant === row.variant)?.strategyMeanMs?.[row.strategy] ?? row.meanMs;
        return Number.isFinite(measured) ? `${fmt(measured, 2)} ms` : 'brak pomiaru';
      };
      lines.push(`| ${label(a.strategy)} | ${cell(a, bestMini)} | ${cell(b, bestBge)} | ${signed((b.accuracy - a.accuracy) * 100)} pp | ${time(a)} | ${time(b)} |`);
    }
    const winners = (rows, best) => rows.filter(row => row.accuracy === best).map(row => label(row.strategy)).join(' / ');
    lines.push('', `Najwyższa trafność: **MiniLM — ${winners(mini, bestMini)} (${pct(bestMini)}); BGE — ${winners(bge, bestBge)} (${pct(bestBge)}).**`);
    if (dataset === 'combined') {
      lines.push('', 'Średnia po zbiorach — każdy z wagą 1/3:', '',
        '| Strategia | MiniLM | BGE |', '|---|---:|---:|');
      for (const a of mini) lines.push(`| ${label(a.strategy)} | ${pct(a.macroAccuracy)} | ${pct(bge.find(b => b.strategy === a.strategy).macroAccuracy)} |`);
    }
    if (dataset === 'hard' || dataset === 'combined') lines.push('', 'Opisy AI i kontekst domen: brak wyników, ponieważ nie przygotowano tych opisów dla hard.');
    lines.push('');
  }
  return lines.join('\n');
}

export function embeddingOverview(data) {
  const lines = [embeddingModelSummary(data)];
  lines.push('## Co oznaczają strategie?', '', '| Strategia | Sposób wyboru |', '|---|---|',
    ...Object.values(STRATEGIES).map(([name, explanation]) => `| ${name} | ${explanation} |`), '',
    'Wyniki opisują te konkretne próby. Najlepsza strategia została wybrana po obejrzeniu wyników. Przypadki oznaczone jako niejednoznaczne są oceniane względem głównego folderu; powtórzone zapisy pozostają w wynikach. Szczegóły przypadków i alternatyw są w [raporcie błędów](problematic-cases.md).', '');
  return lines.join('\n');
}

export function embeddingProblems(cases) {
  const lines = ['# Problematyczne zakładki — wszystkie strategie', '',
    'Każda zakładka występuje raz, niezależnie od trzech powtórzeń czasowych. Porównanie: MiniLM-L12 Q8 i BGE-M3 Q8, limit 128 tokenów, bez rerankera. **BŁĄD** oznacza folder różny od głównej etykiety; ✓ oznacza trafienie.', '',
    '[Wróć do podsumowania strategii](comparison.md)', ''];
  for (const [dataset, title] of Object.entries(DATASETS)) {
    const problems = cases.filter(item => item.dataset === dataset && item.errors > 0).sort((a, b) => b.errors - a.errors || a.source.id.localeCompare(b.source.id));
    lines.push(`## ${title} — ${problems.length} problematycznych zakładek`, '', 'Kolejność: od największej liczby błędnych decyzji wśród strategii obu modeli.', '');
    for (const item of problems) {
      const source = item.source;
      lines.push(`<a id="${item.anchor}"></a>`, '', `### ${escape(source.title)}`, '',
        `Przypadek: ${escape(source.collectionId)} / ${escape(source.id)}. **Oczekiwany folder: ${escape(source.expectedFolder)}.** Błędne decyzje: **${item.errors}/${item.decisions.length * 2}**.`, '',
        `Opis strony: ${escape(source.description || '(brak opisu)')}`, '');
      if (source.ambiguous) lines.push(`**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: ${source.acceptableAlternatives?.length ? source.acceptableAlternatives.map(escape).join(', ') : '(nie podano)'}. Nadal oceniane względem głównego folderu.`, '');
      if (source.tags?.length) lines.push(`Oznaczenia danych: ${source.tags.map(escape).join(', ')}.`, '');
      if (source.explanation) lines.push(`Uzasadnienie etykiety zapisane w zbiorze: ${escape(source.explanation)}`, '');
      lines.push('| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |', '|---|---|---|');
      for (const row of item.decisions) lines.push(`| ${label(row.strategy)} | ${folder(row.mini)} | ${folder(row.bge)} |`);
      lines.push('');
    }
    const unscored = cases.filter(item => item.dataset === dataset && item.source.expectedFolder === null);
    if (unscored.length) {
      lines.push('### Brak docelowego folderu — poza oceną trafności', '', 'Obecne strategie zawsze wybierają folder. Te zapisy nie są liczone jako błędne; wymagają osobnej oceny mechanizmu odrzucania. Poniżej wybory strategii z ręcznym opisem.', '', '| Zakładka | MiniLM | BGE |', '|---|---|---|');
      for (const item of unscored) { const row = item.decisions.find(row => row.strategy === 'manual-closest'); lines.push(`| ${escape(item.source.title)} | ${escape(row.mini.topFolder)} | ${escape(row.bge.topFolder)} |`); }
      lines.push('');
    }
  }
  return lines.join('\n');
}
