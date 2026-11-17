# Bookmark strategy comparison

[Project report](PROJECT_REPORT.md) · [Reports and archive](outputs/README.md)

One embedding model, one query format, nine strategies. The default uses **BGE-M3 Q8** on the **21 real evaluation bookmarks**, with **11 indexed examples in six folders**. Each strategy chooses its first folder; accuracy is simply how often that folder matches the expected one.

## Run

```sh
npm ci
npm test
npm run bench
```

Run the same strategies with the smaller multilingual MiniLM-L12 Q8 model:

```sh
npm run bench -- benchmark.minilm.config.json
```

This uses mean pooling and a 128-token limit, and saves a separate run and Excel report. Strategy 9 still uses the same cross-encoder reranker; MiniLM supplies its candidate retrieval embeddings.

Run MiniLM on the 150 synthetic bookmarks:

```sh
npm run bench:mini:synthetic
```

This uses `benchmark.minilm.synthetic.config.json` and runs seven strategies. Generated-description and domain-enriched strategies are excluded because those variants are not prepared for synthetic folders. Manual descriptions come from the existing authored collections. The reranking strategy still uses the same larger cross-encoder.

Run a larger evaluation based on the existing real folders:

```sh
npm run bench:mini:real-derived
```

Try the lightweight MiniLM-L6 Q8 reranker on the same derived dataset:

```sh
npm run bench:mini:light-reranker
```

This changes only the reranker to [Xenova/ms-marco-MiniLM-L-6-v2](https://huggingface.co/Xenova/ms-marco-MiniLM-L-6-v2); candidate retrieval still uses multilingual MiniLM-L12 Q8. It is trained on English MS MARCO, so mixed-language accuracy needs evaluation. The quantized reranker weights are about 23 MB, compared with about 571 MB for BGE. Existing configurations continue using BGE. Each report identifies its reranker below the summary.

This evaluates **120 additional synthetic pages**, 20 for each real folder, using all nine strategies. They are in `datasets/real/derived-evaluation.json`, with explicit synthetic provenance, expected labels, explanations and review flags. The same original 11 indexed examples and description variants are reused, so this expands the evaluation without also changing the index. The original 21 real evaluation cases remain a separate `real` dataset; an additional `combined` view pools counts while preserving the separate results.

The expansion includes Polish/English pages, vague titles, missing/noisy metadata, topic overlaps and confusing names (for example, a Ruby-titled song or a programming book). It has no duplicates and no no-folder cases. These authored examples reflect our interpretation of the existing folders, not additional observed user decisions. A larger synthetic expansion does not resolve the shortage of real-world evidence. Regenerate it with `npm run dataset:build:real-derived`.

Run the harder nested, multilingual browser-bookmark dataset:

```sh
npm run bench:mini:hard
```

`datasets/hard/` contains 180 synthetic saves across three independent users and 30 candidate folders, with 72 separate indexed examples. Paths reach three levels; structural parents are recorded in each collection's `folderTree`, including nonselectable grouping nodes. The runner compares full candidate paths rather than traversing the tree one level at a time.

Cases include Polish, English, German, French, Spanish and Ukrainian; language mixing; user-edited titles; abbreviations; incomplete/noisy metadata; similar sibling folders; project-versus-reference filing; and jurisdiction-versus-language differences. There are 38 review-flagged cases, nine no-folder cases, and six duplicate saves confined to evaluation. Descriptions are manual; seven strategies are enabled, including the larger cross-encoder reranker. See `datasets/hard/README.md` for examples and scope. Regenerate with `npm run dataset:build:hard`.

Run all three comparison datasets together:

```sh
npm run dataset:build:combined
npm run bench:mini:combined
```

`combined` contains 321 cases (`real` + `real-derived` + `hard`), including 312 scored and nine no-folder cases. It retains source annotations and collection-local candidate folders, and stores the shared real index only once: 83 indexed examples across four collections. Seven strategies are supported, including reranking. See [dataset details](datasets/combined/README.md). The older standalone 150-case `synthetic` dataset is not included.

The first run downloads the embedding model and reranker. Later runs use `.cache/models`. Everything runs locally on CPU. Each run saves a new `results/<run-id>/run.json` and creates `outputs/<run-id>/comparison.xlsx`.

Regenerate Excel without running models:

```sh
npm run report -- results/<run-id>/run.json
```

Excel uses the installed Codex Artifact Tool runtime. Its default location is `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules`; set `ARTIFACT_NODE_MODULES` if yours differs. Set `report: false` to save benchmark JSON without Excel.

## Embedding model comparison

Compare small and large embedding models **without a reranker**:

```sh
npm run bench:compare:embeddings
```

This runs MiniLM-L12 Q8 (128 tokens), BGE-M3 Q8 (128 tokens), and BGE-M3 Q8 (the existing 8192-token limit) on `real`, `real-derived`, and `hard`. It uses cached models only, three sequential fresh processes per variant/dataset, and rotates variant order. Set `BENCH_REPEATS` to change repetition count. Reports in `outputs/embedding-comparison-*/` compare accuracy, paired fixes/regressions, latency, model weight size, setup/indexing time, and whole-process peak RSS. The synthetic datasets remain separate from real evidence. Currency costs require a deployment price and workload; the report compares resource costs only. Each underlying benchmark is retained under `results/`.

The comparison report is in Polish: `summary.md` compares MiniLM and BGE side by side for every dataset (accuracy using the same manual-description strategy, query time, peak process RAM, and weight size). Both `summary.md` and `comparison.md` include per-dataset strategy tables with both models side by side, accuracy, query time, highlighted best accuracy, and equal-weight dataset means for combined. `comparison.md` also explains the scoring strategies. Combined timing and RAM are marked as unmeasured until the supplemental reranker comparison supplies separate combined measurements. `problematic-cases.md` includes every case with at least one wrong assignment across the two 128-token variants, all strategy decisions, expected folders, and ambiguity annotations. `metrics.md` retains the technical measurements and the BGE-8192 results. Regenerate these views from saved results without running models:

```sh
npm run report:embeddings -- outputs/embedding-comparison-<timestamp>
```

Add a measured comparison with MiniLM-L12 + BGE-reranker-v2-m3 Q8:

```sh
npm run bench:compare:reranker -- outputs/embedding-comparison-<timestamp>
```

This uses cached models and sequential fresh processes, three repeats per dataset by default (`BENCH_REPEATS` overrides the count). It measures the reranking pipeline separately on `real`, `real-derived`, `hard`, and `combined`, and adds no-reranker MiniLM/BGE measurements for `combined`. Existing no-reranker source-dataset measurements are reused after checking inputs, retrieval predictions, scoring code and hardware. New source paths are retained in `reranker-runs.json`; `summary.json` stores `rerankerSummary`. The command resumes recorded runs and regenerates both Markdown summaries with accuracy, timing and whole-process RAM for all three pipelines. Use a new comparison directory for a new experiment.

## Strategies

All embedding vectors are normalized; similarity is their dot product. Examples always use bookmark titles. Query fields default to title + description, identically for every strategy.

| Strategy ID | Scoring |
|---|---|
| `closest` | Highest example similarity in the folder |
| `folder-closest` | 30% folder **name/path only** + 70% closest example |
| `manual-closest` | 30% path + manual description embedding, plus 70% closest example |
| `generated-closest` | Same formula with the generated description |
| `top3-average` | Mean of the three most similar examples, or all examples if fewer than three |
| `centroid` | Similarity to the normalized mean embedding of the folder's examples |
| `domain-closest` | Same 30/70 formula with a description generated using domain homepage context |
| `hybrid` | 80% closest-example similarity + 20% exact keyword coverage |
| `rerank` | Retrieve three folders using manual-description 30/70 scoring, then rank them with a cross-encoder |

For description strategies, folder text is `path + description`; the 30% applies to the embedding of this combined text. The remaining 70% always comes from the closest indexed bookmark.

Keyword coverage is the fraction of distinct query terms found in the folder path or indexed titles, with case normalization and a small English/Polish stopword list. Whole names such as `C++` and `React.js` are retained. It is a simple baseline, not BM25.

Reranking uses [onnx-community/bge-reranker-v2-m3-ONNX](https://huggingface.co/onnx-community/bge-reranker-v2-m3-ONNX), Q8. Each query is paired with a candidate's path, manual description and indexed titles. Its single relevance logit determines the final order; it cannot recover a folder outside the three retrieved candidates. Reranking time is included in query time.

## Configuration and descriptions

Edit `benchmark.config.json`: choose the dataset, embedding model, query fields, description file, enabled strategy IDs and reranker settings. Remove strategy IDs to run a smaller comparison. There is no model/field combination grid. For another config use `npm run bench -- path/to/config.json`.

`datasets/real/descriptions.json` contains the three description variants plus their provenance and saved homepage metadata. They are copied from the prototype's actual manual/Qwen3-0.6B experiments, based on indexed examples. They are **not regenerated during benchmark runs**. Generation timestamps, model and prompt version are retained. This keeps the comparison reproducible without adding another setup pipeline.

Generated mistakes are deliberately preserved: one snapshot calls the clothes folder “Polish food.” The H&M homepage was unavailable in the domain experiment. Homepage sources were supplied for that experiment; they are not claimed to be recovered original bookmark URLs. Domain results therefore measure that saved setup, including its missing context and generation errors.

The original real index and evaluation files remain unchanged. Descriptions are separate. A query's expected label and other evaluation annotations are never model inputs.

## Excel and saved results

Summary has only Dataset, Strategy, First-choice accuracy, Certain enough (%), Correct, Wrong and Avg time (ms). Case rows show Case ID, Title, Expected folder, Strategy, First folder, Score, Certain enough?, Result and Time (ms). Filter by strategy or case; headers and identifying columns are frozen.

Certainty is separate from correctness. For embedding strategies it checks the existing uncalibrated score/margin cutoffs (`0.55` and `0.05` by default). Reranker certainty is `n.a.` because its logits have a different scale. Scores are not probabilities. No threshold can change the chosen folder in this comparison.

No-folder cases are visible as Not scored and excluded from accuracy/correct/wrong/certainty. Time includes every query. Every strategy receives the same query embedding; timings include embedding, scoring and any reranking, and exclude model setup, indexing and Excel. There is one timing sample per case after warmup.

Saved JSON includes predictions, scores, timings, dataset/config/description snapshots and scoring source. Older runs and their reports remain available; the report reader also supports the previous run format. Model repositories use their default revision, so weights are not pinned to immutable versions.

`npm run dataset:build` regenerates the synthetic examples and manual-description file, and `npm run validate` checks all datasets for labels and duplicate leakage. Synthetic descriptions are keyed by `collectionId/folder path`. To enable the two remaining synthetic strategies, add genuine generated/domain descriptions; the runner rejects missing variants instead of silently using another one.

The real set is small, and the two sparsest folders have one example each. Top-3 averaging consequently equals closest-only for those folders. Results describe this evaluation set, not a general winner.
