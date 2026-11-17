# Bookmark Organizer

Rozszerzenie Chrome MV3 oparte na WXT, React i TypeScript. Przechwytuje nowe zakładki i pozwala wybrać lokalny model MiniLM Q8 albo BGE-M3 Q8.

## Uruchomienie

```sh
npm ci
npm run build
npm test
npm run typecheck
```

W Chrome otwórz `chrome://extensions`, włącz tryb dewelopera i załaduj `.output/chrome-mv3`.

## Obsługa

Nowo dodana zakładka pojawia się w okienku z tytułem, adresem i ścieżką folderu. Lista zawiera do 20 pozycji z bieżącej sesji. Zmiany zakładek aktualizują listę, a zgłoszone importy są pomijane.

Wybierz MiniLM Q8 (około 118 MB wag) albo BGE-M3 Q8 (około 570 MB wag). Włącz opcję uruchamiania modelu po dodaniu zakładki. Przy kolejnym zapisie model przetworzy tytuł. Pierwsze użycie pobiera pliki z Hugging Face, a kolejne korzystają z lokalnego Cache Storage.

Zmiana modelu zamyka poprzedni worker i anuluje jego kolejkę. Model zwalnia pamięć po 15 sekundach bezczynności. Wyłączenie przetwarzania również zwalnia model. Kod wykonawczy i WASM są dołączone do paczki rozszerzenia.

## Weryfikacja

`npm test` sprawdza detektor i ustawienia. `npm run test:model` uruchamia test przeglądarkowy w osobnym profilu z lokalnymi plikami MiniLM podanymi przez `MODEL_TEST_CACHE_DIR`. Test sprawdza przechwytywanie zakładek, zmianę modelu, pojedyncze przetworzenie MiniLM oraz zwolnienie workera po wyłączeniu. BGE wymaga osobnej próby z rzeczywistymi wagami.
