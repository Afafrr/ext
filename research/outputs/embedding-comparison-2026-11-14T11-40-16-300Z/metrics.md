# Embedding cost / accuracy comparison

No reranker. 3 sequential fresh processes per dataset and variant; order rotates each repeat. Cached local Q8 models, CPU inference.

Query = title + description; same index, descriptions, scoring and evaluation cases across variants. BGE-128 and MiniLM-128 share a token cap, but their tokenizers differ. BGE-8192 measures the existing long-context configuration.

Latency excludes loading and indexing, includes query embedding and scoring after warmup. Reported mean/p50/p95 are medians across repeats; mean range shows timing variability. Repeats do not increase the number of independent evaluation cases. Peak RSS covers the entire fresh Node process, including runtime, index and results; it is not model-only RAM.

The 21 real cases are reported separately from the 120 synthetic real-derived and 180 synthetic hard cases. Nine hard cases have no target folder: excluded from accuracy and paired differences, included in latency. Review-flagged and duplicate evaluation cases remain in these descriptive scores.

No currency cost is assumed. Added seconds per 1,000 queries extrapolate sequential measured latency; they are not CPU billing or production throughput. Hosting prices, concurrency and workload volume are needed for a monetary estimate.

Machine: Apple M5; darwin/arm64; v26.13.1.

| Variant | Quantized ONNX weights (MB, decimal) |
|---|---:|
| minilm-128 | 118.3 |
| bge-128 | 569.7 |
| bge-8192 | 569.7 |

## real

| Variant | Strategy | Correct | Accuracy | Mean ms (range) | p95 ms | Peak RSS MiB | Fixed / regressed vs MiniLM |
|---|---|---:|---:|---:|---:|---:|---:|
| minilm-128 | closest | 16/21 | 76.2% | 6.33 (6.21–6.36) | 9.74 | 645 | 0 / 0 |
| minilm-128 | folder-closest | 16/21 | 76.2% | 6.34 (6.21–6.37) | 9.75 | 645 | 0 / 0 |
| minilm-128 | manual-closest | 17/21 | 81.0% | 6.34 (6.21–6.36) | 9.76 | 645 | 0 / 0 |
| minilm-128 | generated-closest | 16/21 | 76.2% | 6.33 (6.21–6.36) | 9.75 | 645 | 0 / 0 |
| minilm-128 | top3-average | 18/21 | 85.7% | 6.32 (6.20–6.34) | 9.74 | 645 | 0 / 0 |
| minilm-128 | centroid | 18/21 | 85.7% | 6.33 (6.21–6.36) | 9.76 | 645 | 0 / 0 |
| minilm-128 | domain-closest | 16/21 | 76.2% | 6.33 (6.21–6.36) | 9.75 | 645 | 0 / 0 |
| minilm-128 | hybrid | 17/21 | 81.0% | 6.46 (6.34–6.49) | 10.02 | 645 | 0 / 0 |
| bge-128 | closest | 17/21 | 81.0% | 33.56 (33.24–34.19) | 49.61 | 1753 | 3 / 2 |
| bge-128 | folder-closest | 14/21 | 66.7% | 33.59 (33.25–34.21) | 49.63 | 1753 | 3 / 5 |
| bge-128 | manual-closest | 18/21 | 85.7% | 33.59 (33.25–34.21) | 49.64 | 1753 | 2 / 1 |
| bge-128 | generated-closest | 18/21 | 85.7% | 33.58 (33.25–34.21) | 49.64 | 1753 | 3 / 1 |
| bge-128 | top3-average | 15/21 | 71.4% | 33.54 (33.21–34.17) | 49.60 | 1753 | 3 / 6 |
| bge-128 | centroid | 18/21 | 85.7% | 33.59 (33.25–34.21) | 49.64 | 1753 | 3 / 3 |
| bge-128 | domain-closest | 18/21 | 85.7% | 33.59 (33.25–34.22) | 49.63 | 1753 | 3 / 1 |
| bge-128 | hybrid | 19/21 | 90.5% | 33.71 (33.37–34.33) | 49.67 | 1753 | 3 / 1 |
| bge-8192 | closest | 17/21 | 81.0% | 34.44 (34.03–34.76) | 53.35 | 1781 | 3 / 2 |
| bge-8192 | folder-closest | 14/21 | 66.7% | 34.46 (34.05–34.80) | 53.37 | 1781 | 3 / 5 |
| bge-8192 | manual-closest | 18/21 | 85.7% | 34.47 (34.05–34.79) | 53.38 | 1781 | 2 / 1 |
| bge-8192 | generated-closest | 18/21 | 85.7% | 34.46 (34.05–34.79) | 53.37 | 1781 | 3 / 1 |
| bge-8192 | top3-average | 15/21 | 71.4% | 34.41 (34.01–34.74) | 53.33 | 1781 | 3 / 6 |
| bge-8192 | centroid | 18/21 | 85.7% | 34.45 (34.04–34.79) | 53.37 | 1781 | 3 / 3 |
| bge-8192 | domain-closest | 18/21 | 85.7% | 34.45 (34.04–34.78) | 53.37 | 1781 | 3 / 1 |
| bge-8192 | hybrid | 19/21 | 90.5% | 34.62 (34.17–34.97) | 53.41 | 1781 | 3 / 1 |

Same-strategy cost comparison (manual descriptions + closest example):

| Variant | Accuracy gain (pp) | Latency multiplier | Added seconds / 1,000 queries | Setup ms | Indexing ms |
|---|---:|---:|---:|---:|---:|
| minilm-128 | 0.0 | 1.0× | 0.00 | 309 | 77 |
| bge-128 | 4.8 | 5.3× | 27.25 | 609 | 343 |
| bge-8192 | 4.8 | 5.4× | 28.13 | 611 | 341 |

## real-derived

| Variant | Strategy | Correct | Accuracy | Mean ms (range) | p95 ms | Peak RSS MiB | Fixed / regressed vs MiniLM |
|---|---|---:|---:|---:|---:|---:|---:|
| minilm-128 | closest | 88/120 | 73.3% | 2.76 (2.56–2.78) | 4.08 | 662 | 0 / 0 |
| minilm-128 | folder-closest | 94/120 | 78.3% | 2.76 (2.58–2.79) | 4.08 | 662 | 0 / 0 |
| minilm-128 | manual-closest | 97/120 | 80.8% | 2.76 (2.57–2.79) | 4.08 | 662 | 0 / 0 |
| minilm-128 | generated-closest | 93/120 | 77.5% | 2.76 (2.57–2.79) | 4.08 | 662 | 0 / 0 |
| minilm-128 | top3-average | 90/120 | 75.0% | 2.75 (2.56–2.77) | 4.06 | 662 | 0 / 0 |
| minilm-128 | centroid | 92/120 | 76.7% | 2.76 (2.57–2.79) | 4.08 | 662 | 0 / 0 |
| minilm-128 | domain-closest | 92/120 | 76.7% | 2.76 (2.57–2.79) | 4.08 | 662 | 0 / 0 |
| minilm-128 | hybrid | 87/120 | 72.5% | 2.80 (2.61–2.82) | 4.11 | 662 | 0 / 0 |
| bge-128 | closest | 73/120 | 60.8% | 14.79 (14.60–14.85) | 18.10 | 1778 | 10 / 25 |
| bge-128 | folder-closest | 85/120 | 70.8% | 14.82 (14.64–14.87) | 18.13 | 1778 | 8 / 17 |
| bge-128 | manual-closest | 99/120 | 82.5% | 14.82 (14.64–14.87) | 18.13 | 1778 | 11 / 9 |
| bge-128 | generated-closest | 91/120 | 75.8% | 14.83 (14.65–14.87) | 18.14 | 1778 | 10 / 12 |
| bge-128 | top3-average | 79/120 | 65.8% | 14.78 (14.60–14.83) | 18.10 | 1778 | 13 / 24 |
| bge-128 | centroid | 69/120 | 57.5% | 14.81 (14.64–14.87) | 18.13 | 1778 | 6 / 29 |
| bge-128 | domain-closest | 87/120 | 72.5% | 14.81 (14.65–14.87) | 18.13 | 1778 | 10 / 15 |
| bge-128 | hybrid | 76/120 | 63.3% | 14.84 (14.66–14.90) | 18.14 | 1778 | 10 / 21 |
| bge-8192 | closest | 73/120 | 60.8% | 14.51 (14.37–14.91) | 18.27 | 1781 | 10 / 25 |
| bge-8192 | folder-closest | 85/120 | 70.8% | 14.53 (14.40–14.93) | 18.33 | 1781 | 8 / 17 |
| bge-8192 | manual-closest | 99/120 | 82.5% | 14.54 (14.40–14.92) | 18.34 | 1781 | 11 / 9 |
| bge-8192 | generated-closest | 91/120 | 75.8% | 14.53 (14.40–14.93) | 18.32 | 1781 | 10 / 12 |
| bge-8192 | top3-average | 79/120 | 65.8% | 14.49 (14.36–14.88) | 18.24 | 1781 | 13 / 24 |
| bge-8192 | centroid | 69/120 | 57.5% | 14.55 (14.39–14.92) | 18.34 | 1781 | 6 / 29 |
| bge-8192 | domain-closest | 87/120 | 72.5% | 14.53 (14.39–14.92) | 18.32 | 1781 | 10 / 15 |
| bge-8192 | hybrid | 76/120 | 63.3% | 14.56 (14.42–14.96) | 18.33 | 1781 | 10 / 21 |

Same-strategy cost comparison (manual descriptions + closest example):

| Variant | Accuracy gain (pp) | Latency multiplier | Added seconds / 1,000 queries | Setup ms | Indexing ms |
|---|---:|---:|---:|---:|---:|
| minilm-128 | 0.0 | 1.0× | 0.00 | 305 | 66 |
| bge-128 | 1.7 | 5.4× | 12.05 | 609 | 340 |
| bge-8192 | 1.7 | 5.3× | 11.77 | 601 | 346 |

## hard

| Variant | Strategy | Correct | Accuracy | Mean ms (range) | p95 ms | Peak RSS MiB | Fixed / regressed vs MiniLM |
|---|---|---:|---:|---:|---:|---:|---:|
| minilm-128 | closest | 117/171 | 68.4% | 3.04 (2.86–3.27) | 4.65 | 674 | 0 / 0 |
| minilm-128 | folder-closest | 119/171 | 69.6% | 3.05 (2.87–3.28) | 4.74 | 674 | 0 / 0 |
| minilm-128 | manual-closest | 130/171 | 76.0% | 3.05 (2.87–3.29) | 4.66 | 674 | 0 / 0 |
| minilm-128 | top3-average | 133/171 | 77.8% | 3.02 (2.85–3.26) | 4.60 | 674 | 0 / 0 |
| minilm-128 | centroid | 130/171 | 76.0% | 3.04 (2.87–3.28) | 4.58 | 674 | 0 / 0 |
| minilm-128 | hybrid | 119/171 | 69.6% | 3.08 (2.91–3.32) | 4.61 | 674 | 0 / 0 |
| bge-128 | closest | 133/171 | 77.8% | 15.78 (15.76–16.28) | 20.11 | 1756 | 32 / 16 |
| bge-128 | folder-closest | 136/171 | 79.5% | 15.80 (15.79–16.32) | 20.11 | 1756 | 30 / 13 |
| bge-128 | manual-closest | 145/171 | 84.8% | 15.80 (15.79–16.33) | 20.12 | 1756 | 24 / 9 |
| bge-128 | top3-average | 144/171 | 84.2% | 15.73 (15.73–16.25) | 20.06 | 1756 | 19 / 8 |
| bge-128 | centroid | 136/171 | 79.5% | 15.80 (15.79–16.33) | 20.11 | 1756 | 19 / 13 |
| bge-128 | hybrid | 137/171 | 80.1% | 15.81 (15.80–16.33) | 20.11 | 1756 | 31 / 13 |
| bge-8192 | closest | 133/171 | 77.8% | 16.15 (15.94–16.32) | 20.96 | 1776 | 32 / 16 |
| bge-8192 | folder-closest | 136/171 | 79.5% | 16.17 (15.95–16.36) | 21.01 | 1776 | 30 / 13 |
| bge-8192 | manual-closest | 145/171 | 84.8% | 16.17 (15.96–16.36) | 21.01 | 1776 | 24 / 9 |
| bge-8192 | top3-average | 144/171 | 84.2% | 16.11 (15.88–16.29) | 20.95 | 1776 | 19 / 8 |
| bge-8192 | centroid | 136/171 | 79.5% | 16.17 (15.94–16.37) | 21.02 | 1776 | 19 / 13 |
| bge-8192 | hybrid | 137/171 | 80.1% | 16.19 (15.95–16.37) | 20.99 | 1776 | 31 / 13 |

Same-strategy cost comparison (manual descriptions + closest example):

| Variant | Accuracy gain (pp) | Latency multiplier | Added seconds / 1,000 queries | Setup ms | Indexing ms |
|---|---:|---:|---:|---:|---:|
| minilm-128 | 0.0 | 1.0× | 0.00 | 309 | 246 |
| bge-128 | 8.8 | 5.2× | 12.75 | 604 | 1270 |
| bge-8192 | 8.8 | 5.3× | 13.12 | 602 | 1280 |

Individual benchmark paths are recorded in runs.json. Summary JSON includes paired case-level fixes/regressions. Treat these small authored datasets as evidence for this workload, not a universal model ranking.

## Combined — wszystkie trzy zbiory

Połączenie zapisanych wyników real + real-derived + hard: 321 przypadków, 312 ocenianych; 9 bez folderu poza trafnością. Zachowano 6 powtórzonych zapisów z hard. To mieszanka 21 rzeczywistych i 300 syntetycznych przypadków, z zachowaniem folderów kandydatów w obrębie użytkownika.

Combined = suma trafień / suma ocenianych przypadków. Średnia po zbiorach = średnia trzech trafności, każdy zbiór z wagą 1/3. Uwzględniono tylko strategie obecne we wszystkich trzech zbiorach dla danego wariantu. Nie uruchamiano ponownie modeli; nie podajemy czasu ani RAM dla wspólnego uruchomienia.

| Wariant | Strategia | Poprawnie | Combined | Średnia po zbiorach |
|---|---|---:|---:|---:|
| minilm-128 | closest | 221/312 | 70,8% | 72,6% |
| minilm-128 | folder-closest | 229/312 | 73,4% | 74,7% |
| minilm-128 | manual-closest | 244/312 | 78,2% | 79,3% |
| minilm-128 | top3-average | 241/312 | 77,2% | 79,5% |
| minilm-128 | centroid | 240/312 | 76,9% | 79,5% |
| minilm-128 | hybrid | 223/312 | 71,5% | 74,3% |
| bge-128 | closest | 223/312 | 71,5% | 73,2% |
| bge-128 | folder-closest | 235/312 | 75,3% | 72,3% |
| bge-128 | manual-closest | 262/312 | 84,0% | 84,3% |
| bge-128 | top3-average | 238/312 | 76,3% | 73,8% |
| bge-128 | centroid | 223/312 | 71,5% | 74,2% |
| bge-128 | hybrid | 232/312 | 74,4% | 78,0% |
| bge-8192 | closest | 223/312 | 71,5% | 73,2% |
| bge-8192 | folder-closest | 235/312 | 75,3% | 72,3% |
| bge-8192 | manual-closest | 262/312 | 84,0% | 84,3% |
| bge-8192 | top3-average | 238/312 | 76,3% | 73,8% |
| bge-8192 | centroid | 223/312 | 71,5% | 74,2% |
| bge-8192 | hybrid | 232/312 | 74,4% | 78,0% |
