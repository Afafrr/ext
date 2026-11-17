# MiniLM vs BGE — podsumowanie

**MiniLM-L12 Q8 i BGE-M3 Q8, oba z limitem 128 tokenów.** Bazowe strategie działają bez rerankera. Tytuł + opis, identyczne dane i foldery kandydatów dla obu modeli.

## Porównanie modeli — wspólna strategia

Wspólna strategia porównania: **ręczny opis + najbliższa zakładka** (`manual-closest`). Każdy model używa tej samej strategii we wszystkich zbiorach. Różnica = BGE minus MiniLM.

| Dataset | Oceniane / wszystkie | MiniLM — trafność (poprawne) | BGE — trafność (poprawne) | Różnica |
|---|---:|---:|---:|---:|
| real | 21/21 | 81,0% (17) | 85,7% (18) | +4,8 pp |
| real-derived | 120/120 | 80,8% (97) | 82,5% (99) | +1,7 pp |
| hard | 171/180 | 76,0% (130) | 84,8% (145) | +8,8 pp |
| combined | 312/321 | 78,2% (244) | 84,0% (262) | +5,8 pp |

Średnia trafności po trzech zbiorach (każdy z wagą 1/3): **MiniLM 79,3% · BGE 84,3%**.

`real`: rzeczywiste zakładki. `real-derived` i `hard`: dane syntetyczne. `combined`: suma tych trzech zbiorów, zdominowana liczebnie przez dane syntetyczne. Dziewięć przypadków bez folderu wykluczono z trafności, zachowano w pomiarach czasu. Trafność combined jest sumowana z trzech zbiorów; pomiary czasu i RAM, jeśli dostępne, pochodzą z osobnych uruchomień combined.

## MiniLM + reranker — porównanie

**MiniLM-L12 + BGE-reranker-v2-m3 Q8**: MiniLM wybiera 3 foldery strategią z ręcznym opisem, reranker ocenia je ponownie. Limit embeddingu: 128 tokenów; rerankera: 512 tokenów na parę zapytanie–folder. Warianty bez rerankera korzystają ze strategii `manual-closest`.

| Dataset | MiniLM | BGE | MiniLM + reranker | Zmiana vs MiniLM | Poprawione / pogorszone |
|---|---:|---:|---:|---:|---:|
| real | 81,0% (17/21) | 85,7% (18/21) | 71,4% (15/21) | -9,5 pp | 1 / 3 |
| real-derived | 80,8% (97/120) | 82,5% (99/120) | 85,0% (102/120) | 4,2 pp | 15 / 10 |
| hard | 76,0% (130/171) | 84,8% (145/171) | 87,1% (149/171) | 11,1 pp | 28 / 9 |
| combined | 78,2% (244/312) | 84,0% (262/312) | 85,3% (266/312) | 7,1 pp | 44 / 22 |

### Czas zapytania z rerankerem

| Dataset | MiniLM | BGE | MiniLM + reranker |
|---|---:|---:|---:|
| real | 6,34 ms | 33,59 ms | 213,95 ms |
| real-derived | 2,76 ms | 14,82 ms | 135,73 ms |
| hard | 3,05 ms | 15,80 ms | 140,37 ms |
| combined | 3,65 ms | 19,91 ms | 144,43 ms |

### RAM z rerankerem

| Dataset | MiniLM | BGE | MiniLM + reranker | Dodatkowy RAM vs MiniLM |
|---|---:|---:|---:|---:|
| real | 645 MiB | 1753 MiB | 1811 MiB | 1165 MiB |
| real-derived | 662 MiB | 1778 MiB | 1866 MiB | 1204 MiB |
| hard | 674 MiB | 1756 MiB | 1866 MiB | 1192 MiB |
| combined | 697 MiB | 1559 MiB | 1625 MiB | 929 MiB |

RAM to mediana szczytów całych osobnych procesów, z oboma modelami załadowanymi jednocześnie w wariancie z rerankerem. Różnica RAM jest różnicą pomiarów całych procesów. Czas obejmuje embedding, retrieval i reranking po rozgrzewce; nie obejmuje ładowania ani indeksowania. Każdy dataset, również combined, był mierzony osobno.

Liczba powtórzeń nowych pomiarów: real/minilm-reranker-128: 3; real-derived/minilm-reranker-128: 3; hard/minilm-reranker-128: 3; combined/minilm-128: 3; combined/bge-128: 3; combined/minilm-reranker-128: 3. Bazowe pomiary real, real-derived i hard: 3 powtórzenia z pierwotnego porównania. Ścieżki nowych uruchomień są w reranker-runs.json.

## Porównanie wszystkich strategii

Każdy wiersz to jedna strategia, obie kolumny modeli dotyczą tych samych przypadków. Pogrubienie oznacza najlepszą trafność w kolumnie (także remisy). Różnica = BGE minus MiniLM. Kolejność strategii jest stała we wszystkich zbiorach.

Czas to mediana średnich czasów zapytania, obejmująca embedding i scoring. Embedding jest współdzielony między strategiami; małe różnice czasu nie stanowią wiarygodnego rankingu szybkości strategii. RAM był mierzony dla całego procesu ze wszystkimi strategiami.

### real — Prawdziwe zakładki

21 ocenianych / 21 wszystkich przypadków.

| Strategia | MiniLM — trafność | BGE — trafność | Różnica | MiniLM — czas | BGE — czas |
|---|---:|---:|---:|---:|---:|
| Najbliższa zakładka | 76,2% (16/21) | 81,0% (17/21) | +4,8 pp | 6,33 ms | 33,56 ms |
| Nazwa folderu + zakładka | 76,2% (16/21) | 66,7% (14/21) | -9,5 pp | 6,34 ms | 33,59 ms |
| Ręczny opis + zakładka | 81,0% (17/21) | 85,7% (18/21) | +4,8 pp | 6,34 ms | 33,59 ms |
| Opis AI + zakładka | 76,2% (16/21) | 85,7% (18/21) | +9,5 pp | 6,33 ms | 33,58 ms |
| Średnia 3 zakładek | **85,7% (18/21)** | 71,4% (15/21) | -14,3 pp | 6,32 ms | 33,54 ms |
| Centroid folderu | **85,7% (18/21)** | 85,7% (18/21) | 0,0 pp | 6,33 ms | 33,59 ms |
| Opis z kontekstem domen + zakładka | 76,2% (16/21) | 85,7% (18/21) | +9,5 pp | 6,33 ms | 33,59 ms |
| Słowa kluczowe + embedding | 81,0% (17/21) | **90,5% (19/21)** | +9,5 pp | 6,46 ms | 33,71 ms |

Najwyższa trafność: **MiniLM — Średnia 3 zakładek / Centroid folderu (85,7%); BGE — Słowa kluczowe + embedding (90,5%).**

### real-derived — Rozszerzenie folderów — dane syntetyczne

120 ocenianych / 120 wszystkich przypadków.

| Strategia | MiniLM — trafność | BGE — trafność | Różnica | MiniLM — czas | BGE — czas |
|---|---:|---:|---:|---:|---:|
| Najbliższa zakładka | 73,3% (88/120) | 60,8% (73/120) | -12,5 pp | 2,76 ms | 14,79 ms |
| Nazwa folderu + zakładka | 78,3% (94/120) | 70,8% (85/120) | -7,5 pp | 2,76 ms | 14,82 ms |
| Ręczny opis + zakładka | **80,8% (97/120)** | **82,5% (99/120)** | +1,7 pp | 2,76 ms | 14,82 ms |
| Opis AI + zakładka | 77,5% (93/120) | 75,8% (91/120) | -1,7 pp | 2,76 ms | 14,83 ms |
| Średnia 3 zakładek | 75,0% (90/120) | 65,8% (79/120) | -9,2 pp | 2,75 ms | 14,78 ms |
| Centroid folderu | 76,7% (92/120) | 57,5% (69/120) | -19,2 pp | 2,76 ms | 14,81 ms |
| Opis z kontekstem domen + zakładka | 76,7% (92/120) | 72,5% (87/120) | -4,2 pp | 2,76 ms | 14,81 ms |
| Słowa kluczowe + embedding | 72,5% (87/120) | 63,3% (76/120) | -9,2 pp | 2,80 ms | 14,84 ms |

Najwyższa trafność: **MiniLM — Ręczny opis + zakładka (80,8%); BGE — Ręczny opis + zakładka (82,5%).**

### hard — Trudny zbiór — dane syntetyczne

171 ocenianych / 180 wszystkich przypadków.

| Strategia | MiniLM — trafność | BGE — trafność | Różnica | MiniLM — czas | BGE — czas |
|---|---:|---:|---:|---:|---:|
| Najbliższa zakładka | 68,4% (117/171) | 77,8% (133/171) | +9,4 pp | 3,04 ms | 15,78 ms |
| Nazwa folderu + zakładka | 69,6% (119/171) | 79,5% (136/171) | +9,9 pp | 3,05 ms | 15,80 ms |
| Ręczny opis + zakładka | 76,0% (130/171) | **84,8% (145/171)** | +8,8 pp | 3,05 ms | 15,80 ms |
| Średnia 3 zakładek | **77,8% (133/171)** | 84,2% (144/171) | +6,4 pp | 3,02 ms | 15,73 ms |
| Centroid folderu | 76,0% (130/171) | 79,5% (136/171) | +3,5 pp | 3,04 ms | 15,80 ms |
| Słowa kluczowe + embedding | 69,6% (119/171) | 80,1% (137/171) | +10,5 pp | 3,08 ms | 15,81 ms |

Najwyższa trafność: **MiniLM — Średnia 3 zakładek (77,8%); BGE — Ręczny opis + zakładka (84,8%).**

Opisy AI i kontekst domen: brak wyników, ponieważ nie przygotowano tych opisów dla hard.

### combined — Wszystkie trzy zbiory

312 ocenianych / 321 wszystkich przypadków.

| Strategia | MiniLM — trafność | BGE — trafność | Różnica | MiniLM — czas | BGE — czas |
|---|---:|---:|---:|---:|---:|
| Najbliższa zakładka | 70,8% (221/312) | 71,5% (223/312) | +0,6 pp | 3,63 ms | 19,88 ms |
| Nazwa folderu + zakładka | 73,4% (229/312) | 75,3% (235/312) | +1,9 pp | 3,67 ms | 19,91 ms |
| Ręczny opis + zakładka | **78,2% (244/312)** | **84,0% (262/312)** | +5,8 pp | 3,65 ms | 19,91 ms |
| Średnia 3 zakładek | 77,2% (241/312) | 76,3% (238/312) | -1,0 pp | 3,63 ms | 19,83 ms |
| Centroid folderu | 76,9% (240/312) | 71,5% (223/312) | -5,4 pp | 3,66 ms | 19,91 ms |
| Słowa kluczowe + embedding | 71,5% (223/312) | 74,4% (232/312) | +2,9 pp | 3,69 ms | 19,92 ms |

Najwyższa trafność: **MiniLM — Ręczny opis + zakładka (78,2%); BGE — Ręczny opis + zakładka (84,0%).**

Średnia po zbiorach — każdy z wagą 1/3:

| Strategia | MiniLM | BGE |
|---|---:|---:|
| Najbliższa zakładka | 72,6% | 73,2% |
| Nazwa folderu + zakładka | 74,7% | 72,3% |
| Ręczny opis + zakładka | 79,3% | 84,3% |
| Średnia 3 zakładek | 79,5% | 73,8% |
| Centroid folderu | 79,5% | 74,2% |
| Słowa kluczowe + embedding | 74,3% | 78,0% |

Opisy AI i kontekst domen: brak wyników, ponieważ nie przygotowano tych opisów dla hard.

## Czas i pamięć w każdym zbiorze

Ta sama strategia `manual-closest`. Czas obejmuje embedding zapytania i wybór folderu.

| Dataset | MiniLM — średni czas | BGE — średni czas | BGE / MiniLM | MiniLM — RAM | BGE — RAM |
|---|---:|---:|---:|---:|---:|
| real | 6,34 ms | 33,59 ms | 5,3× | 645 MiB | 1753 MiB |
| real-derived | 2,76 ms | 14,82 ms | 5,4× | 662 MiB | 1778 MiB |
| hard | 3,05 ms | 15,80 ms | 5,2× | 674 MiB | 1756 MiB |
| combined | 3,65 ms | 19,91 ms | 5,4× | 697 MiB | 1559 MiB |

Czas: mediana średnich czasów zapytania z 3 uruchomień po rozgrzewce. RAM: mediana szczytowego zużycia całego procesu (Node, model, indeks i wyniki). Ładowanie i indeksowanie są poza czasem zapytania.

## Rozmiar modeli

| Zasób | MiniLM-L12 | BGE-M3 |
|---|---:|---:|
| Wagi ONNX Q8 | 118,3 MB | 569,7 MB |

[Wszystkie strategie](comparison.md#porównanie-wszystkich-strategii) · [Pomiary techniczne, p95 i BGE-8192](metrics.md) · [Problematyczne zakładki](problematic-cases.md)
