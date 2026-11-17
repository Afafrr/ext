## Adaptive one-or-two-folder suggestions

Measured from saved `manual-closest` predictions for MiniLM-L12 Q8 and BGE-M3 Q8, both at 128 tokens. No new inference or threshold tuning. A case is "confident" when the first score is at least **0.55** and its margin over the second score is at least **0.05**. Show **one folder** for confident cases and **two folders** for all other cases. These are existing heuristic thresholds, not calibrated probabilities.

Success means the expected folder appears among the displayed suggestions; it does not mean the user picked it. The nine no-target-folder cases in hard/combined are excluded from these rates. Expected-folder alternatives remain strict mismatches. Each source case is counted once; rankings and confidence were verified across all three saved repeats. Combined pools the same source cases, retaining duplicates.

### Fixed suggestion counts

Bold marks the higher hit rate between models within each dataset and metric (including ties).

| Dataset | Model | Always 1 folder | Always 2 folders | Always 3 folders |
|---|---|---:|---:|---:|
| `real` | MiniLM | 81.0% (17/21) | **95.2% (20/21)** | **100.0% (21/21)** |
| `real` | BGE | **85.7% (18/21)** | **95.2% (20/21)** | **100.0% (21/21)** |
| `real-derived` | MiniLM | 80.8% (97/120) | **95.8% (115/120)** | **100.0% (120/120)** |
| `real-derived` | BGE | **82.5% (99/120)** | **95.8% (115/120)** | **100.0% (120/120)** |
| `hard` | MiniLM | 76.0% (130/171) | 91.8% (157/171) | 97.1% (166/171) |
| `hard` | BGE | **84.8% (145/171)** | **95.3% (163/171)** | **98.8% (169/171)** |
| `combined` | MiniLM | 78.2% (244/312) | 93.6% (292/312) | 98.4% (307/312) |
| `combined` | BGE | **84.0% (262/312)** | **95.5% (298/312)** | **99.4% (310/312)** |

### Adaptive flow: coverage and accuracy

The one-folder share uses all scored cases as denominator. Branch hit rates use only the cases in that branch. Overall success combines correct single suggestions and two-suggestion hits.

| Dataset | Model | Shown 1: share | Shown 1: correct | Shown 2: expected included | Overall success |
|---|---|---:|---:|---:|---:|
| `real` | MiniLM | 14.3% (3/21) | 100.0% (3/3) | 94.4% (17/18) | **95.2% (20/21)** |
| `real` | BGE | 19.0% (4/21) | 100.0% (4/4) | 94.1% (16/17) | **95.2% (20/21)** |
| `real-derived` | MiniLM | 15.8% (19/120) | 84.2% (16/19) | 95.0% (96/101) | 93.3% (112/120) |
| `real-derived` | BGE | 23.3% (28/120) | 96.4% (27/28) | 94.6% (87/92) | **95.0% (114/120)** |
| `hard` | MiniLM | 38.0% (65/171) | 92.3% (60/65) | 87.7% (93/106) | 89.5% (153/171) |
| `hard` | BGE | 38.0% (65/171) | 98.5% (64/65) | 92.5% (98/106) | **94.7% (162/171)** |
| `combined` | MiniLM | 27.9% (87/312) | 90.8% (79/87) | 91.6% (206/225) | 91.3% (285/312) |
| `combined` | BGE | 31.1% (97/312) | 97.9% (95/97) | 93.5% (201/215) | **94.9% (296/312)** |
With the current thresholds, MiniLM shows one folder for 27.9% (87/312) of scored cases; 8 of those suggestions are wrong. BGE shows one for 31.1% (97/312); 2 are wrong. Overall adaptive hit rates are **91.3% (285/312) for MiniLM** and **94.9% (296/312) for BGE**.

Compared with always showing two folders, the confidence rule hides the correct second choice in **7 MiniLM cases** and **2 BGE cases**. This is the measured cost of showing a single suggestion.

Interpretation: the one-or-two UI is viable to prototype, but current MiniLM confidence leaves meaningful single-suggestion errors. BGE gives a more reliable single-suggestion branch on this sample. Keep an explicit folder picker, calibrate thresholds separately per model on held-out real data, and measure the tradeoff between single-suggestion precision and coverage. Do not infer these hit rates from the earlier top-3 results or treat the small real set as a production guarantee.

Reproduce: `node scripts/measure-suggestion-flow.js outputs/embedding-comparison-2026-11-14T11-40-16-300Z`. Full counts, per-case displayed folders and source run paths are in [suggestion-flow.json](suggestion-flow.json).
