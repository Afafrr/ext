# Combined

Union of `real` (21), `real-derived` (120), and `hard` (180). The older
standalone 150-case `synthetic` dataset is not included.

- 321 evaluation cases: 312 scored, nine without a target folder.
- 21 real and 300 synthetic cases; `sourceDataset` identifies each row's source.
- Four collections, 36 selectable folders, 83 unique indexed examples.
- Real and real-derived share the original 11 indexed examples, stored once.
- Candidate folders remain local to each collection/user.
- Original labels, ambiguity flags, duplicate groups and six duplicate saves
  from hard are retained. Evaluation cases never become index examples.
- Descriptions are copied from source snapshots under `collectionId/path`.

Regenerate after source changes:

```sh
npm run dataset:build:combined
npm run validate
```

Run MiniLM with the seven strategies supported throughout (including reranking):

```sh
npm run bench:mini:combined
```

Generated/domain-description strategies are excluded because hard has no such
descriptions. The standalone run measures combined execution. The embedding
comparison instead pools saved accuracy counts without additional inference;
it also reports the mean of the three dataset accuracies (equal dataset weight).
It does not infer combined execution latency or memory from separate runs.
