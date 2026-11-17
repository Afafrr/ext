# Hard synthetic browser bookmarks

**Entirely authored synthetic data.** These are fictional browser snapshots, not scraped pages or actual user decisions. Reserved `.example` URLs are never fetched. This is a stress test of realistic failure modes; model performance has not yet established how much harder it is than the other datasets.

| Item | Count |
|---|---:|
| Independent users | 3 |
| Selectable folders | 30 |
| Indexed bookmarks | 72 |
| Evaluation saves | 180 |
| Unique evaluation groups | 174 |
| Ambiguous/review cases | 38 |
| No suitable folder / insufficient information | 9 |

Each user has 60 evaluation saves and ten candidate folders. Some indexed folders have only one example; others have two to four. Cases are distributed for challenge coverage, not sampled to predict real-world topic frequencies.

## Users and organization

- **Engineer:** Atlas project planning, Web/API/Ops subfolders, reusable web references, NLP learning, bike gear/routes and personal book/electronics shopping. A general project folder can contain bookmarks as well as children.
- **Household:** kitchen/bathroom renovation, bills, school, health, a specific Berlin trip, general travel ideas, clothing, books and cooking.
- **Designer:** Orbit and Maple clients, each with Brand/Web subfolders; generic typography/UX references; Polish/German business administration; camera gear/photo locations.

`collections.json` records filing policies and folder scopes. `folderTree` explicitly records parent relationships and distinguishes selectable destinations from structural groups. `index.json` contains only already-filed examples. `evaluation.json` contains new saves, with expected destinations and review annotations. `descriptions.json` contains the corresponding authored manual scopes.

## What makes a case difficult

| Saved title | Page evidence | Primary destination |
|---|---|---|
| `a11y: err msg + focus po submit` | Atlas signup screen-reader and focus requirements | `Work/Atlas/Web` |
| `11s HG / 12s MS compatibility` | Bicycle cassette/freehub compatibility | `Life/Bike/Gear` |
| `zmyw. 45 do zabud. — porówn.` | Dishwasher dimensions for a kitchen renovation | `Dom/Remont/Kuchnia` |
| `BER -> Hbf, ABC czy AB?` | Airport-to-hotel transport for the Berlin trip | `Wyjazdy/2027/Berlin` |
| `Polnische Umsatzsteuer für Freelancer` | German-language page about administration for a Polish business | `Firma/Admin/PL` |
| `Do sprawdzenia` | Maple checkout payment errors | `Clients/Maple/Web` |

Languages are explicitly annotated: Polish, English, German, French, Spanish and Ukrainian, plus `und` for pages without usable language evidence. Page and user-edited titles are distinguished. Abbreviations are left in the model input; no hidden expansion dictionary is supplied.

Cross-topic cases include a programming book, school clothing, a client invoice, typography used across brand and web, and a reusable article originating in a client project. Plausible alternative destinations are listed in `acceptableAlternatives` and flagged for review. They do not automatically count as correct in the strict benchmark.

The same vague title can occur for different users, with different page descriptions and expected folders. Users are always evaluated against their own collection. Short titles without enough information are marked for review rather than treated as confidently classifiable.

## Evaluation boundaries

- Indexed examples and evaluation saves are separate. Query labels, explanations, review reasons and tags never enter model inputs.
- Six repeat saves share an evaluation duplicate group and canonical URL. They never enter the index. Ordinary accuracy counts those repeats; keep this in mind when comparing strategies.
- Nine cases have no suitable folder or no usable content. The current first-folder accuracy excludes them and Excel marks them Not scored; they do not test rejection accuracy.
- Expected destinations follow authored filing policies. Some choices remain subjective, which is why review flags and alternatives are provided.
- Descriptions clarify folder scope but are not generated from evaluation cases. No generated or domain-enriched variants are supplied.
- Exact full folder path is scored. Parent-level partial credit and a hierarchical routing algorithm are not implemented.

## Commands

```sh
npm run dataset:build:hard
npm run validate
npm run bench:mini:hard
```

The benchmark uses MiniLM-L12 Q8 with title + description and seven strategies. Retrieve-then-rerank still uses the existing larger BGE cross-encoder. Results and Excel are saved separately for each run.
