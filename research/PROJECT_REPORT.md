# Bookmark Classification — Project Report

## Test data

We test whether an algorithm can place a new bookmark in the right folder.

- **Index:** bookmarks already assigned to folders — examples the algorithm can compare against.
- **Test set:** new bookmarks with known correct folders — used to measure accuracy.

| Dataset | Source | Folders | Index | Test set |
|---|---|---:|---:|---:|
| `real` | Prototype data* | 6 | 11 | 21 |
| `real-derived` | Synthetic bookmarks for the same six folders and index | 6 | 11 | 120 |
| `synthetic` | Five fictional users | 30 | 55 | 150 |
| `hard` | Three fictional users; nested folders, multiple languages and ambiguous cases | 30 | 72 | 180 |
| `combined` | Union of `real`, `real-derived` and `hard`; shared real index stored once | 36 | 83 | 321 |

*The `real` index also includes illustrative job titles. The current comparison covers `real`, `real-derived`, `hard` and their `combined` union. The older 150-case `synthetic` dataset is not included in combined. Folder selection stays within each user collection; folders from different users do not compete.

## What the algorithm uses

Simplified example. Folder paths and descriptions are used depending on the strategy.

```json
{
  "newBookmark": {
    "title": "Atlas — scope v3 / do piątku",
    "description": "Zakres wydania, otwarte decyzje biznesowe i właściciele zadań zespołów."
  },
  "existingFolders": [
    {
      "path": "Work/Atlas",
      "description": "...",
      "bookmarkTitles": ["Atlas release milestones and team contacts"]
    }
  ]
}
```

## What is used to evaluate results

```json
{
  "expectedFolder": "Work/Atlas",
  "languages": ["pl"],
  "tags": ["hard-synthetic", "shorthand"],
  "ambiguous": false,
  "reviewReason": null,
  "acceptableAlternatives": [],
  "id": "hard-engineer-01",
  "synthetic": true,
  "provenance": "Authored synthetic browser bookmark; fictional URL and extracted metadata, not a real saved page.",
  "duplicateGroup": "hard-engineer-01"
}
```

`expectedFolder` checks correctness. Other fields support analysis and data validation. None of these fields is sent to the model. The current tests also exclude `url` and `headings` from model input.

Choosing `Work/Atlas` is correct; choosing `Work/Atlas/Web` is wrong. **Accuracy is the percentage of exact folder matches.**

Synthetic data represents authored examples, not observed user choices. Cases without a target folder are excluded from accuracy: 15 in `synthetic`, 9 in `hard`. Duplicate saves remain counted: 5 in `synthetic`, 6 in `hard`. Combined contains 21 real and 300 synthetic cases; 312 are scored and nine have no target folder. Its six duplicate saves are retained from hard. Combined reuses the same cases, so it adds no independent evidence.

## Models and test setup

We compared three pipelines, running locally on CPU with Q8 weights:

- **MiniLM:** multilingual MiniLM-L12 embeddings, mean pooling, 128-token limit.
- **BGE:** BGE-M3 embeddings, CLS pooling, 128-token limit.
- **MiniLM + reranker:** the same MiniLM retrieves three candidate folders using manual description + closest bookmark. **BGE-reranker-v2-m3** then scores each query–folder pair, with a 512-token pair limit. This is a separate cross-encoder, not the BGE-M3 embedding model.

All queries use **title + saved page description**. Indexed bookmark embeddings use titles. Folder descriptions are separate inputs used by the relevant strategies. Pages are not fetched during benchmark runs; the saved JSON snapshots keep the inputs fixed. A title-only ablation has not been run in this comparison.

The original embedding comparison used three sequential fresh processes per model and source dataset. The supplement added **18 fresh-process runs**: three reranker runs for each of the four datasets, plus three MiniLM and three BGE runs on combined. Source-dataset baselines reuse the original measurements; inputs, scoring code, hardware and MiniLM retrieval predictions were checked before joining the results.

Times are medians of mean query latency across three runs, after warmup. They include query embedding and scoring, plus reranking where enabled, and exclude model loading and indexing. RAM is the median of whole-process peak RSS across those runs: Node, loaded models, index and results. The reranker pipeline holds both models in memory. MiB means 1,048,576 bytes; model file sizes below use decimal MB. Repeated runs do not increase the number of evaluation cases. Measurements were collected on Apple M5, CPU inference.

The separate BGE-8192 variant did not improve accuracy over BGE-128 on these cases. Embedding model weights are **118.3 MB for MiniLM** and **569.7 MB for BGE-M3**; the BGE reranker adds approximately **570.7 MB** of weights to MiniLM.

## Strategies

| Strategy | How it selects a folder |
|---|---|
| Closest bookmark | Most similar indexed bookmark. |
| Folder + closest | 30% folder path similarity + 70% closest bookmark similarity. |
| Manual description + closest | Same 30/70 formula, using path + manual description as folder text. |
| AI description + closest | Uses a saved AI-generated description. |
| Domain-enriched description + closest | Uses a saved description enriched with domain context. |
| Top-3 average | Average similarity of up to three closest bookmarks per folder. |
| Centroid | Similarity to the folder's average, normalized bookmark vector. |
| Keywords + embedding | 80% closest bookmark similarity + 20% keyword coverage. |
| Reranker | Retrieves three folders with the manual-description strategy, then scores them with the cross-encoder. |

## Accuracy by dataset

Bold marks the highest accuracy in each row; for query time and RAM, it marks the lowest value. Ties are included.

Both embedding-only pipelines use **manual description + closest bookmark** here. The reranker starts with that same strategy using MiniLM embeddings.

| Dataset | Scored / all | MiniLM | BGE | MiniLM + reranker |
|---|---:|---:|---:|---:|
| `real` | 21/21 | 81.0% (17/21) | **85.7% (18/21)** | 71.4% (15/21) |
| `real-derived` | 120/120 | 80.8% (97/120) | 82.5% (99/120) | **85.0% (102/120)** |
| `hard` | 171/180 | 76.0% (130/171) | 84.8% (145/171) | **87.1% (149/171)** |
| `combined` | 312/321 | 78.2% (244/312) | 84.0% (262/312) | **85.3% (266/312)** |

Equal-weight mean of the three source-dataset accuracies: MiniLM 79.3%; **BGE 84.3%**; MiniLM + reranker 81.2%. Combined instead pools correct/scored counts, so the larger synthetic datasets have more weight.

## Query time by dataset

| Dataset | MiniLM | BGE | MiniLM + reranker |
|---|---:|---:|---:|
| `real` | **6.34 ms** | 33.59 ms | 213.95 ms |
| `real-derived` | **2.76 ms** | 14.82 ms | 135.73 ms |
| `hard` | **3.05 ms** | 15.80 ms | 140.37 ms |
| `combined` | **3.65 ms** | 19.91 ms | 144.43 ms |

## RAM by dataset

| Dataset | MiniLM | BGE | MiniLM + reranker |
|---|---:|---:|---:|
| `real` | **645 MiB** | 1753 MiB | 1811 MiB |
| `real-derived` | **662 MiB** | 1778 MiB | 1866 MiB |
| `hard` | **674 MiB** | 1756 MiB | 1866 MiB |
| `combined` | **697 MiB** | 1559 MiB | 1625 MiB |

Each combined RAM/time value comes from an actual combined run, not an average of the other datasets. RAM differences compare complete process peaks, not isolated model allocations.

## Strategy comparison

Combined accuracy for strategies available on all three source datasets. Bold marks the best strategy within each model column:

| Strategy | MiniLM | BGE |
|---|---:|---:|
| Closest bookmark | 70.8% (221/312) | 71.5% (223/312) |
| Folder + closest | 73.4% (229/312) | 75.3% (235/312) |
| Manual description + closest | **78.2% (244/312)** | **84.0% (262/312)** |
| Top-3 average | 77.2% (241/312) | 76.3% (238/312) |
| Centroid | 76.9% (240/312) | 71.5% (223/312) |
| Keywords + embedding | 71.5% (223/312) | 74.4% (232/312) |

Manual description + closest is the best pooled embedding-only strategy for both models. It is not the winner on every individual dataset: on real, MiniLM's top-3 average and centroid reach 85.7%, while BGE's keywords + embedding reaches 90.5%. On hard, MiniLM's top-3 average reaches 77.8%, ahead of its manual-description strategy at 76.0%.

A larger embedding model does not improve every strategy: on real-derived, MiniLM's centroid scores 76.7%, while BGE's scores 57.5%. AI/domain-description strategies have no hard results because those description variants were not prepared, so they are excluded from combined. These strategy winners were selected after examining this test set and need independent validation.

## Reranker tradeoff

On combined, MiniLM + reranker improves over MiniLM by **7.1 percentage points**, a net **22 additional correct assignments**. It fixes 44 MiniLM mistakes and introduces 22 new ones.

Compared with **BGE without reranking**, the gain is only **1.3 percentage points**, or **4 net additional correct assignments out of 312**. Query latency rises from **19.91 ms to 144.43 ms** (about **7.3×**), while whole-process RAM rises from **1559 to 1625 MiB**.

The reranker also regresses on real: **15/21**, versus **17/21 for MiniLM** and **18/21 for BGE**. Its equal-weight dataset mean is lower than BGE's. The pooled improvement comes from the larger synthetic datasets.

An earlier, separate real-derived experiment with the smaller MiniLM-L6 reranker reached **66.7% at 14.6 ms**. That historical result lacks the new RAM measurements and is not part of the three-pipeline comparison above.

<!-- suggestion-flow:start -->
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

Reproduce: `node scripts/measure-suggestion-flow.js outputs/embedding-comparison-2026-11-14T11-40-16-300Z`. Full counts, per-case displayed folders and source run paths are in [suggestion-flow.json](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/suggestion-flow.json).

<!-- suggestion-flow:end -->

## Conclusions

- **Use BGE-M3 with manual description + closest as the current accuracy/resource compromise.** It scores 84.0% on combined, versus MiniLM's 78.2%, with roughly 20 ms query latency in the combined run.
- **Keep MiniLM as the lower-resource option.** On combined it uses about 697 MiB and 3.65 ms per query, versus BGE's 1559 MiB and 19.91 ms.
- **Do not add the tested reranker to the default pipeline on this evidence.** Relative to BGE, four net extra correct assignments on combined require about seven times the query latency, another model and an extra inference stage. This assessment is specific to these measurements and workload.
- **Validate on more real bookmarks before making a production choice.** Real has only 21 cases; combined has 300 synthetic cases out of 321, includes duplicate saves and review-flagged cases, and is not independent of the source datasets. No-folder cases require a separate rejection evaluation.

## Source reports

[Model, strategy and RAM summary](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/summary.md) · [All strategy results and definitions](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/comparison.md) · [Technical measurements](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/metrics.md) · [Problematic cases](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/problematic-cases.md)

[Aggregated measurements](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/summary.json) · [Embedding source runs](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/runs.json) · [Supplemental reranker/combined source runs](outputs/embedding-comparison-2026-11-14T11-40-16-300Z/reranker-runs.json)
