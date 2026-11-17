# Reports

## Current

- [Project report](../PROJECT_REPORT.md)
- [MiniLM vs BGE: summary per dataset](embedding-comparison-2026-11-14T11-40-16-300Z/summary.md)
- [MiniLM vs BGE: strategy results](embedding-comparison-2026-11-14T11-40-16-300Z/comparison.md)
- [Problematic bookmarks](embedding-comparison-2026-11-14T11-40-16-300Z/problematic-cases.md)
- [Technical measurements](embedding-comparison-2026-11-14T11-40-16-300Z/metrics.md)

The comparison folder also contains `summary.json` (aggregated measurements) and `runs.json` (paths to the source runs). The overview and technical report include `combined` accuracy and an equal-weight mean of the three source accuracies for strategies available throughout; these reuse saved predictions without model inference. The additional MiniLM + BGE-reranker comparison includes measured query times and whole-process RAM per dataset, including separate combined measurements. Its source runs are in `reranker-runs.json` and its aggregates in `summary.json` under `rerankerSummary`.

## Archive

[Earlier Excel reports](archive/README.md) are grouped by their original run IDs.

Source predictions, configurations and scoring snapshots are kept in `results/`. Removed output files were generated previews, inspection dumps, successful-run logs and duplicate configuration copies.
