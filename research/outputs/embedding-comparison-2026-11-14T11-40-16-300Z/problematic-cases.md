# Problematyczne zakładki — wszystkie strategie

Każda zakładka występuje raz, niezależnie od trzech powtórzeń czasowych. Porównanie: MiniLM-L12 Q8 i BGE-M3 Q8, limit 128 tokenów, bez rerankera. **BŁĄD** oznacza folder różny od głównej etykiety; ✓ oznacza trafienie.

[Wróć do podsumowania strategii](comparison.md)

## Prawdziwe zakładki — 10 problematycznych zakładek

Kolejność: od największej liczby błędnych decyzji wśród strategii obu modeli.

<a id="case-15"></a>

### GitHub - solidusio/solidus: 🛒 Solidus, the open-source eCommerce framework for industry trailblazers. · GitHub

Przypadek: real-user / solidusio-solidus-solidus-the-open-source-ecommerce-framework-for-035c1558. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **14/16**.

Opis strony: 🛒 Solidus, the open-source eCommerce framework for industry trailblazers. - solidusio/solidus

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: learn** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | learn &gt; rb ✓ | **BŁĄD: learn** |
| Centroid folderu | learn &gt; rb ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-5"></a>

### The Passionate Programmer: Creating a Remarkable Career in Software Development (Pragmatic Life): Fowler, Chad: 9781934356340: Amazon.com: Books

Przypadek: real-user / the-passionate-programmer-creating-a-remarkable-career-in-softwar-9dbe4401. **Oczekiwany folder: ksiazki.** Błędne decyzje: **12/16**.

Opis strony: The Passionate Programmer: Creating a Remarkable Career in Software Development (Pragmatic Life) \[Fowler, Chad\] on Amazon.com. \*FREE\* shipping on qualifying offers. The Passionate Programmer: Creating a Remarkable Career in Software Development (Pragmatic Life)

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: jobs** |
| Centroid folderu | ksiazki ✓ | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-20"></a>

### Agentic AI - DeepLearning.AI

Przypadek: real-user / agentic-ai-deeplearning-ai-541089ed. **Oczekiwany folder: learn.** Błędne decyzje: **8/16**.

Opis strony: In this course taught by Andrew Ng, you'll build agentic AI systems that take action through iterative, multi-step workflows.

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | learn ✓ |
| Centroid folderu | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | learn ✓ |

<a id="case-19"></a>

### File Upload - OWASP Cheat Sheet Series

Przypadek: real-user / file-upload-owasp-cheat-sheet-series-070ae905. **Oczekiwany folder: learn.** Błędne decyzje: **8/16**.

Opis strony: Website with the collection of all the cheat sheets of the project.

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | learn ✓ |
| Ręczny opis + zakładka | **BŁĄD: jobs** | learn ✓ |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | learn ✓ |
| Centroid folderu | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | learn ✓ |

<a id="case-13"></a>

### PostgreSQL exercises

Przypadek: real-user / postgresql-exercises-3b21ea72. **Oczekiwany folder: learn.** Błędne decyzje: **8/16**.

Opis strony: (brak opisu)

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | learn ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | learn ✓ | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | learn ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-18"></a>

### OWASP WebGoat &#124; OWASP Foundation

Przypadek: real-user / owasp-security-owasp-foundation-4475299b. **Oczekiwany folder: learn.** Błędne decyzje: **7/16**.

Opis strony: Web application security is difficult to learn and practice. Not many people have full blown web applications like online book stores or online banks that can be used to scan for vulnerabilities. In…

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | learn ✓ |
| Ręczny opis + zakładka | learn ✓ | learn ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | learn ✓ |
| Średnia 3 zakładek | **BŁĄD: jobs** | learn ✓ |
| Centroid folderu | **BŁĄD: jobs** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | learn ✓ |

<a id="case-11"></a>

### Krótka historia prawie wszystkiego - Bryson Bill &#124; Książka w Empik

Przypadek: real-user / krotka-historia-prawie-wszystkiego-bryson-bill-ksiazka-w-empik-952a4d8d. **Oczekiwany folder: ksiazki.** Błędne decyzje: **3/16**.

Opis strony: Książka Krótka historia prawie wszystkiego autorstwa Bryson Bill, dostępna w sklepie empik.com. Przeczytaj recenzję Krótka historia prawie wszystkiego. Zamów dostawę do dowolnego salonu i zapłać przy odbiorze!

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-3"></a>

### 9 books on the reading lists of highly successful people &#124; LibbyLife.com

Przypadek: real-user / 9-books-on-the-reading-lists-of-highly-successful-people-ae755f40. **Oczekiwany folder: ksiazki.** Błędne decyzje: **2/16**.

Opis strony: If you’ve ever wanted to know what’s on the reading lists of Barack Obama, Bill Gates, Warren Buffett, or other highly successful people, look no further than these books on the Libby app.

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-6"></a>

### Do roboty! - Radziwiłł Katarzyna &#124; Książka w Empik

Przypadek: real-user / do-roboty-radziwi-katarzyna-ksiazka-w-empik-8d6d55aa. **Oczekiwany folder: ksiazki.** Błędne decyzje: **2/16**.

Opis strony: Książka Do roboty! autorstwa Radziwiłł Katarzyna, dostępna w sklepie empik.com. Przeczytaj recenzję Do roboty!. Zamów dostawę do dowolnego salonu i zapłać przy odbiorze!

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: jobs** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-2"></a>

### Religia Słowian i jej upadek - Henryk Łowmiański &#124; Książka w Lubimyczytac.pl - Opinie, oceny, ceny

Przypadek: real-user / religia-sowian-i-jej-upadek-henryk-owmianski-ksiazka-w-lubimyczyt-0a2da766. **Oczekiwany folder: ksiazki.** Błędne decyzje: **1/16**.

Opis strony: Wyczerpujące, naukowe opracowanie wierzeń dawnych Słowian i ich relacji z nadchodzącym chrześcijaństwem.

Oznaczenia danych: original-real.

Uzasadnienie etykiety zapisane w zbiorze: Original expected folder retained from prototype; no new human adjudication.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | ksiazki ✓ |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

## Rozszerzenie folderów — dane syntetyczne — 75 problematycznych zakładek

Kolejność: od największej liczby błędnych decyzji wśród strategii obu modeli.

<a id="case-30"></a>

### Ruby od środka — wydanie drugie

Przypadek: real-user / real-derived-1-09. **Oczekiwany folder: ksiazki.** Błędne decyzje: **16/16**.

Opis strony: Oferta książki technicznej o języku Ruby; format, ISBN i dostawa.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn &gt; rb. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |

<a id="case-31"></a>

### SQL at Work — paperback, 320 pages

Przypadek: real-user / real-derived-1-10. **Oczekiwany folder: ksiazki.** Błędne decyzje: **16/16**.

Opis strony: A printed database book to purchase, with a contents preview.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Ręczny opis + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Opis AI + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Średnia 3 zakładek | **BŁĄD: learn** | **BŁĄD: learn** |
| Centroid folderu | **BŁĄD: learn** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Słowa kluczowe + embedding | **BŁĄD: learn** | **BŁĄD: learn** |

<a id="case-44"></a>

### JavaScript closures: guided exercises

Przypadek: real-user / real-derived-2-03. **Oczekiwany folder: learn.** Błędne decyzje: **16/16**.

Opis strony: A lesson followed by small coding challenges and automatic feedback.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Centroid folderu | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-58"></a>

### Build a tiny recommendation engine

Przypadek: real-user / real-derived-2-17. **Oczekiwany folder: learn.** Błędne decyzje: **16/16**.

Opis strony: A guided coding lab on embeddings and nearest-neighbour search.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: learn &gt; rb** |

<a id="case-98"></a>

### Ruby Lights — official audio

Przypadek: real-user / real-derived-4-17. **Oczekiwany folder: music.** Błędne decyzje: **16/16**.

Opis strony: An electronic duo named Ruby Lights releases a new song.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn &gt; rb. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |

<a id="case-116"></a>

### Bluza basic — darmowa dostawa

Przypadek: real-user / real-derived-5-15. **Oczekiwany folder: ubrania.** Błędne decyzje: **16/16**.

Opis strony: Opis kroju i rozmiary. Akceptuj cookies, oferta dnia i newsletter.

Oznaczenia danych: synthetic-real-derived, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Średnia 3 zakładek | **BŁĄD: jobs** | **BŁĄD: learn** |
| Centroid folderu | **BŁĄD: jobs** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: learn** |

<a id="case-118"></a>

### Ruby red knitted cardigan

Przypadek: real-user / real-derived-5-17. **Oczekiwany folder: ubrania.** Błędne decyzje: **16/16**.

Opis strony: A red cardigan named Ruby, sold in an online clothing store.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn &gt; rb. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |

<a id="case-130"></a>

### Backend Developer — Ruby on Rails

Przypadek: real-user / real-derived-6-09. **Oczekiwany folder: jobs.** Błędne decyzje: **16/16**.

Opis strony: An employment listing for a Rails role, salary and application deadline.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn &gt; rb. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: An actual vacancy or job-search listing belongs in jobs, even when it mentions a course, bookshop or technology.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |

<a id="case-48"></a>

### Od podstaw do pierwszego API

Przypadek: real-user / real-derived-2-07. **Oczekiwany folder: learn.** Błędne decyzje: **15/16**.

Opis strony: Kurs tworzenia serwera JavaScript, podzielony na moduły z zadaniami.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | learn ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Centroid folderu | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-51"></a>

### Git branches without fear

Przypadek: real-user / real-derived-2-10. **Oczekiwany folder: learn.** Błędne decyzje: **15/16**.

Opis strony: An interactive branching tutorial with a sandbox repository.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: jobs** |

<a id="case-78"></a>

### SQL queries from a Rails model

Przypadek: real-user / real-derived-3-17. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **15/16**.

Opis strony: Examples of database querying through Active Record scopes.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Ręczny opis + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Opis AI + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Średnia 3 zakładek | **BŁĄD: learn** | learn &gt; rb ✓ |
| Centroid folderu | **BŁĄD: learn** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn** | **BŁĄD: learn** |
| Słowa kluczowe + embedding | **BŁĄD: learn** | **BŁĄD: learn** |

<a id="case-100"></a>

### Study playlist: warm electronic instrumentals

Przypadek: real-user / real-derived-4-19. **Oczekiwany folder: music.** Błędne decyzje: **14/16**.

Opis strony: Music to listen to while studying, with no course or exercises.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: learn** | music ✓ |
| Ręczny opis + zakładka | **BŁĄD: learn** | music ✓ |
| Opis AI + zakładka | **BŁĄD: learn** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: learn** | **BŁĄD: jobs** |

<a id="case-40"></a>

### Biblioteka programisty: co przeczytać zimą

Przypadek: real-user / real-derived-1-19. **Oczekiwany folder: ksiazki.** Błędne decyzje: **13/16**.

Opis strony: Zestawienie książek do przeczytania o projektowaniu oprogramowania.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |

<a id="case-57"></a>

### TypeScript: exercises on narrowing

Przypadek: real-user / real-derived-2-16. **Oczekiwany folder: learn.** Błędne decyzje: **13/16**.

Opis strony: (brak opisu)

Oznaczenia danych: synthetic-real-derived, missing-metadata.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | learn ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-67"></a>

### Rails background jobs: retry safely

Przypadek: real-user / real-derived-3-06. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **13/16**.

Opis strony: A technical article about job retries and idempotency in Rails.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Centroid folderu | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-82"></a>

### Midnight Harbour — live electronic session

Przypadek: real-user / real-derived-4-01. **Oczekiwany folder: music.** Błędne decyzje: **12/16**.

Opis strony: A recorded electronic music performance to listen to, with a track list.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | music ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | music ✓ | **BŁĄD: learn** |
| Opis AI + zakładka | music ✓ | **BŁĄD: learn** |
| Średnia 3 zakładek | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | **BŁĄD: learn** |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: learn** |

<a id="case-26"></a>

### Programowanie bez pośpiechu

Przypadek: real-user / real-derived-1-05. **Oczekiwany folder: ksiazki.** Błędne decyzje: **11/16**.

Opis strony: Książka dla programistów: spis treści, fragment i cena wydania drukowanego.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: learn** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: learn** | **BŁĄD: jobs** |
| Opis AI + zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: jobs** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: learn** | **BŁĄD: jobs** |

<a id="case-75"></a>

### Rails performance digest &#124; Subscribe

Przypadek: real-user / real-derived-3-14. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **11/16**.

Opis strony: Article on caching rendered Rails partials. Newsletter, cookie banner and unrelated job advertisements.

Oznaczenia danych: synthetic-real-derived, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | learn &gt; rb ✓ | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Centroid folderu | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-90"></a>

### Soft Signal — instrumental version

Przypadek: real-user / real-derived-4-09. **Oczekiwany folder: music.** Błędne decyzje: **10/16**.

Opis strony: The instrumental edition of a new electronic single.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | **BŁĄD: ubrania** | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: learn** |

<a id="case-119"></a>

### T-shirt with a JavaScript print

Przypadek: real-user / real-derived-5-18. **Oczekiwany folder: ubrania.** Błędne decyzje: **10/16**.

Opis strony: A shirt product listing with programmer-themed artwork and size selection.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Ręczny opis + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Opis AI + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: jobs** |
| Centroid folderu | ubrania ✓ | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | **BŁĄD: jobs** |

<a id="case-121"></a>

### Eleganckie spodnie do biura

Przypadek: real-user / real-derived-5-20. **Oczekiwany folder: ubrania.** Błędne decyzje: **10/16**.

Opis strony: Oferta spodni odzieżowych, zdjęcia, wymiary i cena.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: jobs. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Ręczny opis + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Opis AI + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: learn** |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: jobs** |

<a id="case-41"></a>

### A Guide to Changing Careers — ebook

Przypadek: real-user / real-derived-1-20. **Oczekiwany folder: ksiazki.** Błędne decyzje: **9/16**.

Opis strony: A career advice book listing, with an ebook sample and purchase price.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: jobs. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: jobs** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Średnia 3 zakładek | **BŁĄD: jobs** | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | ksiazki ✓ |

<a id="case-85"></a>

### Ambient textures for a quiet morning

Przypadek: real-user / real-derived-4-04. **Oczekiwany folder: music.** Błędne decyzje: **9/16**.

Opis strony: A playlist of ambient instrumental music for listening.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |

<a id="case-86"></a>

### Nowy singiel: Deszcz na peronie

Przypadek: real-user / real-derived-4-05. **Oczekiwany folder: music.** Błędne decyzje: **9/16**.

Opis strony: Oficjalny teledysk do elektronicznego utworu polskiego duetu.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ksiazki** | music ✓ |
| Nazwa folderu + zakładka | **BŁĄD: ksiazki** | music ✓ |
| Ręczny opis + zakładka | **BŁĄD: ksiazki** | music ✓ |
| Opis AI + zakładka | **BŁĄD: ksiazki** | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | **BŁĄD: ksiazki** | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ksiazki** | music ✓ |

<a id="case-92"></a>

### Posłuchaj

Przypadek: real-user / real-derived-4-11. **Oczekiwany folder: music.** Błędne decyzje: **9/16**.

Opis strony: Nagranie koncertu elektronicznego z festiwalowej sceny.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | music ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: jobs** |

<a id="case-97"></a>

### Night Drive — original club mix

Przypadek: real-user / real-derived-4-16. **Oczekiwany folder: music.** Błędne decyzje: **9/16**.

Opis strony: (brak opisu)

Oznaczenia danych: synthetic-real-derived, missing-metadata.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | music ✓ |
| Nazwa folderu + zakładka | **BŁĄD: ubrania** | music ✓ |
| Ręczny opis + zakładka | **BŁĄD: ubrania** | music ✓ |
| Opis AI + zakładka | **BŁĄD: ubrania** | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | **BŁĄD: ubrania** | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | music ✓ |

<a id="case-47"></a>

### React state workshop

Przypadek: real-user / real-derived-2-06. **Oczekiwany folder: learn.** Błędne decyzje: **8/16**.

Opis strony: Build a small interface through hands-on lessons and exercises.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Opis AI + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Średnia 3 zakładek | learn ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | learn ✓ | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | learn ✓ | **BŁĄD: learn &gt; rb** |
| Słowa kluczowe + embedding | learn ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-117"></a>

### Sukienka koszulowa — tabela rozmiarów

Przypadek: real-user / real-derived-5-16. **Oczekiwany folder: ubrania.** Błędne decyzje: **8/16**.

Opis strony: (brak opisu)

Oznaczenia danych: synthetic-real-derived, missing-metadata.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Opis AI + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: learn** |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: learn** |

<a id="case-131"></a>

### SQL developer wanted — apply today

Przypadek: real-user / real-derived-6-10. **Oczekiwany folder: jobs.** Błędne decyzje: **8/16**.

Opis strony: A paid database developer role, not a training course.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: An actual vacancy or job-search listing belongs in jobs, even when it mentions a course, bookshop or technology.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn** | jobs ✓ |
| Nazwa folderu + zakładka | **BŁĄD: learn** | jobs ✓ |
| Ręczny opis + zakładka | **BŁĄD: learn** | jobs ✓ |
| Opis AI + zakładka | **BŁĄD: learn** | jobs ✓ |
| Średnia 3 zakładek | **BŁĄD: learn** | jobs ✓ |
| Centroid folderu | **BŁĄD: learn** | jobs ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn** | jobs ✓ |
| Słowa kluczowe + embedding | **BŁĄD: learn** | jobs ✓ |

<a id="case-46"></a>

### Laboratorium bezpiecznych formularzy

Przypadek: real-user / real-derived-2-05. **Oczekiwany folder: learn.** Błędne decyzje: **7/16**.

Opis strony: Ćwiczenia z walidacji i ochrony formularzy przed typowymi atakami.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Ręczny opis + zakładka | learn ✓ | learn ✓ |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Średnia 3 zakładek | **BŁĄD: learn &gt; rb** | learn ✓ |
| Centroid folderu | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | learn ✓ |

<a id="case-54"></a>

### Przydatne

Przypadek: real-user / real-derived-2-13. **Oczekiwany folder: learn.** Błędne decyzje: **7/16**.

Opis strony: Zestaw ćwiczeń o nagłówkach HTTP i zabezpieczeniach przeglądarki.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | learn ✓ |
| Ręczny opis + zakładka | learn ✓ | learn ✓ |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Średnia 3 zakładek | **BŁĄD: jobs** | learn ✓ |
| Centroid folderu | **BŁĄD: jobs** | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | learn ✓ |

<a id="case-59"></a>

### Zadania z podstaw Pythona

Przypadek: real-user / real-derived-2-18. **Oczekiwany folder: learn.** Błędne decyzje: **7/16**.

Opis strony: Pętle, słowniki i funkcje w krótkich ćwiczeniach z testami.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Nazwa folderu + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Ręczny opis + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Opis AI + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Średnia 3 zakładek | learn ✓ | **BŁĄD: jobs** |
| Centroid folderu | learn ✓ | learn ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: learn &gt; rb** | learn ✓ |
| Słowa kluczowe + embedding | **BŁĄD: learn &gt; rb** | learn ✓ |

<a id="case-72"></a>

### Notatki do projektu

Przypadek: real-user / real-derived-3-11. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **7/16**.

Opis strony: Przykłady eager loading i rozwiązywania problemu N+1 w Active Record.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Nazwa folderu + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Ręczny opis + zakładka | **BŁĄD: learn** | learn &gt; rb ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Średnia 3 zakładek | **BŁĄD: learn** | learn &gt; rb ✓ |
| Centroid folderu | **BŁĄD: learn** | learn &gt; rb ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | learn &gt; rb ✓ |
| Słowa kluczowe + embedding | **BŁĄD: jobs** | learn &gt; rb ✓ |

<a id="case-87"></a>

### Rooftop rhythms: full DJ mix

Przypadek: real-user / real-derived-4-06. **Oczekiwany folder: music.** Błędne decyzje: **7/16**.

Opis strony: A ninety-minute house music set with chapter timestamps.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: learn** |

<a id="case-89"></a>

### Set na zakończenie lata

Przypadek: real-user / real-derived-4-08. **Oczekiwany folder: music.** Błędne decyzje: **7/16**.

Opis strony: Godzinny miks muzyki klubowej z listą wykonawców.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | **BŁĄD: learn &gt; rb** |

<a id="case-27"></a>

### Tomorrow's Machines: reading sample

Przypadek: real-user / real-derived-1-06. **Oczekiwany folder: ksiazki.** Błędne decyzje: **6/16**.

Opis strony: Sample chapter from a science book about automation, followed by an order form.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | **BŁĄD: learn** |
| Ręczny opis + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Opis AI + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-53"></a>

### Start here

Przypadek: real-user / real-derived-2-12. **Oczekiwany folder: learn.** Błędne decyzje: **6/16**.

Opis strony: A beginner web development course with videos, quizzes and coding assignments.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | learn ✓ | **BŁĄD: jobs** |
| Ręczny opis + zakładka | learn ✓ | learn ✓ |
| Opis AI + zakładka | learn ✓ | **BŁĄD: jobs** |
| Średnia 3 zakładek | learn ✓ | **BŁĄD: jobs** |
| Centroid folderu | learn ✓ | learn ✓ |
| Opis z kontekstem domen + zakładka | learn ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | learn ✓ | **BŁĄD: jobs** |

<a id="case-104"></a>

### Kurtka przejściowa z kapturem

Przypadek: real-user / real-derived-5-03. **Oczekiwany folder: ubrania.** Błędne decyzje: **6/16**.

Opis strony: Strona produktu odzieżowego z wymiarami i opcjami dostawy.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: learn** |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: jobs** |

<a id="case-120"></a>

### Concert hoodie — black, unisex

Przypadek: real-user / real-derived-5-19. **Oczekiwany folder: ubrania.** Błędne decyzje: **6/16**.

Opis strony: A wearable concert merchandise hoodie, with a size guide and order button.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: music. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | **BŁĄD: music** |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: learn** |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | **BŁĄD: music** |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: learn** |

<a id="case-24"></a>

### Atlas zapomnianych wierzeń &#124; Księgarnia

Przypadek: real-user / real-derived-1-03. **Oczekiwany folder: ksiazki.** Błędne decyzje: **5/16**.

Opis strony: Album o dawnych obrzędach Europy, dostępny w twardej oprawie.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | **BŁĄD: learn** |

<a id="case-33"></a>

### Product details

Przypadek: real-user / real-derived-1-12. **Oczekiwany folder: ksiazki.** Błędne decyzje: **5/16**.

Opis strony: Hardcover book on the history of computing. Author biography, dimensions and delivery options.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | **BŁĄD: learn** |

<a id="case-74"></a>

### Do sprawdzenia

Przypadek: real-user / real-derived-3-13. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **5/16**.

Opis strony: Konfiguracja połączenia Rails z PostgreSQL i ustawienia puli.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn &gt; rb ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | learn &gt; rb ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Opis AI + zakładka | learn &gt; rb ✓ | **BŁĄD: learn** |
| Średnia 3 zakładek | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Centroid folderu | learn &gt; rb ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | learn &gt; rb ✓ | **BŁĄD: learn** |
| Słowa kluczowe + embedding | learn &gt; rb ✓ | learn &gt; rb ✓ |

<a id="case-83"></a>

### Wieczorny set house z małego klubu

Przypadek: real-user / real-derived-4-02. **Oczekiwany folder: music.** Błędne decyzje: **5/16**.

Opis strony: Nagranie muzyczne z didżejskiego występu, bez materiałów szkoleniowych.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | music ✓ |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | music ✓ |

<a id="case-84"></a>

### Glass Streets — extended dance remix

Przypadek: real-user / real-derived-4-03. **Oczekiwany folder: music.** Błędne decyzje: **5/16**.

Opis strony: An audio upload of an electronic track with an extended instrumental intro.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | **BŁĄD: jobs** |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: jobs** |

<a id="case-94"></a>

### Na weekend

Przypadek: real-user / real-derived-4-13. **Oczekiwany folder: music.** Błędne decyzje: **5/16**.

Opis strony: Playlista utworów deep house z płynnymi przejściami między nagraniami.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: ubrania** | music ✓ |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | **BŁĄD: ubrania** | music ✓ |
| Centroid folderu | **BŁĄD: ubrania** | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | **BŁĄD: ubrania** | music ✓ |

<a id="case-95"></a>

### Now playing &#124; Sign in to continue

Przypadek: real-user / real-derived-4-14. **Oczekiwany folder: music.** Błędne decyzje: **5/16**.

Opis strony: Full electronic music video. Subscribe, related videos, premium trial and comments.

Oznaczenia danych: synthetic-real-derived, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | **BŁĄD: jobs** |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: jobs** |

<a id="case-96"></a>

### Koncert na żywo — odtwórz

Przypadek: real-user / real-derived-4-15. **Oczekiwany folder: music.** Błędne decyzje: **5/16**.

Opis strony: Nagranie występu muzycznego. Reklamy przed filmem i propozycje kanałów.

Oznaczenia danych: synthetic-real-derived, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | **BŁĄD: jobs** |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: jobs** |

<a id="case-105"></a>

### Cotton crew-neck sweatshirt in sage

Przypadek: real-user / real-derived-5-04. **Oczekiwany folder: ubrania.** Błędne decyzje: **5/16**.

Opis strony: A sweatshirt listing with fit photos and selectable sizes.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | **BŁĄD: learn** |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: learn** |

<a id="case-37"></a>

### Historia liczb — książka, oprawa miękka

Przypadek: real-user / real-derived-1-16. **Oczekiwany folder: ksiazki.** Błędne decyzje: **4/16**.

Opis strony: (brak opisu)

Oznaczenia danych: synthetic-real-derived, missing-metadata.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-88"></a>

### Piano loops and broken beats — live

Przypadek: real-user / real-derived-4-07. **Oczekiwany folder: music.** Błędne decyzje: **4/16**.

Opis strony: A live recording combining piano samples and electronic percussion.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | **BŁĄD: learn** |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-108"></a>

### Wełniany sweter w paski

Przypadek: real-user / real-derived-5-07. **Oczekiwany folder: ubrania.** Błędne decyzje: **4/16**.

Opis strony: Skład tkaniny, zalecenia prania i możliwość zakupu swetra.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: learn** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | **BŁĄD: learn** |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: learn** |

<a id="case-23"></a>

### The Patient Engineer — paperback edition

Przypadek: real-user / real-derived-1-02. **Oczekiwany folder: ksiazki.** Błędne decyzje: **3/16**.

Opis strony: A book about building a sustainable career in software. Publisher description and purchase options.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Ręczny opis + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | ksiazki ✓ |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | **BŁĄD: jobs** | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-29"></a>

### A Small History of Oceans &#124; Books

Przypadek: real-user / real-derived-1-08. **Oczekiwany folder: ksiazki.** Błędne decyzje: **3/16**.

Opis strony: An illustrated science book about marine discoveries, available in hardcover.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-35"></a>

### Książka o nawykach &#124; Darmowa dostawa

Przypadek: real-user / real-derived-1-14. **Oczekiwany folder: ksiazki.** Błędne decyzje: **3/16**.

Opis strony: Opis wydania, opinie czytelników. Akceptuj cookies, newsletter, produkty sponsorowane.

Oznaczenia danych: synthetic-real-derived, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: jobs** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-91"></a>

### Afterhours radio episode 12

Przypadek: real-user / real-derived-4-10. **Oczekiwany folder: music.** Błędne decyzje: **3/16**.

Opis strony: A radio mix featuring house, garage and electronic remixes.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | music ✓ |
| Centroid folderu | music ✓ | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-93"></a>

### Track 04

Przypadek: real-user / real-derived-4-12. **Oczekiwany folder: music.** Błędne decyzje: **3/16**.

Opis strony: A complete dance track from an EP, uploaded for listening.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: learn &gt; rb** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | music ✓ |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: learn &gt; rb** |

<a id="case-101"></a>

### Nowa płyta w odsłuchu: Miejskie echa

Przypadek: real-user / real-derived-4-20. **Oczekiwany folder: music.** Błędne decyzje: **3/16**.

Opis strony: Pełny odsłuch albumu elektronicznego, z opisem utworów i czasem nagrań.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | music ✓ |
| Centroid folderu | music ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | music ✓ | **BŁĄD: jobs** |

<a id="case-109"></a>

### Oversized T-shirt, heavyweight cotton

Przypadek: real-user / real-derived-5-08. **Oczekiwany folder: ubrania.** Błędne decyzje: **3/16**.

Opis strony: A product page for a cotton T-shirt with size options.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: ksiazki** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: ksiazki** |

<a id="case-112"></a>

### Może ten

Przypadek: real-user / real-derived-5-11. **Oczekiwany folder: ubrania.** Błędne decyzje: **3/16**.

Opis strony: Oferta sklepu: luźny kardigan z bawełny, dostępny w trzech rozmiarach.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | **BŁĄD: ksiazki** |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn &gt; rb** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | **BŁĄD: ksiazki** |

<a id="case-25"></a>

### Decisions Under Uncertainty — book review

Przypadek: real-user / real-derived-1-04. **Oczekiwany folder: ksiazki.** Błędne decyzje: **2/16**.

Opis strony: A reader reviews a nonfiction book on practical reasoning and links to the paperback.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-34"></a>

### Zapisane

Przypadek: real-user / real-derived-1-13. **Oczekiwany folder: ksiazki.** Błędne decyzje: **2/16**.

Opis strony: Książka popularnonaukowa o genetyce, którą można zamówić w przedsprzedaży.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-39"></a>

### Muzyka od kuchni — książka

Przypadek: real-user / real-derived-1-18. **Oczekiwany folder: ksiazki.** Błędne decyzje: **2/16**.

Opis strony: Popularnonaukowa książka o tym, jak słyszymy rytm. Cena i dostępność w księgarni.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: music. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-45"></a>

### HTTP essentials — free learning path

Przypadek: real-user / real-derived-2-04. **Oczekiwany folder: learn.** Błędne decyzje: **2/16**.

Opis strony: A sequence of lessons on requests, status codes and browser caching.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A general programming course, exercise or technical learning reference belongs in learn; Ruby-specific material has its own subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn ✓ | **BŁĄD: jobs** |
| Nazwa folderu + zakładka | learn ✓ | learn ✓ |
| Ręczny opis + zakładka | learn ✓ | learn ✓ |
| Opis AI + zakładka | learn ✓ | learn ✓ |
| Średnia 3 zakładek | learn ✓ | learn ✓ |
| Centroid folderu | learn ✓ | learn ✓ |
| Opis z kontekstem domen + zakładka | learn ✓ | learn ✓ |
| Słowa kluczowe + embedding | learn ✓ | **BŁĄD: jobs** |

<a id="case-65"></a>

### Active Record transactions explained

Przypadek: real-user / real-derived-3-04. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **2/16**.

Opis strony: A practical reference for transactional updates in Rails.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Nazwa folderu + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Ręczny opis + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Opis AI + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Średnia 3 zakładek | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Centroid folderu | learn &gt; rb ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | learn &gt; rb ✓ | **BŁĄD: jobs** |
| Słowa kluczowe + embedding | learn &gt; rb ✓ | learn &gt; rb ✓ |

<a id="case-79"></a>

### Full-stack project using Rails and a little JavaScript

Przypadek: real-user / real-derived-3-18. **Oczekiwany folder: learn &gt; rb.** Błędne decyzje: **2/16**.

Opis strony: A Rails-focused tutorial building controllers, views and models.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Ruby or Rails technical learning material belongs in the existing Ruby subfolder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Nazwa folderu + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Ręczny opis + zakładka | learn &gt; rb ✓ | **BŁĄD: learn** |
| Opis AI + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Średnia 3 zakładek | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Centroid folderu | learn &gt; rb ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | learn &gt; rb ✓ | learn &gt; rb ✓ |
| Słowa kluczowe + embedding | learn &gt; rb ✓ | learn &gt; rb ✓ |

<a id="case-22"></a>

### Gdy mózg odpoczywa — książka popularnonaukowa

Przypadek: real-user / real-derived-1-01. **Oczekiwany folder: ksiazki.** Błędne decyzje: **1/16**.

Opis strony: Opis papierowej książki o śnie i pamięci. Porównaj wydania i dodaj do listy zakupów.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | ksiazki ✓ |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-32"></a>

### Coś na później

Przypadek: real-user / real-derived-1-11. **Oczekiwany folder: ksiazki.** Błędne decyzje: **1/16**.

Opis strony: Recenzja książki o podejmowaniu decyzji, z odnośnikiem do księgarni.

Oznaczenia danych: synthetic-real-derived, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | ksiazki ✓ |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-38"></a>

### Short books for a long train journey

Przypadek: real-user / real-derived-1-17. **Oczekiwany folder: ksiazki.** Błędne decyzje: **1/16**.

Opis strony: A reading list of nonfiction books, with descriptions and links to editions.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: A book listing, review or reading list belongs with saved books, even when its topic is programming or careers.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ksiazki ✓ | ksiazki ✓ |
| Nazwa folderu + zakładka | ksiazki ✓ | ksiazki ✓ |
| Ręczny opis + zakładka | ksiazki ✓ | ksiazki ✓ |
| Opis AI + zakładka | ksiazki ✓ | ksiazki ✓ |
| Średnia 3 zakładek | ksiazki ✓ | **BŁĄD: learn &gt; rb** |
| Centroid folderu | ksiazki ✓ | ksiazki ✓ |
| Opis z kontekstem domen + zakładka | ksiazki ✓ | ksiazki ✓ |
| Słowa kluczowe + embedding | ksiazki ✓ | ksiazki ✓ |

<a id="case-99"></a>

### The Programmer — techno remix

Przypadek: real-user / real-derived-4-18. **Oczekiwany folder: music.** Błędne decyzje: **1/16**.

Opis strony: A track titled The Programmer; audio playback and artist credits.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: learn. Nadal oceniane względem głównego folderu.

Oznaczenia danych: synthetic-real-derived, overlap.

Uzasadnienie etykiety zapisane w zbiorze: The purpose is listening to a track, recording or playlist, matching the existing music example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | music ✓ | music ✓ |
| Nazwa folderu + zakładka | music ✓ | music ✓ |
| Ręczny opis + zakładka | music ✓ | music ✓ |
| Opis AI + zakładka | music ✓ | music ✓ |
| Średnia 3 zakładek | music ✓ | music ✓ |
| Centroid folderu | music ✓ | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | music ✓ | music ✓ |
| Słowa kluczowe + embedding | music ✓ | music ✓ |

<a id="case-102"></a>

### Spodnie z szeroką nogawką — granatowe

Przypadek: real-user / real-derived-5-01. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: Oferta sklepu odzieżowego: tabela rozmiarów, skład materiału i cena.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

<a id="case-103"></a>

### Relaxed linen shirt — product details

Przypadek: real-user / real-derived-5-02. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: A clothing product page with available sizes, fabric composition and checkout.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

<a id="case-106"></a>

### Spódnica midi z kieszeniami

Przypadek: real-user / real-derived-5-05. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: Opis fasonu, dostępne kolory i cena ubrania w sklepie internetowym.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

<a id="case-107"></a>

### Straight-leg jeans, washed black

Przypadek: real-user / real-derived-5-06. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: An online jeans listing with waist measurements and stock availability.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: jobs** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

<a id="case-110"></a>

### Płaszcz na jesień — beżowy

Przypadek: real-user / real-derived-5-09. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: Oferta zakupu płaszcza, zdjęcia sylwetki i tabela rozmiarów.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

<a id="case-111"></a>

### Cargo trousers with adjustable hem

Przypadek: real-user / real-derived-5-10. **Oczekiwany folder: ubrania.** Błędne decyzje: **1/16**.

Opis strony: A clothing store listing with fabric details, price and delivery.

Oznaczenia danych: synthetic-real-derived, ordinary.

Uzasadnienie etykiety zapisane w zbiorze: The page offers clothing to buy, matching the existing clothing-shopping example.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | ubrania ✓ | ubrania ✓ |
| Nazwa folderu + zakładka | ubrania ✓ | ubrania ✓ |
| Ręczny opis + zakładka | ubrania ✓ | ubrania ✓ |
| Opis AI + zakładka | ubrania ✓ | ubrania ✓ |
| Średnia 3 zakładek | ubrania ✓ | ubrania ✓ |
| Centroid folderu | ubrania ✓ | **BŁĄD: learn** |
| Opis z kontekstem domen + zakładka | ubrania ✓ | ubrania ✓ |
| Słowa kluczowe + embedding | ubrania ✓ | ubrania ✓ |

## Trudny zbiór — dane syntetyczne — 83 problematycznych zakładek

Kolejność: od największej liczby błędnych decyzji wśród strategii obu modeli.

<a id="case-290"></a>

### Contraste et daltonisme

Przypadek: designer / hard-designer-29. **Oczekiwany folder: Studio/Ref/UX.** Błędne decyzje: **12/12**.

Opis strony: Référence générale sur le contraste des contrôles et les indications qui ne reposent pas uniquement sur la couleur.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/UX: Reusable interaction design and accessibility research, independent of a client deliverable.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Nazwa folderu + zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Ręczny opis + zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Średnia 3 zakładek | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Centroid folderu | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Słowa kluczowe + embedding | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |

<a id="case-291"></a>

### Orbit case study: reusable menu patterns

Przypadek: designer / hard-designer-30. **Oczekiwany folder: Studio/Ref/UX.** Błędne decyzje: **12/12**.

Opis strony: A public article discussing general interaction patterns through an Orbit redesign example.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Orbit/Web. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/UX: Reusable interaction design and accessibility research, independent of a client deliverable.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Ręczny opis + zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Średnia 3 zakładek | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Centroid folderu | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |

<a id="case-296"></a>

### Orbit — termin płatności FV

Przypadek: designer / hard-designer-35. **Oczekiwany folder: Firma/Admin/PL.** Błędne decyzje: **12/12**.

Opis strony: Administracyjna korespondencja o polskiej fakturze za projekt, bez materiałów projektowych.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Orbit/Brand. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Firma/Admin/PL: Polish freelance invoices, contracts, taxes and administration, regardless of the language of the source.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Ręczny opis + zakładka | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |
| Średnia 3 zakładek | **BŁĄD: Clients/Orbit/Web** | **BŁĄD: Clients/Orbit/Web** |
| Centroid folderu | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Brand** |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Orbit/Brand** | **BŁĄD: Clients/Orbit/Web** |

<a id="case-306"></a>

### Lightweight tripod for city walks

Przypadek: designer / hard-designer-45. **Oczekiwany folder: Osobiste/Foto/Sprzęt.** Błędne decyzje: **12/12**.

Opis strony: A tripod product comparison with folded dimensions, load capacity and purchase links.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Osobiste/Foto/Plenery. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Osobiste/Foto/Sprzęt: Camera and lens purchases, compatibility and maintenance, rather than photo locations.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Clients/Maple/Web** |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Osobiste/Foto/Plenery** |
| Ręczny opis + zakładka | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Osobiste/Foto/Plenery** |
| Średnia 3 zakładek | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Osobiste/Foto/Plenery** |
| Centroid folderu | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Osobiste/Foto/Plenery** |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Maple/Web** | **BŁĄD: Clients/Maple/Web** |

<a id="case-166"></a>

### How Atlas fixed its tabs

Przypadek: engineer / hard-engineer-25. **Oczekiwany folder: Work/Ref/Web.** Błędne decyzje: **12/12**.

Opis strony: A public technical write-up with reusable keyboard-navigation examples extracted from the Atlas UI work.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Atlas/Web. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Ref/Web: Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Web** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Web** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Web** |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas** |
| Centroid folderu | **BŁĄD: Work/Atlas/Web** | **BŁĄD: Work/Atlas/Web** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Web** |

<a id="case-171"></a>

### Atlas search POC

Przypadek: engineer / hard-engineer-30. **Oczekiwany folder: Learn/ML/NLP.** Błędne decyzje: **12/12**.

Opis strony: Personal notebook exploring multilingual embeddings using the Atlas search idea as an exercise.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Atlas/API. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Learn/ML/NLP: Language models, text embeddings and retrieval experiments for personal learning, rather than Atlas production incidents.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas** |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas/Ops** |
| Centroid folderu | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas/Web** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas** | **BŁĄD: Work/Atlas** |

<a id="case-173"></a>

### 11s HG / 12s MS compatibility

Przypadek: engineer / hard-engineer-32. **Oczekiwany folder: Life/Bike/Gear.** Błędne decyzje: **12/12**.

Opis strony: Which bicycle freehub accepts this cassette? Compatibility table and installation dimensions.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Gear: Bicycle equipment purchases, fit and mechanical maintenance.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Nazwa folderu + zakładka | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Ręczny opis + zakładka | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Średnia 3 zakładek | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Centroid folderu | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Słowa kluczowe + embedding | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |

<a id="case-236"></a>

### Berlin czy Drezno na kolejny raz?

Przypadek: household / hard-household-35. **Oczekiwany folder: Wyjazdy/Pomysły.** Błędne decyzje: **12/12**.

Opis strony: Ogólne porównanie miast do przyszłych wyjazdów, oddzielne od planu aktualnej podróży.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Wyjazdy/2027/Berlin. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Wyjazdy/Pomysły: Inspiration for future trips without an active destination plan; material specifically for Berlin goes in its trip folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Nazwa folderu + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Średnia 3 zakładek | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Centroid folderu | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |

<a id="case-243"></a>

### Berlin mit Kindern — Reiseführer

Przypadek: household / hard-household-42. **Oczekiwany folder: Czytanie/Książki.** Błędne decyzje: **12/12**.

Opis strony: Buchvorstellung, gedruckte Ausgabe und Bestellmöglichkeit beim Verlag.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Wyjazdy/2027/Berlin. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Czytanie/Książki: Books and ebooks to read or buy, including travel, food and parenting books.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Nazwa folderu + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Średnia 3 zakładek | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Centroid folderu | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |

<a id="case-301"></a>

### Maple Rechnung — Zahlungsziel

Przypadek: designer / hard-designer-40. **Oczekiwany folder: Firma/Admin/DE.** Błędne decyzje: **11/12**.

Opis strony: Buchhaltungsnotiz zu einer Rechnung aus der deutschen Tätigkeit für den Kunden Maple.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Maple/Brand. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Firma/Admin/DE: German freelance invoicing, tax and business administration, regardless of the source language.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Clients/Maple/Brand** |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Clients/Maple/Brand** |
| Ręczny opis + zakładka | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Clients/Maple/Brand** |
| Średnia 3 zakładek | **BŁĄD: Clients/Maple/Brand** | Firma/Admin/DE ✓ |
| Centroid folderu | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Clients/Maple/Brand** |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Clients/Maple/Brand** |

<a id="case-146"></a>

### Atlas launch checklist &#124; Sign in

Przypadek: engineer / hard-engineer-05. **Oczekiwany folder: Work/Atlas.** Błędne decyzje: **11/12**.

Opis strony: Owner approvals, documentation readiness and rollout communications. Cookies. Log in to your workspace.

Oznaczenia danych: hard-synthetic, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas: General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Średnia 3 zakładek | Work/Atlas ✓ | **BŁĄD: Work/Atlas/Ops** |
| Centroid folderu | **BŁĄD: Work/Atlas/API** | **BŁĄD: Work/Atlas/Ops** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |

<a id="case-176"></a>

### USB lampka na zimę

Przypadek: engineer / hard-engineer-35. **Oczekiwany folder: Life/Bike/Gear.** Błędne decyzje: **11/12**.

Opis strony: Przednia lampka rowerowa z ładowaniem USB-C, uchwyt na kierownicę i test wiązki.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Life/Buy/Tech. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Gear: Bicycle equipment purchases, fit and mechanical maintenance.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Nazwa folderu + zakładka | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Ręczny opis + zakładka | Life/Bike/Gear ✓ | **BŁĄD: Life/Buy/Tech** |
| Średnia 3 zakładek | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Centroid folderu | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |
| Słowa kluczowe + embedding | **BŁĄD: Life/Buy/Tech** | **BŁĄD: Life/Buy/Tech** |

<a id="case-232"></a>

### city break bez auta / 2-3 dni

Przypadek: household / hard-household-31. **Oczekiwany folder: Wyjazdy/Pomysły.** Błędne decyzje: **11/12**.

Opis strony: Zestaw propozycji przyszłych weekendów w kilku miastach Europy.

Oznaczenia danych: hard-synthetic, shorthand, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Wyjazdy/Pomysły: Inspiration for future trips without an active destination plan; material specifically for Berlin goes in its trip folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Nazwa folderu + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Średnia 3 zakładek | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Centroid folderu | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |

<a id="case-297"></a>

### USt / Kleinunt. — Merkblatt

Przypadek: designer / hard-designer-36. **Oczekiwany folder: Firma/Admin/DE.** Błędne decyzje: **10/12**.

Opis strony: Hinweise zur Rechnungsstellung für eine in Deutschland angemeldete freiberufliche Tätigkeit.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Firma/Admin/DE: German freelance invoicing, tax and business administration, regardless of the source language.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Firma/Admin/PL** | **BŁĄD: Firma/Admin/PL** |
| Nazwa folderu + zakładka | **BŁĄD: Firma/Admin/PL** | **BŁĄD: Firma/Admin/PL** |
| Ręczny opis + zakładka | **BŁĄD: Firma/Admin/PL** | Firma/Admin/DE ✓ |
| Średnia 3 zakładek | **BŁĄD: Firma/Admin/PL** | Firma/Admin/DE ✓ |
| Centroid folderu | **BŁĄD: Firma/Admin/PL** | **BŁĄD: Firma/Admin/PL** |
| Słowa kluczowe + embedding | **BŁĄD: Firma/Admin/PL** | **BŁĄD: Firma/Admin/PL** |

<a id="case-145"></a>

### Do sprawdzenia

Przypadek: engineer / hard-engineer-04. **Oczekiwany folder: Work/Atlas.** Błędne decyzje: **10/12**.

Opis strony: Atlas: ustalenia dotyczące nowej roli administratora; zmiany obejmą aplikację i serwer.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Atlas/API. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, vague-title, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas: General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Średnia 3 zakładek | Work/Atlas ✓ | Work/Atlas ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/API** | **BŁĄD: Work/Atlas/API** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |

<a id="case-151"></a>

### SSO callback — spinner forever

Przypadek: engineer / hard-engineer-10. **Oczekiwany folder: Work/Atlas/Web.** Błędne decyzje: **10/12**.

Opis strony: Atlas browser callback screen stays loading after a successful response. Frontend reproduction attached.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Atlas/API. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Web: Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Centroid folderu | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |

<a id="case-186"></a>

### Practical NLP — chapters + code

Przypadek: engineer / hard-engineer-45. **Oczekiwany folder: Life/Buy/Books.** Błędne decyzje: **10/12**.

Opis strony: A publisher offers a technical book with downloadable exercises and a purchase link.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Learn/ML/NLP. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Books: Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Ref/Web** | **BŁĄD: Learn/ML/NLP** |
| Nazwa folderu + zakładka | **BŁĄD: Learn/ML/NLP** | **BŁĄD: Learn/ML/NLP** |
| Ręczny opis + zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Ref/Web** | **BŁĄD: Learn/ML/NLP** |
| Centroid folderu | **BŁĄD: Work/Ref/Web** | **BŁĄD: Learn/ML/NLP** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Ref/Web** | **BŁĄD: Learn/ML/NLP** |

<a id="case-241"></a>

### Buty na Berlin — przecena

Przypadek: household / hard-household-40. **Oczekiwany folder: Kupić/Ubrania.** Błędne decyzje: **9/12**.

Opis strony: Oferta obuwia do chodzenia po mieście; dostępność rozmiaru i zamówienie.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Wyjazdy/2027/Berlin. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Kupić/Ubrania: Clothes and shoes for the family, including school and travel clothing purchases.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Kupić/Ubrania ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Kupić/Ubrania ✓ |
| Średnia 3 zakładek | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Centroid folderu | **BŁĄD: Wyjazdy/2027/Berlin** | **BŁĄD: Wyjazdy/2027/Berlin** |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | Kupić/Ubrania ✓ |

<a id="case-280"></a>

### Do sprawdzenia

Przypadek: designer / hard-designer-19. **Oczekiwany folder: Clients/Maple/Web.** Błędne decyzje: **8/12**.

Opis strony: Maple checkout: przesunięcie pola kodu pocztowego i opis błędu płatności.

Oznaczenia danych: hard-synthetic, vague-title, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Web: Maple ecommerce site navigation, product pages, checkout and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Średnia 3 zakładek | **BŁĄD: Clients/Maple/Brand** | **BŁĄD: Firma/Admin/DE** |
| Centroid folderu | **BŁĄD: Studio/Ref/UX** | **BŁĄD: Studio/Ref/UX** |
| Słowa kluczowe + embedding | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |

<a id="case-311"></a>

### Street portraits: where to practise

Przypadek: designer / hard-designer-50. **Oczekiwany folder: Osobiste/Foto/Plenery.** Błędne decyzje: **8/12**.

Opis strony: A map of public places for a personal portrait photo walk, with access notes.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Osobiste/Foto/Sprzęt. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Osobiste/Foto/Plenery: Places and routes for personal photo walks, access notes and light conditions.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Nazwa folderu + zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | **BŁĄD: Osobiste/Foto/Sprzęt** |
| Ręczny opis + zakładka | **BŁĄD: Osobiste/Foto/Sprzęt** | Osobiste/Foto/Plenery ✓ |
| Średnia 3 zakładek | **BŁĄD: Osobiste/Foto/Sprzęt** | Osobiste/Foto/Plenery ✓ |
| Centroid folderu | **BŁĄD: Osobiste/Foto/Sprzęt** | Osobiste/Foto/Plenery ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Osobiste/Foto/Sprzęt** | Osobiste/Foto/Plenery ✓ |

<a id="case-152"></a>

### BE: 409 przy retry / idem key

Przypadek: engineer / hard-engineer-11. **Oczekiwany folder: Work/Atlas/API.** Błędne decyzje: **8/12**.

Opis strony: Atlas orders endpoint rejects repeated requests; proposal for server-side idempotency storage.

Oznaczenia danych: hard-synthetic, abbreviation, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/API: Atlas backend endpoints, authentication contracts and database changes; infrastructure operations go in Ops.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Work/Atlas/API ✓ | **BŁĄD: Work/Atlas/Ops** |
| Nazwa folderu + zakładka | Work/Atlas/API ✓ | **BŁĄD: Work/Atlas/Ops** |
| Ręczny opis + zakładka | Work/Atlas/API ✓ | **BŁĄD: Work/Atlas/Ops** |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Centroid folderu | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Słowa kluczowe + embedding | Work/Atlas/API ✓ | **BŁĄD: Work/Atlas/Ops** |

<a id="case-164"></a>

### CSS: overflow bei langen Wörtern

Przypadek: engineer / hard-engineer-23. **Oczekiwany folder: Work/Ref/Web.** Błędne decyzje: **8/12**.

Opis strony: Allgemeine Beispiele für Zeilenumbrüche und lange Wörter in schmalen Karten.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Ref/Web: Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Learn/ML/NLP** | Work/Ref/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Learn/ML/NLP** | Work/Ref/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Learn/ML/NLP** | **BŁĄD: Learn/ML/NLP** |
| Średnia 3 zakładek | **BŁĄD: Learn/ML/NLP** | **BŁĄD: Learn/ML/NLP** |
| Centroid folderu | **BŁĄD: Learn/ML/NLP** | Work/Ref/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Learn/ML/NLP** | Work/Ref/Web ✓ |

<a id="case-206"></a>

### Zlew z wyciąganą słuchawką

Przypadek: household / hard-household-05. **Oczekiwany folder: Dom/Remont/Kuchnia.** Błędne decyzje: **8/12**.

Opis strony: Oferta armatury z dokumentacją montażową; nagłówek kategorii zawiera też wyposażenie łazienek.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Dom/Remont/Łazienka. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, noisy-metadata.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Kuchnia: Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | Dom/Remont/Kuchnia ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Kupić/Ubrania** | **BŁĄD: Dom/Remont/Łazienka** |
| Ręczny opis + zakładka | **BŁĄD: Dom/Remont/Łazienka** | Dom/Remont/Kuchnia ✓ |
| Średnia 3 zakładek | **BŁĄD: Rodzina/Zdrowie** | **BŁĄD: Dom/Remont/Łazienka** |
| Centroid folderu | **BŁĄD: Rodzina/Zdrowie** | Dom/Remont/Kuchnia ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | Dom/Remont/Kuchnia ✓ |

<a id="case-246"></a>

### Szkoła bez stresu — ebook

Przypadek: household / hard-household-45. **Oczekiwany folder: Czytanie/Książki.** Błędne decyzje: **8/12**.

Opis strony: Strona sprzedaży książki dla rodziców z fragmentem do pobrania.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Rodzina/Szkoła. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Czytanie/Książki: Books and ebooks to read or buy, including travel, food and parenting books.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Nazwa folderu + zakładka | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Ręczny opis + zakładka | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Średnia 3 zakładek | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Centroid folderu | **BŁĄD: Rodzina/Szkoła** | **BŁĄD: Rodzina/Szkoła** |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | **BŁĄD: Rodzina/Szkoła** |

<a id="case-147"></a>

### a11y: err msg + focus po submit

Przypadek: engineer / hard-engineer-06. **Oczekiwany folder: Work/Atlas/Web.** Błędne decyzje: **7/12**.

Opis strony: Atlas signup: screen reader announcement and moving focus to the invalid field.

Oznaczenia danych: hard-synthetic, abbreviation, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Web: Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Atlas/Ops** |
| Średnia 3 zakładek | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Centroid folderu | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | Work/Atlas/Web ✓ |

<a id="case-181"></a>

### Mapy na licznik, jak wrzucić GPX?

Przypadek: engineer / hard-engineer-40. **Oczekiwany folder: Life/Bike/Trips.** Błędne decyzje: **7/12**.

Opis strony: Przygotowanie pliku z trasą na sobotni przejazd i import śladu do nawigacji.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Life/Bike/Gear. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Trips: Cycling routes, GPX tracks and practical ride planning, rather than equipment shopping.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/API** | Life/Bike/Trips ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/API** | Life/Bike/Trips ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/API** | Life/Bike/Trips ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/Ops** | Life/Bike/Trips ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/Ops** | **BŁĄD: Work/Ref/Web** |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/API** | Life/Bike/Trips ✓ |

<a id="case-195"></a>

### Rust od podstaw — druk

Przypadek: engineer / hard-engineer-54. **Oczekiwany folder: Life/Buy/Books.** Błędne decyzje: **7/12**.

Opis strony: Książka, oprawa miękka, ISBN i formularz zamówienia.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Ref/Web. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Books: Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Nazwa folderu + zakładka | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Ręczny opis + zakładka | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Średnia 3 zakładek | **BŁĄD: Learn/ML/NLP** | **BŁĄD: Work/Ref/Web** |
| Centroid folderu | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Słowa kluczowe + embedding | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |

<a id="case-209"></a>

### PP czy PEX pod prysznic?

Przypadek: household / hard-household-08. **Oczekiwany folder: Dom/Remont/Łazienka.** Błędne decyzje: **7/12**.

Opis strony: Porównanie rur do zasilania baterii prysznicowej i sposobu ich łączenia.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Łazienka: Bathroom renovation, plumbing fixtures and installation details, separate from kitchen fixtures.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Dom/Remont/Kuchnia** | **BŁĄD: Dom/Rachunki** |
| Nazwa folderu + zakładka | **BŁĄD: Dom/Remont/Kuchnia** | **BŁĄD: Dom/Remont/Kuchnia** |
| Ręczny opis + zakładka | **BŁĄD: Dom/Remont/Kuchnia** | Dom/Remont/Łazienka ✓ |
| Średnia 3 zakładek | Dom/Remont/Łazienka ✓ | Dom/Remont/Łazienka ✓ |
| Centroid folderu | Dom/Remont/Łazienka ✓ | Dom/Remont/Łazienka ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Dom/Remont/Kuchnia** | **BŁĄD: Dom/Rachunki** |

<a id="case-222"></a>

### POZ — teleporada, zapisy

Przypadek: household / hard-household-21. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **7/12**.

Opis strony: Panel przychodni umożliwiający umówienie konsultacji lekarza rodzinnego.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | **BŁĄD: Rodzina/Szkoła** |
| Nazwa folderu + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Centroid folderu | Rodzina/Zdrowie ✓ | **BŁĄD: Rodzina/Szkoła** |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | **BŁĄD: Rodzina/Szkoła** |

<a id="case-286"></a>

### Readable forms: font comparison

Przypadek: designer / hard-designer-25. **Oczekiwany folder: Studio/Ref/Type.** Błędne decyzje: **6/12**.

Opis strony: A general typeface comparison for small form labels and interface text.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Studio/Ref/UX. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/Type: Reusable typeface, typography and lettering references not committed to a specific client.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Studio/Ref/UX** | **BŁĄD: Studio/Ref/UX** |
| Nazwa folderu + zakładka | Studio/Ref/Type ✓ | **BŁĄD: Studio/Ref/UX** |
| Ręczny opis + zakładka | Studio/Ref/Type ✓ | **BŁĄD: Studio/Ref/UX** |
| Średnia 3 zakładek | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Centroid folderu | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Studio/Ref/UX** | **BŁĄD: Studio/Ref/UX** |

<a id="case-295"></a>

### VAT UE — rejestracja

Przypadek: designer / hard-designer-34. **Oczekiwany folder: Firma/Admin/PL.** Błędne decyzje: **6/12**.

Opis strony: Informacja administracyjna dla przedsiębiorcy z polskim numerem identyfikacyjnym.

Oznaczenia danych: hard-synthetic, abbreviation, jurisdiction.

Uzasadnienie etykiety zapisane w zbiorze: Use Firma/Admin/PL: Polish freelance invoices, contracts, taxes and administration, regardless of the language of the source.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |
| Ręczny opis + zakładka | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |
| Średnia 3 zakładek | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |
| Centroid folderu | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Firma/Admin/DE** | Firma/Admin/PL ✓ |

<a id="case-312"></a>

### Mapel chekout err states

Przypadek: designer / hard-designer-51. **Oczekiwany folder: Clients/Maple/Web.** Błędne decyzje: **6/12**.

Opis strony: Maple client handoff: validation and error messages on the payment page.

Oznaczenia danych: hard-synthetic, typo.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Web: Maple ecommerce site navigation, product pages, checkout and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Średnia 3 zakładek | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |
| Centroid folderu | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |

<a id="case-162"></a>

### MDN-ish notes: IO vs RO

Przypadek: engineer / hard-engineer-21. **Oczekiwany folder: Work/Ref/Web.** Błędne decyzje: **6/12**.

Opis strony: Generic browser reference comparing IntersectionObserver and ResizeObserver with reusable examples.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Ref/Web: Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Work/Ref/Web ✓ | **BŁĄD: Learn/ML/NLP** |
| Nazwa folderu + zakładka | Work/Ref/Web ✓ | **BŁĄD: Learn/ML/NLP** |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Web** | **BŁĄD: Learn/ML/NLP** |
| Średnia 3 zakładek | Work/Ref/Web ✓ | **BŁĄD: Learn/ML/NLP** |
| Centroid folderu | Work/Ref/Web ✓ | Work/Ref/Web ✓ |
| Słowa kluczowe + embedding | Work/Ref/Web ✓ | **BŁĄD: Learn/ML/NLP** |

<a id="case-190"></a>

### Ten mniejszy

Przypadek: engineer / hard-engineer-49. **Oczekiwany folder: Life/Buy/Tech.** Błędne decyzje: **6/12**.

Opis strony: Monitor 24 cale: porty, regulacja wysokości i cena w sklepie.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Tech: Personal electronics and computer accessory purchases, rather than cycling equipment or work implementation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | Life/Buy/Tech ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/API** | Life/Buy/Tech ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/API** | Life/Buy/Tech ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |

<a id="case-226"></a>

### Dieta przy niedoborach — konsultacja

Przypadek: household / hard-household-25. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **6/12**.

Opis strony: Poradnia wyjaśnia zakres wizyty dietetycznej i potrzebne wyniki badań.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Gotowanie/Obiady. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Gotowanie/Obiady** | Rodzina/Zdrowie ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Gotowanie/Obiady** | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | **BŁĄD: Gotowanie/Obiady** | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Centroid folderu | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Gotowanie/Obiady** | Rodzina/Zdrowie ✓ |

<a id="case-234"></a>

### Escapadas de otoño en tren

Przypadek: household / hard-household-33. **Oczekiwany folder: Wyjazdy/Pomysły.** Błędne decyzje: **6/12**.

Opis strony: Inspiración para futuros viajes cortos sin destino reservado.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Wyjazdy/Pomysły: Inspiration for future trips without an active destination plan; material specifically for Berlin goes in its trip folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Średnia 3 zakładek | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Centroid folderu | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |

<a id="case-238"></a>

### Übergangsjacke Gr. 128

Przypadek: household / hard-household-37. **Oczekiwany folder: Kupić/Ubrania.** Błędne decyzje: **6/12**.

Opis strony: Kinderjacke im Onlineshop, Größentabelle und Materialangaben.

Oznaczenia danych: hard-synthetic, abbreviation, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Kupić/Ubrania: Clothes and shoes for the family, including school and travel clothing purchases.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |
| Ręczny opis + zakładka | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |
| Średnia 3 zakładek | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |
| Centroid folderu | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | Kupić/Ubrania ✓ |

<a id="case-256"></a>

### Do sprawdzenia

Przypadek: household / hard-household-55. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **6/12**.

Opis strony: Informacja przychodni o zapisach na konsultację alergologiczną dziecka.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Centroid folderu | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |

<a id="case-316"></a>

### PD strap / quick release

Przypadek: designer / hard-designer-55. **Oczekiwany folder: Osobiste/Foto/Sprzęt.** Błędne decyzje: **5/12**.

Opis strony: A camera strap product page with attachment compatibility, dimensions and purchase options.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Osobiste/Foto/Sprzęt: Camera and lens purchases, compatibility and maintenance, rather than photo locations.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Clients/Maple/Web** |
| Nazwa folderu + zakładka | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Clients/Maple/Web** |
| Ręczny opis + zakładka | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Clients/Maple/Web** |
| Średnia 3 zakładek | Osobiste/Foto/Sprzęt ✓ | Osobiste/Foto/Sprzęt ✓ |
| Centroid folderu | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Studio/Ref/UX** |
| Słowa kluczowe + embedding | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Clients/Maple/Web** |

<a id="case-150"></a>

### Specs

Przypadek: engineer / hard-engineer-09. **Oczekiwany folder: Work/Atlas/Web.** Błędne decyzje: **5/12**.

Opis strony: Atlas settings page: empty state, keyboard order and inline validation.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Web: Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/API** | Work/Atlas/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/API** | Work/Atlas/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas/Web ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/Ops** | Work/Atlas/Web ✓ |
| Centroid folderu | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/API** | Work/Atlas/Web ✓ |

<a id="case-159"></a>

### Atlas — sauvegarde et restauration

Przypadek: engineer / hard-engineer-18. **Oczekiwany folder: Work/Atlas/Ops.** Błędne decyzje: **5/12**.

Opis strony: Procédure de restauration de la base après un incident, avec responsabilités de garde.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Ops: Deployments, incidents, monitoring and infrastructure for Atlas, including operational security and availability.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Ręczny opis + zakładka | Work/Atlas/Ops ✓ | Work/Atlas/Ops ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |

<a id="case-180"></a>

### Vélo: boucle facile près de la rivière

Przypadek: engineer / hard-engineer-39. **Oczekiwany folder: Life/Bike/Trips.** Błędne decyzje: **5/12**.

Opis strony: Parcours cyclable, dénivelé et points de ravitaillement pour une sortie à la journée.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Trips: Cycling routes, GPX tracks and practical ride planning, rather than equipment shopping.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Life/Bike/Gear** | Life/Bike/Trips ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Life/Bike/Gear** | Life/Bike/Trips ✓ |
| Ręczny opis + zakładka | **BŁĄD: Life/Bike/Gear** | Life/Bike/Trips ✓ |
| Średnia 3 zakładek | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Centroid folderu | **BŁĄD: Life/Bike/Gear** | Life/Bike/Trips ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Life/Bike/Gear** | Life/Bike/Trips ✓ |

<a id="case-183"></a>

### SQL. Małe kroki — ebook

Przypadek: engineer / hard-engineer-42. **Oczekiwany folder: Life/Buy/Books.** Błędne decyzje: **5/12**.

Opis strony: Strona zakupu książki technicznej w formacie EPUB i PDF.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Work/Ref/Web. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Books: Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Nazwa folderu + zakładka | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Ręczny opis + zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Średnia 3 zakładek | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Centroid folderu | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Słowa kluczowe + embedding | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |

<a id="case-191"></a>

### Garmin mount + powerbank bundle

Przypadek: engineer / hard-engineer-50. **Oczekiwany folder: Life/Buy/Tech.** Błędne decyzje: **5/12**.

Opis strony: Shopping page for a general-purpose USB power bank bundled with a bike computer accessory.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Life/Bike/Gear. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Tech: Personal electronics and computer accessory purchases, rather than cycling equipment or work implementation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Ręczny opis + zakładka | Life/Buy/Tech ✓ | Life/Buy/Tech ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Life/Bike/Gear** | Life/Buy/Tech ✓ |

<a id="case-201"></a>

### Atlas — sauvegarde et restauration

Przypadek: engineer / hard-engineer-60. **Oczekiwany folder: Work/Atlas/Ops.** Błędne decyzje: **5/12**.

Opis strony: Procédure de restauration de la base après un incident, avec responsabilités de garde.

Oznaczenia danych: hard-synthetic, cross-language, duplicate.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Ops: Deployments, incidents, monitoring and infrastructure for Atlas, including operational security and availability.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Ręczny opis + zakładka | Work/Atlas/Ops ✓ | Work/Atlas/Ops ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas** | Work/Atlas/Ops ✓ |

<a id="case-203"></a>

### Spüle: 1 Becken, Unterschrank 60

Przypadek: household / hard-household-02. **Oczekiwany folder: Dom/Remont/Kuchnia.** Błędne decyzje: **5/12**.

Opis strony: Produktmaße und Einbauzeichnung für eine neue Küchenspüle.

Oznaczenia danych: hard-synthetic, abbreviation, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Kuchnia: Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Nazwa folderu + zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Ręczny opis + zakładka | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Średnia 3 zakładek | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Centroid folderu | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Słowa kluczowe + embedding | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |

<a id="case-205"></a>

### Warto sprawdzić

Przypadek: household / hard-household-04. **Oczekiwany folder: Dom/Remont/Kuchnia.** Błędne decyzje: **5/12**.

Opis strony: Bateria nad zlewem: zasięg wylewki dopasowany do zabudowy kuchennej.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Kuchnia: Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Nazwa folderu + zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Ręczny opis + zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Średnia 3 zakładek | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Centroid folderu | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Słowa kluczowe + embedding | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |

<a id="case-276"></a>

### Maple typography scale

Przypadek: designer / hard-designer-15. **Oczekiwany folder: Clients/Maple/Brand.** Błędne decyzje: **4/12**.

Opis strony: Client type styles proposed for packaging and the upcoming ecommerce site.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Maple/Web. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Brand: Maple client identity: logo, palette, packaging and print materials, separate from Orbit and website behavior.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Clients/Maple/Brand ✓ | **BŁĄD: Clients/Maple/Web** |
| Nazwa folderu + zakładka | Clients/Maple/Brand ✓ | **BŁĄD: Clients/Maple/Web** |
| Ręczny opis + zakładka | Clients/Maple/Brand ✓ | **BŁĄD: Clients/Maple/Web** |
| Średnia 3 zakładek | Clients/Maple/Brand ✓ | Clients/Maple/Brand ✓ |
| Centroid folderu | Clients/Maple/Brand ✓ | **BŁĄD: Clients/Maple/Web** |
| Słowa kluczowe + embedding | Clients/Maple/Brand ✓ | Clients/Maple/Brand ✓ |

<a id="case-143"></a>

### QBR notes, WIP

Przypadek: engineer / hard-engineer-02. **Oczekiwany folder: Work/Atlas.** Błędne decyzje: **4/12**.

Opis strony: Atlas quarterly review: adoption goals, support workload and decisions for next quarter.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas: General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/API** | Work/Atlas ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/API** | Work/Atlas ✓ |
| Ręczny opis + zakładka | Work/Atlas ✓ | Work/Atlas ✓ |
| Średnia 3 zakładek | Work/Atlas ✓ | Work/Atlas ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/API** | Work/Atlas ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/API** | Work/Atlas ✓ |

<a id="case-163"></a>

### focus trap bez liba

Przypadek: engineer / hard-engineer-22. **Oczekiwany folder: Work/Ref/Web.** Błędne decyzje: **4/12**.

Opis strony: Uniwersalny przykład obsługi klawiatury w oknie dialogowym, niezwiązany z konkretnym projektem.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Ref/Web: Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Średnia 3 zakładek | Work/Ref/Web ✓ | Work/Ref/Web ✓ |
| Centroid folderu | Work/Ref/Web ✓ | Work/Ref/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |

<a id="case-194"></a>

### inert vs aria-hidden

Przypadek: engineer / hard-engineer-53. **Oczekiwany folder: Work/Ref/Web.** Błędne decyzje: **4/12**.

Opis strony: Reusable guidance about disabling background UI while a dialog is open.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Ref/Web: Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |
| Średnia 3 zakładek | Work/Ref/Web ✓ | Work/Ref/Web ✓ |
| Centroid folderu | Work/Ref/Web ✓ | Work/Ref/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Web** | Work/Ref/Web ✓ |

<a id="case-207"></a>

### WC podw., stelaż 112 — karta tech.

Przypadek: household / hard-household-06. **Oczekiwany folder: Dom/Remont/Łazienka.** Błędne decyzje: **4/12**.

Opis strony: Rysunek montażowy miski i stelaża do remontu łazienki.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Łazienka: Bathroom renovation, plumbing fixtures and installation details, separate from kitchen fixtures.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Dom/Remont/Łazienka ✓ | **BŁĄD: Dom/Remont/Kuchnia** |
| Nazwa folderu + zakładka | Dom/Remont/Łazienka ✓ | **BŁĄD: Dom/Remont/Kuchnia** |
| Ręczny opis + zakładka | Dom/Remont/Łazienka ✓ | **BŁĄD: Dom/Remont/Kuchnia** |
| Średnia 3 zakładek | Dom/Remont/Łazienka ✓ | Dom/Remont/Łazienka ✓ |
| Centroid folderu | Dom/Remont/Łazienka ✓ | Dom/Remont/Łazienka ✓ |
| Słowa kluczowe + embedding | Dom/Remont/Łazienka ✓ | **BŁĄD: Dom/Remont/Kuchnia** |

<a id="case-215"></a>

### Rozliczenie

Przypadek: household / hard-household-14. **Oczekiwany folder: Dom/Rachunki.** Błędne decyzje: **4/12**.

Opis strony: Odczyt wodomierza, zużycie i niedopłata za ostatni okres.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Rachunki: Household electricity, water, heating and internet bills, meter readings and tariffs.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Dom/Remont/Łazienka** | Dom/Rachunki ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Dom/Remont/Łazienka** | Dom/Rachunki ✓ |
| Ręczny opis + zakładka | Dom/Rachunki ✓ | Dom/Rachunki ✓ |
| Średnia 3 zakładek | **BŁĄD: Dom/Remont/Łazienka** | Dom/Rachunki ✓ |
| Centroid folderu | **BŁĄD: Dom/Remont/Łazienka** | Dom/Rachunki ✓ |
| Słowa kluczowe + embedding | Dom/Rachunki ✓ | Dom/Rachunki ✓ |

<a id="case-224"></a>

### Ordonnance: renouvellement

Przypadek: household / hard-household-23. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **4/12**.

Opis strony: Informations du cabinet pour demander un rendez-vous de renouvellement de prescription.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Centroid folderu | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |

<a id="case-244"></a>

### Le cerveau des ados — extrait

Przypadek: household / hard-household-43. **Oczekiwany folder: Czytanie/Książki.** Błędne decyzje: **4/12**.

Opis strony: Extrait du livre, présentation de l’auteur et formats disponibles à l’achat.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Czytanie/Książki: Books and ebooks to read or buy, including travel, food and parenting books.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Nazwa folderu + zakładka | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Ręczny opis + zakładka | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Średnia 3 zakładek | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Centroid folderu | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Słowa kluczowe + embedding | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |

<a id="case-277"></a>

### Maple PDP: ATC disabled OOS

Przypadek: designer / hard-designer-16. **Oczekiwany folder: Clients/Maple/Web.** Błędne decyzje: **3/12**.

Opis strony: Product-page behavior when an item is out of stock and the add-to-cart button is unavailable.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Web: Maple ecommerce site navigation, product pages, checkout and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Ręczny opis + zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Średnia 3 zakładek | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Centroid folderu | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Studio/Ref/UX** | Clients/Maple/Web ✓ |

<a id="case-289"></a>

### Jak skrócić formularz, tl;dr

Przypadek: designer / hard-designer-28. **Oczekiwany folder: Studio/Ref/UX.** Błędne decyzje: **3/12**.

Opis strony: Wzorce projektowe do biblioteki referencji: etykiety, wskazówki i walidacja.

Oznaczenia danych: hard-synthetic, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/UX: Reusable interaction design and accessibility research, independent of a client deliverable.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Studio/Ref/UX ✓ | Studio/Ref/UX ✓ |
| Nazwa folderu + zakładka | Studio/Ref/UX ✓ | Studio/Ref/UX ✓ |
| Ręczny opis + zakładka | Studio/Ref/UX ✓ | Studio/Ref/UX ✓ |
| Średnia 3 zakładek | **BŁĄD: Studio/Ref/Type** | **BŁĄD: Studio/Ref/Type** |
| Centroid folderu | **BŁĄD: Studio/Ref/Type** | Studio/Ref/UX ✓ |
| Słowa kluczowe + embedding | Studio/Ref/UX ✓ | Studio/Ref/UX ✓ |

<a id="case-315"></a>

### lic. desktop/webfont?

Przypadek: designer / hard-designer-54. **Oczekiwany folder: Studio/Ref/Type.** Błędne decyzje: **3/12**.

Opis strony: A reusable font licensing reference explaining desktop and web embedding terms.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/Type: Reusable typeface, typography and lettering references not committed to a specific client.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Studio/Ref/Type ✓ | **BŁĄD: Studio/Ref/UX** |
| Nazwa folderu + zakładka | Studio/Ref/Type ✓ | **BŁĄD: Studio/Ref/UX** |
| Ręczny opis + zakładka | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Średnia 3 zakładek | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Centroid folderu | Studio/Ref/Type ✓ | **BŁĄD: Studio/Ref/UX** |
| Słowa kluczowe + embedding | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |

<a id="case-142"></a>

### Atlas — scope v3 / do piątku

Przypadek: engineer / hard-engineer-01. **Oczekiwany folder: Work/Atlas.** Błędne decyzje: **3/12**.

Opis strony: Zakres wydania, otwarte decyzje biznesowe i właściciele zadań zespołów.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas: General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Średnia 3 zakładek | Work/Atlas ✓ | Work/Atlas ✓ |
| Centroid folderu | Work/Atlas ✓ | Work/Atlas ✓ |
| Słowa kluczowe + embedding | Work/Atlas ✓ | Work/Atlas ✓ |

<a id="case-172"></a>

### szosa: klocki żyw. czy metal?

Przypadek: engineer / hard-engineer-31. **Oczekiwany folder: Life/Bike/Gear.** Błędne decyzje: **3/12**.

Opis strony: Porównanie klocków hamulcowych do roweru na mokre dojazdy.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Gear: Bicycle equipment purchases, fit and mechanical maintenance.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Life/Buy/Tech** | Life/Bike/Gear ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Life/Buy/Tech** | Life/Bike/Gear ✓ |
| Ręczny opis + zakładka | Life/Bike/Gear ✓ | Life/Bike/Gear ✓ |
| Średnia 3 zakładek | Life/Bike/Gear ✓ | Life/Bike/Gear ✓ |
| Centroid folderu | Life/Bike/Gear ✓ | Life/Bike/Gear ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Life/Buy/Tech** | Life/Bike/Gear ✓ |

<a id="case-177"></a>

### sob. 70k / bez asfaltu

Przypadek: engineer / hard-engineer-36. **Oczekiwany folder: Life/Bike/Trips.** Błędne decyzje: **3/12**.

Opis strony: Ślad GPX pętli gravelowej, miejsca z wodą i możliwość skrócenia przejazdu.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Trips: Cycling routes, GPX tracks and practical ride planning, rather than equipment shopping.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | Life/Bike/Trips ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | Life/Bike/Trips ✓ |
| Ręczny opis + zakładka | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Średnia 3 zakładek | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Centroid folderu | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Ops** | Life/Bike/Trips ✓ |

<a id="case-185"></a>

### to read

Przypadek: engineer / hard-engineer-44. **Oczekiwany folder: Life/Buy/Books.** Błędne decyzje: **3/12**.

Opis strony: Review of a nonfiction book about software teams, with links to available editions.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Books: Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Life/Buy/Books ✓ | **BŁĄD: Learn/ML/NLP** |
| Nazwa folderu + zakładka | Life/Buy/Books ✓ | **BŁĄD: Learn/ML/NLP** |
| Ręczny opis + zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Średnia 3 zakładek | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Centroid folderu | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Słowa kluczowe + embedding | Life/Buy/Books ✓ | **BŁĄD: Learn/ML/NLP** |

<a id="case-189"></a>

### ANC casque — comparaison

Przypadek: engineer / hard-engineer-48. **Oczekiwany folder: Life/Buy/Tech.** Błędne decyzje: **3/12**.

Opis strony: Comparatif de casques audio sans fil, autonomie, prix et confort.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Tech: Personal electronics and computer accessory purchases, rather than cycling equipment or work implementation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |
| Ręczny opis + zakładka | Life/Buy/Tech ✓ | Life/Buy/Tech ✓ |
| Średnia 3 zakładek | Life/Buy/Tech ✓ | Life/Buy/Tech ✓ |
| Centroid folderu | Life/Buy/Tech ✓ | Life/Buy/Tech ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Work/Atlas/Web** | Life/Buy/Tech ✓ |

<a id="case-200"></a>

### Atlas — scope v3 / do piątku

Przypadek: engineer / hard-engineer-59. **Oczekiwany folder: Work/Atlas.** Błędne decyzje: **3/12**.

Opis strony: Zakres wydania, otwarte decyzje biznesowe i właściciele zadań zespołów.

Oznaczenia danych: hard-synthetic, shorthand, duplicate.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas: General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas ✓ |
| Średnia 3 zakładek | Work/Atlas ✓ | Work/Atlas ✓ |
| Centroid folderu | Work/Atlas ✓ | Work/Atlas ✓ |
| Słowa kluczowe + embedding | Work/Atlas ✓ | Work/Atlas ✓ |

<a id="case-221"></a>

### Alergia w klasie — formularz szkoły

Przypadek: household / hard-household-20. **Oczekiwany folder: Rodzina/Szkoła.** Błędne decyzje: **3/12**.

Opis strony: Informacja dla wychowawcy o ograniczeniach żywieniowych ucznia i zasadach opieki.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Rodzina/Zdrowie. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Szkoła: School notices, parent forms, homework and pupil activities; medical care goes under health.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Gotowanie/Obiady** | Rodzina/Szkoła ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Gotowanie/Obiady** | Rodzina/Szkoła ✓ |
| Ręczny opis + zakładka | Rodzina/Szkoła ✓ | Rodzina/Szkoła ✓ |
| Średnia 3 zakładek | Rodzina/Szkoła ✓ | Rodzina/Szkoła ✓ |
| Centroid folderu | Rodzina/Szkoła ✓ | Rodzina/Szkoła ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Gotowanie/Obiady** | Rodzina/Szkoła ✓ |

<a id="case-233"></a>

### Kurztrip mit Kindern: Seen und Wald

Przypadek: household / hard-household-32. **Oczekiwany folder: Wyjazdy/Pomysły.** Błędne decyzje: **3/12**.

Opis strony: Ideen für spätere Familienausflüge, mit verschiedenen Regionen zur Auswahl.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Wyjazdy/Pomysły: Inspiration for future trips without an active destination plan; material specifically for Berlin goes in its trip folder.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Nazwa folderu + zakładka | Wyjazdy/Pomysły ✓ | Wyjazdy/Pomysły ✓ |
| Ręczny opis + zakładka | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |
| Średnia 3 zakładek | Wyjazdy/Pomysły ✓ | Wyjazdy/Pomysły ✓ |
| Centroid folderu | Wyjazdy/Pomysły ✓ | Wyjazdy/Pomysły ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Wyjazdy/2027/Berlin** | Wyjazdy/Pomysły ✓ |

<a id="case-270"></a>

### v7 poprawki

Przypadek: designer / hard-designer-09. **Oczekiwany folder: Clients/Orbit/Web.** Błędne decyzje: **2/12**.

Opis strony: Orbit: układ strony kontaktu, odległości między polami i zachowanie przy błędzie serwera.

Oznaczenia danych: hard-synthetic, vague-title.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Orbit/Web: Orbit website layouts, responsive behavior, accessibility and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Clients/Orbit/Brand** | Clients/Orbit/Web ✓ |
| Nazwa folderu + zakładka | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Ręczny opis + zakładka | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Średnia 3 zakładek | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Centroid folderu | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Clients/Orbit/Brand** | Clients/Orbit/Web ✓ |

<a id="case-283"></a>

### kerning / tracking — ściąga

Przypadek: designer / hard-designer-22. **Oczekiwany folder: Studio/Ref/Type.** Błędne decyzje: **2/12**.

Opis strony: Ogólna notatka o odstępach między literami i czytelności nagłówków.

Oznaczenia danych: hard-synthetic, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Studio/Ref/Type: Reusable typeface, typography and lettering references not committed to a specific client.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Nazwa folderu + zakładka | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Ręczny opis + zakładka | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Średnia 3 zakładek | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |
| Centroid folderu | **BŁĄD: Studio/Ref/UX** | **BŁĄD: Studio/Ref/UX** |
| Słowa kluczowe + embedding | Studio/Ref/Type ✓ | Studio/Ref/Type ✓ |

<a id="case-303"></a>

### szkło 35/1.8 — używka

Przypadek: designer / hard-designer-42. **Oczekiwany folder: Osobiste/Foto/Sprzęt.** Błędne decyzje: **2/12**.

Opis strony: Oferta używanego obiektywu fotograficznego, stan soczewek i mocowanie.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Osobiste/Foto/Sprzęt: Camera and lens purchases, compatibility and maintenance, rather than photo locations.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Osobiste/Foto/Plenery** |
| Nazwa folderu + zakładka | Osobiste/Foto/Sprzęt ✓ | Osobiste/Foto/Sprzęt ✓ |
| Ręczny opis + zakładka | Osobiste/Foto/Sprzęt ✓ | Osobiste/Foto/Sprzęt ✓ |
| Średnia 3 zakładek | Osobiste/Foto/Sprzęt ✓ | Osobiste/Foto/Sprzęt ✓ |
| Centroid folderu | Osobiste/Foto/Sprzęt ✓ | Osobiste/Foto/Sprzęt ✓ |
| Słowa kluczowe + embedding | Osobiste/Foto/Sprzęt ✓ | **BŁĄD: Osobiste/Foto/Plenery** |

<a id="case-148"></a>

### FE: CLS on PDP, repro inside

Przypadek: engineer / hard-engineer-07. **Oczekiwany folder: Work/Atlas/Web.** Błędne decyzje: **2/12**.

Opis strony: Atlas product detail cards shift when thumbnails arrive; screenshots and frontend acceptance criteria.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Web: Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Nazwa folderu + zakładka | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Ręczny opis + zakładka | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Średnia 3 zakładek | **BŁĄD: Work/Atlas/API** | Work/Atlas/Web ✓ |
| Centroid folderu | **BŁĄD: Work/Atlas/API** | Work/Atlas/Web ✓ |
| Słowa kluczowe + embedding | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |

<a id="case-149"></a>

### Atlas — bouton désactivé sur mobile

Przypadek: engineer / hard-engineer-08. **Oczekiwany folder: Work/Atlas/Web.** Błędne decyzje: **2/12**.

Opis strony: Le formulaire du portail Atlas ne permet plus de valider sur petit écran; étapes de reproduction.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Work/Atlas/Web: Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas/Web ✓ |
| Ręczny opis + zakładka | **BŁĄD: Work/Atlas/Ops** | Work/Atlas/Web ✓ |
| Średnia 3 zakładek | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Centroid folderu | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |
| Słowa kluczowe + embedding | Work/Atlas/Web ✓ | Work/Atlas/Web ✓ |

<a id="case-202"></a>

### zmyw. 45 do zabud. — porówn.

Przypadek: household / hard-household-01. **Oczekiwany folder: Dom/Remont/Kuchnia.** Błędne decyzje: **2/12**.

Opis strony: Wymiary urządzeń, poziom hałasu i front meblowy do remontowanej kuchni.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Kuchnia: Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Nazwa folderu + zakładka | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Ręczny opis + zakładka | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Średnia 3 zakładek | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Centroid folderu | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Słowa kluczowe + embedding | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |

<a id="case-223"></a>

### USG j. brzusznej — przygot.

Przypadek: household / hard-household-22. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **2/12**.

Opis strony: Informacja placówki o przygotowaniu do umówionego badania; bez danych pacjenta.

Oznaczenia danych: hard-synthetic, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |
| Nazwa folderu + zakładka | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Centroid folderu | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Słowa kluczowe + embedding | **BŁĄD: Rodzina/Szkoła** | Rodzina/Zdrowie ✓ |

<a id="case-260"></a>

### zmyw. 45 do zabud. — porówn.

Przypadek: household / hard-household-59. **Oczekiwany folder: Dom/Remont/Kuchnia.** Błędne decyzje: **2/12**.

Opis strony: Wymiary urządzeń, poziom hałasu i front meblowy do remontowanej kuchni.

Oznaczenia danych: hard-synthetic, shorthand, duplicate.

Uzasadnienie etykiety zapisane w zbiorze: Use Dom/Remont/Kuchnia: Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |
| Nazwa folderu + zakładka | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Ręczny opis + zakładka | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Średnia 3 zakładek | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Centroid folderu | Dom/Remont/Kuchnia ✓ | Dom/Remont/Kuchnia ✓ |
| Słowa kluczowe + embedding | Dom/Remont/Kuchnia ✓ | **BŁĄD: Dom/Remont/Łazienka** |

<a id="case-271"></a>

### Font weight for Orbit checkout

Przypadek: designer / hard-designer-10. **Oczekiwany folder: Clients/Orbit/Web.** Błędne decyzje: **1/12**.

Opis strony: Website implementation handoff showing typography in form controls and purchase steps.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Orbit/Brand. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Orbit/Web: Orbit website layouts, responsive behavior, accessibility and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Nazwa folderu + zakładka | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Ręczny opis + zakładka | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Średnia 3 zakładek | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |
| Centroid folderu | Clients/Orbit/Web ✓ | **BŁĄD: Studio/Ref/UX** |
| Słowa kluczowe + embedding | Clients/Orbit/Web ✓ | Clients/Orbit/Web ✓ |

<a id="case-278"></a>

### Maple PLP — filtry na mob.

Przypadek: designer / hard-designer-17. **Oczekiwany folder: Clients/Maple/Web.** Błędne decyzje: **1/12**.

Opis strony: Zachowanie filtrów i sortowania na mobilnej liście produktów sklepu Maple.

Oznaczenia danych: hard-synthetic, abbreviation, mixed-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Web: Maple ecommerce site navigation, product pages, checkout and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Nazwa folderu + zakładka | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Ręczny opis + zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Średnia 3 zakładek | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Centroid folderu | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Słowa kluczowe + embedding | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |

<a id="case-281"></a>

### Maple label preview on product page

Przypadek: designer / hard-designer-20. **Oczekiwany folder: Clients/Maple/Web.** Błędne decyzje: **1/12**.

Opis strony: Client website layout for viewing a product label before adding the item to the basket.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Clients/Maple/Brand. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap.

Uzasadnienie etykiety zapisane w zbiorze: Use Clients/Maple/Web: Maple ecommerce site navigation, product pages, checkout and implementation handoff.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Nazwa folderu + zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Ręczny opis + zakładka | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Średnia 3 zakładek | **BŁĄD: Clients/Maple/Brand** | Clients/Maple/Web ✓ |
| Centroid folderu | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |
| Słowa kluczowe + embedding | Clients/Maple/Web ✓ | Clients/Maple/Web ✓ |

<a id="case-292"></a>

### FV / korekta / NIP, check

Przypadek: designer / hard-designer-31. **Oczekiwany folder: Firma/Admin/PL.** Błędne decyzje: **1/12**.

Opis strony: Notatka biura księgowego o poprawianiu polskiej faktury za usługę projektową.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Firma/Admin/PL: Polish freelance invoices, contracts, taxes and administration, regardless of the language of the source.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Firma/Admin/PL ✓ | Firma/Admin/PL ✓ |
| Nazwa folderu + zakładka | Firma/Admin/PL ✓ | Firma/Admin/PL ✓ |
| Ręczny opis + zakładka | Firma/Admin/PL ✓ | Firma/Admin/PL ✓ |
| Średnia 3 zakładek | Firma/Admin/PL ✓ | **BŁĄD: Firma/Admin/DE** |
| Centroid folderu | Firma/Admin/PL ✓ | Firma/Admin/PL ✓ |
| Słowa kluczowe + embedding | Firma/Admin/PL ✓ | Firma/Admin/PL ✓ |

<a id="case-169"></a>

### Retrieval sin etiquetas

Przypadek: engineer / hard-engineer-28. **Oczekiwany folder: Learn/ML/NLP.** Błędne decyzje: **1/12**.

Opis strony: Ejercicio sobre búsqueda semántica de textos cortos y evaluación de vecinos cercanos.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Learn/ML/NLP: Language models, text embeddings and retrieval experiments for personal learning, rather than Atlas production incidents.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Learn/ML/NLP ✓ | Learn/ML/NLP ✓ |
| Nazwa folderu + zakładka | Learn/ML/NLP ✓ | Learn/ML/NLP ✓ |
| Ręczny opis + zakładka | Learn/ML/NLP ✓ | Learn/ML/NLP ✓ |
| Średnia 3 zakładek | Learn/ML/NLP ✓ | Learn/ML/NLP ✓ |
| Centroid folderu | **BŁĄD: Work/Ref/Web** | Learn/ML/NLP ✓ |
| Słowa kluczowe + embedding | Learn/ML/NLP ✓ | Learn/ML/NLP ✓ |

<a id="case-178"></a>

### R1 detour, w/ train back

Przypadek: engineer / hard-engineer-37. **Oczekiwany folder: Life/Bike/Trips.** Błędne decyzje: **1/12**.

Opis strony: A bike route with a closed bridge bypass and return connections from the station.

Oznaczenia danych: hard-synthetic, abbreviation.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Bike/Trips: Cycling routes, GPX tracks and practical ride planning, rather than equipment shopping.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Nazwa folderu + zakładka | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Ręczny opis + zakładka | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Średnia 3 zakładek | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |
| Centroid folderu | Life/Bike/Trips ✓ | **BŁĄD: Work/Ref/Web** |
| Słowa kluczowe + embedding | Life/Bike/Trips ✓ | Life/Bike/Trips ✓ |

<a id="case-184"></a>

### Comprendre les réseaux — édition poche

Przypadek: engineer / hard-engineer-43. **Oczekiwany folder: Life/Buy/Books.** Błędne decyzje: **1/12**.

Opis strony: Présentation du livre, avis des lecteurs et options de commande.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Life/Buy/Books: Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Nazwa folderu + zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Ręczny opis + zakładka | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Średnia 3 zakładek | Life/Buy/Books ✓ | Life/Buy/Books ✓ |
| Centroid folderu | Life/Buy/Books ✓ | **BŁĄD: Work/Ref/Web** |
| Słowa kluczowe + embedding | Life/Buy/Books ✓ | Life/Buy/Books ✓ |

<a id="case-225"></a>

### Для батьків: перевірка зору

Przypadek: household / hard-household-24. **Oczekiwany folder: Rodzina/Zdrowie.** Błędne decyzje: **1/12**.

Opis strony: Інформація клініки про запис дитини на перевірку зору.

Oznaczenia danych: hard-synthetic, cross-language.

Uzasadnienie etykiety zapisane w zbiorze: Use Rodzina/Zdrowie: Family appointments, preventive health information and medical visit preparation.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Nazwa folderu + zakładka | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Ręczny opis + zakładka | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Średnia 3 zakładek | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |
| Centroid folderu | Rodzina/Zdrowie ✓ | **BŁĄD: Rodzina/Szkoła** |
| Słowa kluczowe + embedding | Rodzina/Zdrowie ✓ | Rodzina/Zdrowie ✓ |

<a id="case-242"></a>

### Książka kuch. — wyd. kieszonkowe

Przypadek: household / hard-household-41. **Oczekiwany folder: Czytanie/Książki.** Błędne decyzje: **1/12**.

Opis strony: Oferta zakupu książki z przepisami, ISBN i wybór wydania.

**NIEJEDNOZNACZNE — oznaczenie zapisane w zbiorze.** Alternatywy: Gotowanie/Obiady. Nadal oceniane względem głównego folderu.

Oznaczenia danych: hard-synthetic, overlap, shorthand.

Uzasadnienie etykiety zapisane w zbiorze: Use Czytanie/Książki: Books and ebooks to read or buy, including travel, food and parenting books.

| Strategia | MiniLM — wybrany folder | BGE — wybrany folder |
|---|---|---|
| Najbliższa zakładka | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Nazwa folderu + zakładka | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Ręczny opis + zakładka | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Średnia 3 zakładek | Czytanie/Książki ✓ | Czytanie/Książki ✓ |
| Centroid folderu | Czytanie/Książki ✓ | **BŁĄD: Rodzina/Szkoła** |
| Słowa kluczowe + embedding | Czytanie/Książki ✓ | Czytanie/Książki ✓ |

### Brak docelowego folderu — poza oceną trafności

Obecne strategie zawsze wybierają folder. Te zapisy nie są liczone jako błędne; wymagają osobnej oceny mechanizmu odrzucania. Poniżej wybory strategii z ręcznym opisem.

| Zakładka | MiniLM | BGE |
|---|---|---|
| Wniosek o odpis aktu urodzenia | Learn/ML/NLP | Work/Atlas/Ops |
| Lease renewal appointment | Work/Atlas/API | Work/Atlas/Ops |
| Bez tytułu | Life/Buy/Books | Work/Ref/Web |
| Kubernetes ingress annotations | Dom/Rachunki | Dom/Remont/Kuchnia |
| Live techno set — warehouse session | Dom/Rachunki | Rodzina/Szkoła |
| Bez tytułu | Czytanie/Książki | Czytanie/Książki |
| Mieszkanie: protokół zdawczo-odbiorczy | Firma/Admin/PL | Firma/Admin/PL |
| Sourdough starter, day 3 | Clients/Maple/Web | Studio/Ref/UX |
| Bez tytułu | Studio/Ref/Type | Osobiste/Foto/Plenery |
