// Authored synthetic browser snapshots. No pages were fetched and no real users are represented.
// Tuples: title, extracted description, language(s), challenge tags, optional alternative folder key.
import { mkdir, writeFile } from 'node:fs/promises';

const users = [
  {
    id: 'engineer',
    habit: 'Project-specific material goes under Atlas. Reusable frontend references go under Ref. Learning is separate from production work; shopping is separated by product type.',
    folders: [
      ['atlas', 'Work/Atlas', 'General Atlas project planning and decisions spanning several teams; specialist implementation pages belong in the relevant child folder.', ['Atlas release milestones and team contacts', 'Atlas discovery notes: scope and stakeholders']],
      ['web', 'Work/Atlas/Web', 'Atlas frontend implementation, browser UI and accessibility. Generic reusable web references go in Work/Ref/Web.', ['Atlas account settings screen requirements', 'Makiety panelu Atlas: widok mobilny', 'Atlas frontend error boundary plan']],
      ['api', 'Work/Atlas/API', 'Atlas backend endpoints, authentication contracts and database changes; infrastructure operations go in Ops.', ['Atlas customer endpoint contract', 'Migracje tabel klientów w projekcie Atlas', 'Atlas service token validation notes']],
      ['ops', 'Work/Atlas/Ops', 'Deployments, incidents, monitoring and infrastructure for Atlas, including operational security and availability.', ['Atlas deployment rollback runbook', 'Alerty dostępności usługi Atlas', 'Atlas container resource limits']],
      ['ref', 'Work/Ref/Web', 'Reusable browser, CSS and accessibility documentation without Atlas-specific implementation work.', ['Intrinsic image sizing in CSS', 'Accessible live region reference', 'Przeglądarkowe API schowka: dokumentacja', 'Responsive typography without breakpoints']],
      ['nlp', 'Learn/ML/NLP', 'Language models, text embeddings and retrieval experiments for personal learning, rather than Atlas production incidents.', ['Ćwiczenia z klasyfikacji tekstu', 'Sentence representation evaluation notes', 'Tokenization across writing systems']],
      ['gear', 'Life/Bike/Gear', 'Bicycle equipment purchases, fit and mechanical maintenance.', ['Dobór szerokości opon do obręczy', 'Bike torque wrench buying guide']],
      ['trips', 'Life/Bike/Trips', 'Cycling routes, GPX tracks and practical ride planning, rather than equipment shopping.', ['Weekend gravel loop through the forest']],
      ['books', 'Life/Buy/Books', 'Books and ebooks to buy or read, including technical books; interactive tutorials go in learning or references.', ['Popular science hardbacks to order', 'Reportaż o historii internetu: wydanie papierowe']],
      ['tech', 'Life/Buy/Tech', 'Personal electronics and computer accessory purchases, rather than cycling equipment or work implementation.', ['USB-C hub product comparison', 'Klawiatura mechaniczna: oferty i wymiary']]
    ],
    rows: {
      atlas: [
        ['Atlas — scope v3 / do piątku', 'Zakres wydania, otwarte decyzje biznesowe i właściciele zadań zespołów.', 'pl', 'shorthand'],
        ['QBR notes, WIP', 'Atlas quarterly review: adoption goals, support workload and decisions for next quarter.', 'en', 'abbreviation'],
        ['Atlas: Übergabe an das neue Team', 'Projektübersicht, Ansprechpartner und offene Produktentscheidungen für die Übergabe.', 'de', 'cross-language'],
        ['Do sprawdzenia', 'Atlas: ustalenia dotyczące nowej roli administratora; zmiany obejmą aplikację i serwer.', 'pl', 'vague-title,overlap', 'api'],
        ['Atlas launch checklist | Sign in', 'Owner approvals, documentation readiness and rollout communications. Cookies. Log in to your workspace.', 'en', 'noisy-metadata']
      ],
      web: [
        ['a11y: err msg + focus po submit', 'Atlas signup: screen reader announcement and moving focus to the invalid field.', 'pl,en', 'abbreviation,mixed-language'],
        ['FE: CLS on PDP, repro inside', 'Atlas product detail cards shift when thumbnails arrive; screenshots and frontend acceptance criteria.', 'en', 'abbreviation'],
        ['Atlas — bouton désactivé sur mobile', 'Le formulaire du portail Atlas ne permet plus de valider sur petit écran; étapes de reproduction.', 'fr', 'cross-language'],
        ['Specs', 'Atlas settings page: empty state, keyboard order and inline validation.', 'en', 'vague-title'],
        ['SSO callback — spinner forever', 'Atlas browser callback screen stays loading after a successful response. Frontend reproduction attached.', 'en', 'overlap,abbreviation', 'api']
      ],
      api: [
        ['BE: 409 przy retry / idem key', 'Atlas orders endpoint rejects repeated requests; proposal for server-side idempotency storage.', 'pl,en', 'abbreviation,mixed-language'],
        ['Atlas API — AuthZ vs AuthN', 'Contract for validating identity and checking permissions on customer endpoints.', 'en', 'abbreviation'],
        ['Atlas: миграція customer_id', 'Зміна схеми PostgreSQL для клієнтського API та сумісність старих запитів.', 'uk', 'cross-language'],
        ['Notatki', 'Atlas: wygaszanie refresh tokenów w serwisie uwierzytelniania.', 'pl', 'vague-title'],
        ['JWT rotate — rollout plan', 'Atlas endpoint contract for signing-key rotation and backward compatibility.', 'en', 'overlap,abbreviation', 'ops']
      ],
      ops: [
        ['P1 / EU-west / 5xx', 'Atlas incident timeline: failed deployment, error-rate graph and rollback procedure.', 'en', 'abbreviation'],
        ['k8s OOMKilled — co podnieść?', 'Atlas worker pod exceeds its memory limit. Dashboard graphs and deployment resource settings.', 'pl,en', 'abbreviation,mixed-language'],
        ['Atlas — sauvegarde et restauration', 'Procédure de restauration de la base après un incident, avec responsabilités de garde.', 'fr', 'cross-language'],
        ['SLO burn-rate cheatsheet (Atlas)', 'On-call alert windows for Atlas availability, with Prometheus expressions.', 'en', 'abbreviation'],
        ['DB pool exhausted, re: deploy', 'Atlas incident notes: connection saturation, temporary mitigation and service restart order.', 'en', 'overlap', 'api']
      ],
      ref: [
        ['MDN-ish notes: IO vs RO', 'Generic browser reference comparing IntersectionObserver and ResizeObserver with reusable examples.', 'en', 'abbreviation'],
        ['focus trap bez liba', 'Uniwersalny przykład obsługi klawiatury w oknie dialogowym, niezwiązany z konkretnym projektem.', 'pl', 'shorthand'],
        ['CSS: overflow bei langen Wörtern', 'Allgemeine Beispiele für Zeilenumbrüche und lange Wörter in schmalen Karten.', 'de', 'cross-language'],
        ['ARIA APG: combobox', '', 'en', 'abbreviation,missing-metadata'],
        ['How Atlas fixed its tabs', 'A public technical write-up with reusable keyboard-navigation examples extracted from the Atlas UI work.', 'en', 'overlap', 'web']
      ],
      nlp: [
        ['RAG eval: MRR != nDCG', 'Notes from a personal experiment evaluating retrieved passages for multilingual questions.', 'en', 'abbreviation'],
        ['emb pl/en — wyniki, v2', 'Porównanie wektorów zdań po polsku i angielsku w prywatnym notatniku do nauki.', 'pl,en', 'abbreviation,mixed-language'],
        ['Retrieval sin etiquetas', 'Ejercicio sobre búsqueda semántica de textos cortos y evaluación de vecinos cercanos.', 'es', 'cross-language'],
        ['BPE vs unigram, tl;dr', 'A compact explanation of subword tokenizers and how they split inflected words.', 'en', 'abbreviation'],
        ['Atlas search POC', 'Personal notebook exploring multilingual embeddings using the Atlas search idea as an exercise.', 'en', 'overlap,abbreviation', 'api']
      ],
      gear: [
        ['szosa: klocki żyw. czy metal?', 'Porównanie klocków hamulcowych do roweru na mokre dojazdy.', 'pl', 'shorthand'],
        ['11s HG / 12s MS compatibility', 'Which bicycle freehub accepts this cassette? Compatibility table and installation dimensions.', 'en', 'abbreviation'],
        ['Tubeless: Luftverlust am Ventil', 'Reparaturhinweise für das undichte Ventil eines Fahrradreifens.', 'de', 'cross-language'],
        ['Do kupienia — 28 mm', 'Opona szosowa: szerokość obręczy, masa i cena w sklepie rowerowym.', 'pl', 'vague-title'],
        ['USB lampka na zimę', 'Przednia lampka rowerowa z ładowaniem USB-C, uchwyt na kierownicę i test wiązki.', 'pl', 'overlap', 'tech']
      ],
      trips: [
        ['sob. 70k / bez asfaltu', 'Ślad GPX pętli gravelowej, miejsca z wodą i możliwość skrócenia przejazdu.', 'pl', 'shorthand'],
        ['R1 detour, w/ train back', 'A bike route with a closed bridge bypass and return connections from the station.', 'en', 'abbreviation'],
        ['Trasa przez las — objazd', '', 'pl', 'missing-metadata'],
        ['Vélo: boucle facile près de la rivière', 'Parcours cyclable, dénivelé et points de ravitaillement pour une sortie à la journée.', 'fr', 'cross-language'],
        ['Mapy na licznik, jak wrzucić GPX?', 'Przygotowanie pliku z trasą na sobotni przejazd i import śladu do nawigacji.', 'pl', 'overlap,abbreviation', 'gear']
      ],
      books: [
        ['DDIA, 2nd ed — sample', 'Book listing with table of contents, print formats, preorder price and shipping.', 'en', 'abbreviation'],
        ['SQL. Małe kroki — ebook', 'Strona zakupu książki technicznej w formacie EPUB i PDF.', 'pl', 'overlap', 'ref'],
        ['Comprendre les réseaux — édition poche', 'Présentation du livre, avis des lecteurs et options de commande.', 'fr', 'cross-language'],
        ['to read', 'Review of a nonfiction book about software teams, with links to available editions.', 'en', 'vague-title'],
        ['Practical NLP — chapters + code', 'A publisher offers a technical book with downloadable exercises and a purchase link.', 'en', 'overlap,abbreviation', 'nlp']
      ],
      tech: [
        ['USB-C PD 100W / DP alt mode?', 'Product comparison of laptop docks, display output and charging compatibility.', 'en', 'abbreviation'],
        ['klaw. mech. 75%, ISO-PL', 'Oferta klawiatury do prywatnego komputera, układ klawiszy i dostępność.', 'pl', 'shorthand'],
        ['ANC casque — comparaison', 'Comparatif de casques audio sans fil, autonomie, prix et confort.', 'fr', 'cross-language'],
        ['Ten mniejszy', 'Monitor 24 cale: porty, regulacja wysokości i cena w sklepie.', 'pl', 'vague-title'],
        ['Garmin mount + powerbank bundle', 'Shopping page for a general-purpose USB power bank bundled with a bike computer accessory.', 'en', 'overlap', 'gear']
      ]
    },
    extra: [
      ['web', 'atlas moblie nav fix', 'Repro: menu in Atlas overlaps the account button on a narrow screen.', 'en', 'typo'],
      ['api', 'ETag / If-None-Match for Atlas', 'Endpoint response contract and conditional request examples for the Atlas service.', 'en', 'abbreviation'],
      ['ref', 'inert vs aria-hidden', 'Reusable guidance about disabling background UI while a dialog is open.', 'en', 'abbreviation'],
      ['books', 'Rust od podstaw — druk', 'Książka, oprawa miękka, ISBN i formularz zamówienia.', 'pl', 'overlap', 'ref'],
      ['trips', 'pętla 40km, PKP na koniec', 'Rowerowy ślad trasy ze stacją kolejową przy końcu przejazdu.', 'pl', 'abbreviation']
    ],
    outside: [
      ['Wniosek o odpis aktu urodzenia', 'Instrukcja urzędowa dotycząca uzyskania dokumentu stanu cywilnego.', 'pl'],
      ['Lease renewal appointment', 'A landlord portal showing appointment options for renewing a residential lease.', 'en'],
      ['Bez tytułu', '', 'und']
    ]
  },
  {
    id: 'household',
    habit: 'Renovation shopping is filed by room. Berlin-specific travel is separate from unplanned trip ideas. School administration and health are separate from recipes and books.',
    folders: [
      ['kitchen', 'Dom/Remont/Kuchnia', 'Kitchen renovation purchases, measurements and installation instructions, including kitchen appliances.', ['Wymiary wnęki na piekarnik', 'Kitchen worktop joint planning', 'Dobór prowadnic do szuflad kuchennych']],
      ['bath', 'Dom/Remont/Łazienka', 'Bathroom renovation, plumbing fixtures and installation details, separate from kitchen fixtures.', ['Brodzik i odpływ: pomiary', 'Bathroom tile waterproofing layers']],
      ['bills', 'Dom/Rachunki', 'Household electricity, water, heating and internet bills, meter readings and tariffs.', ['Odczyt licznika energii online', 'Water utility payment schedule', 'Porównanie abonamentów internetu domowego']],
      ['school', 'Rodzina/Szkoła', 'School notices, parent forms, homework and pupil activities; medical care goes under health.', ['Zebranie rodziców i dziennik elektroniczny', 'Printable spelling practice for primary school', 'Formularz zgody na zajęcia pozalekcyjne']],
      ['health', 'Rodzina/Zdrowie', 'Family appointments, preventive health information and medical visit preparation.', ['Przygotowanie do wizyty u okulisty', 'Vaccination appointment checklist']],
      ['berlin', 'Wyjazdy/2027/Berlin', 'Practical planning for the family Berlin trip: accommodation, local transport, visits and reservations.', ['Berlin family hotel shortlist', 'Anreise nach Berlin mit der Bahn', 'Mapa atrakcji na rodzinny weekend w Berlinie']],
      ['ideas', 'Wyjazdy/Pomysły', 'Inspiration for future trips without an active destination plan; material specifically for Berlin goes in its trip folder.', ['Pomysły na jesienny weekend w górach']],
      ['clothes', 'Kupić/Ubrania', 'Clothes and shoes for the family, including school and travel clothing purchases.', ['Dziecięce buty przeciwdeszczowe: rozmiary', 'Winter jacket fit comparison']],
      ['books', 'Czytanie/Książki', 'Books and ebooks to read or buy, including travel, food and parenting books.', ['Nowości książkowe do przeczytania', 'Illustrated history book review']],
      ['food', 'Gotowanie/Obiady', 'Recipes and practical meal plans to cook at home, including family lunchbox meals.', ['Zapiekanka z kaszą i warzywami', 'Fast weeknight lentil stew', 'Plan obiadów na szkolny tydzień']]
    ],
    rows: {
      kitchen: [
        ['zmyw. 45 do zabud. — porówn.', 'Wymiary urządzeń, poziom hałasu i front meblowy do remontowanej kuchni.', 'pl', 'shorthand'],
        ['Spüle: 1 Becken, Unterschrank 60', 'Produktmaße und Einbauzeichnung für eine neue Küchenspüle.', 'de', 'abbreviation,cross-language'],
        ['AGD, lista v4', 'Piekarnik i płyta do zabudowy: pomiary wnęk kuchennych oraz podłączenie.', 'pl', 'abbreviation'],
        ['Warto sprawdzić', 'Bateria nad zlewem: zasięg wylewki dopasowany do zabudowy kuchennej.', 'pl', 'vague-title'],
        ['Zlew z wyciąganą słuchawką', 'Oferta armatury z dokumentacją montażową; nagłówek kategorii zawiera też wyposażenie łazienek.', 'pl', 'overlap,noisy-metadata', 'bath']
      ],
      bath: [
        ['WC podw., stelaż 112 — karta tech.', 'Rysunek montażowy miski i stelaża do remontu łazienki.', 'pl', 'shorthand'],
        ['Duschrinne 80 cm, bodengleich', 'Einbauhöhe und Abdichtung für die Dusche im renovierten Badezimmer.', 'de', 'cross-language'],
        ['PP czy PEX pod prysznic?', 'Porównanie rur do zasilania baterii prysznicowej i sposobu ich łączenia.', 'pl', 'abbreviation'],
        ['Montaż — PDF', 'Umywalka nablatowa: sposób mocowania i uszczelnienie przy ścianie łazienki.', 'pl', 'vague-title'],
        ['Silikon sanitarny do mokrych stref', 'Materiały uszczelniające do prysznica, z instrukcją również dla zlewozmywaków.', 'pl', 'overlap', 'kitchen']
      ],
      bills: [
        ['G11 vs G12w, czy ma sens?', 'Porównanie taryf energii na podstawie zużycia w mieszkaniu.', 'pl', 'abbreviation'],
        ['FV za prąd — korekta', 'Objaśnienie skorygowanego rachunku i terminu płatności u dostawcy energii.', 'pl', 'abbreviation'],
        ['Abschlag für Fernwärme', 'Kundeninformation zur monatlichen Vorauszahlung für die Heizung der Wohnung.', 'de', 'cross-language'],
        ['Rozliczenie', 'Odczyt wodomierza, zużycie i niedopłata za ostatni okres.', 'pl', 'vague-title'],
        ['Wymiana AGD a zużycie kWh', 'Kalkulator kosztu energii urządzeń używany do porównania przyszłych rachunków domowych.', 'pl', 'overlap,abbreviation', 'kitchen']
      ],
      school: [
        ['WF — zwoln. jednorazowe', 'Wzór wiadomości do wychowawcy w sprawie nieobecności dziecka na zajęciach.', 'pl', 'abbreviation'],
        ['RR, składka i terminy', 'Informacja rady rodziców o dobrowolnej wpłacie oraz harmonogramie spotkań.', 'pl', 'abbreviation'],
        ['Wyjście do teatru — zg.', 'Formularz zgody opiekuna na szkolne wyjście i godzina powrotu klasy.', 'pl', 'shorthand'],
        ['Homework: les fractions', 'Worksheet supplied by the teacher for practising fractions at home.', 'en,fr', 'mixed-language'],
        ['Alergia w klasie — formularz szkoły', 'Informacja dla wychowawcy o ograniczeniach żywieniowych ucznia i zasadach opieki.', 'pl', 'overlap', 'health']
      ],
      health: [
        ['POZ — teleporada, zapisy', 'Panel przychodni umożliwiający umówienie konsultacji lekarza rodzinnego.', 'pl', 'abbreviation'],
        ['USG j. brzusznej — przygot.', 'Informacja placówki o przygotowaniu do umówionego badania; bez danych pacjenta.', 'pl', 'shorthand'],
        ['Ordonnance: renouvellement', 'Informations du cabinet pour demander un rendez-vous de renouvellement de prescription.', 'fr', 'cross-language'],
        ['Для батьків: перевірка зору', 'Інформація клініки про запис дитини на перевірку зору.', 'uk', 'cross-language'],
        ['Dieta przy niedoborach — konsultacja', 'Poradnia wyjaśnia zakres wizyty dietetycznej i potrzebne wyniki badań.', 'pl', 'overlap', 'food']
      ],
      berlin: [
        ['BER -> Hbf, ABC czy AB?', 'Notatka do wyjazdu do Berlina: przejazd z lotniska do hotelu i wybór strefy biletu.', 'pl,de', 'abbreviation,mixed-language'],
        ['Fewo f. 2 Erw. + 1 Kind', 'Ferienwohnung in Berlin, Schlafplätze und Anreiseinformationen für den Familienaufenthalt.', 'de', 'shorthand'],
        ['Berlin: musée avec enfants', 'Présentation des activités familiales et du système de réservation du musée berlinois.', 'fr', 'cross-language'],
        ['Na ten weekend', 'Hotel w Berlinie: pokój rodzinny, dojazd z dworca i zasady przyjazdu.', 'pl', 'vague-title'],
        ['Berlin z rowerem', 'Pomysły na spokojne przejazdy w czasie zaplanowanego rodzinnego pobytu w mieście.', 'pl', 'overlap', 'ideas']
      ],
      ideas: [
        ['city break bez auta / 2-3 dni', 'Zestaw propozycji przyszłych weekendów w kilku miastach Europy.', 'pl,en', 'shorthand,mixed-language'],
        ['Kurztrip mit Kindern: Seen und Wald', 'Ideen für spätere Familienausflüge, mit verschiedenen Regionen zur Auswahl.', 'de', 'cross-language'],
        ['Escapadas de otoño en tren', 'Inspiración para futuros viajes cortos sin destino reservado.', 'es', 'cross-language'],
        ['Kiedyś tam', 'Reportaż podróżniczy z Alp, zapisany jako inspiracja na nieustalony jeszcze urlop.', 'pl', 'vague-title'],
        ['Berlin czy Drezno na kolejny raz?', 'Ogólne porównanie miast do przyszłych wyjazdów, oddzielne od planu aktualnej podróży.', 'pl', 'overlap', 'berlin']
      ],
      clothes: [
        ['buty p/deszcz. dla młodego', 'Produkt w sklepie obuwniczym: rozmiary dziecięce, materiał i cena.', 'pl', 'shorthand'],
        ['Übergangsjacke Gr. 128', 'Kinderjacke im Onlineshop, Größentabelle und Materialangaben.', 'de', 'abbreviation,cross-language'],
        ['wf: spodenki granat, 140', 'Oferta zakupu krótkich spodenek na zajęcia szkolne, wybór rozmiaru i cena.', 'pl', 'overlap,abbreviation', 'school'],
        ['Ten model', 'Lekka kurtka przeciwdeszczowa do kupienia przed podróżą, tabela wymiarów i sklepowy koszyk.', 'pl', 'vague-title'],
        ['Buty na Berlin — przecena', 'Oferta obuwia do chodzenia po mieście; dostępność rozmiaru i zamówienie.', 'pl', 'overlap', 'berlin']
      ],
      books: [
        ['Książka kuch. — wyd. kieszonkowe', 'Oferta zakupu książki z przepisami, ISBN i wybór wydania.', 'pl', 'overlap,shorthand', 'food'],
        ['Berlin mit Kindern — Reiseführer', 'Buchvorstellung, gedruckte Ausgabe und Bestellmöglichkeit beim Verlag.', 'de', 'overlap,cross-language', 'berlin'],
        ['Le cerveau des ados — extrait', 'Extrait du livre, présentation de l’auteur et formats disponibles à l’achat.', 'fr', 'cross-language'],
        ['Do przeczytania', 'Recenzja reportażu o historii miast, z informacją o wydaniu papierowym.', 'pl', 'vague-title'],
        ['Szkoła bez stresu — ebook', 'Strona sprzedaży książki dla rodziców z fragmentem do pobrania.', 'pl', 'overlap', 'school']
      ],
      food: [
        ['obiad 15 min, bez nab.', 'Przepis na makaron z warzywami bez produktów mlecznych, składniki i przygotowanie.', 'pl', 'shorthand'],
        ['meal prep na pn-śr', 'Gotowanie trzech porcji obiadowych z listą składników i czasem pieczenia.', 'pl,en', 'abbreviation,mixed-language'],
        ['Soupe de lentilles, sans lait', 'Ingrédients et étapes de préparation d’un repas familial.', 'fr', 'cross-language'],
        ['Zapisany przepis', 'Placki warzywne: proporcje składników, smażenie i propozycja podania.', 'pl', 'vague-title'],
        ['Lunchbox do szkoły, bez orzechów', 'Pięć przepisów na posiłki do pudełka, wraz z instrukcjami przygotowania.', 'pl', 'overlap', 'school']
      ]
    },
    extra: [
      ['school', 'harmonogrm konsult. z wych.', 'Godziny spotkań z nauczycielem i zapisy przez dziennik elektroniczny.', 'pl', 'typo,shorthand'],
      ['bills', 'eBOK: zmiana nr rach.', 'Dostawca wody informuje o numerze konta do opłacania faktur.', 'pl', 'abbreviation'],
      ['bath', 'IP44, 60 cm nad lustrem', 'Lampa do lustra w łazience: strefa montażu, stopień ochrony i wymiary.', 'pl', 'abbreviation'],
      ['berlin', 'Kinderwagen im ÖPNV', 'Praktische Hinweise für Fahrten mit einem Kinderwagen in Berlin.', 'de', 'abbreviation'],
      ['health', 'Do sprawdzenia', 'Informacja przychodni o zapisach na konsultację alergologiczną dziecka.', 'pl', 'vague-title']
    ],
    outside: [
      ['Kubernetes ingress annotations', 'Reference documentation for routing traffic to containerized applications.', 'en'],
      ['Live techno set — warehouse session', 'A two-hour recording of an electronic music performance.', 'en'],
      ['Bez tytułu', '', 'und']
    ]
  },
  {
    id: 'designer',
    habit: 'Client identity takes priority over design topic. Generic references are separate. Tax administration is filed by jurisdiction, not by the page language. Camera shopping and photo locations are separate.',
    folders: [
      ['obrand', 'Clients/Orbit/Brand', 'Orbit client identity: logos, colors, packaging and print collateral. Website behavior belongs in Orbit/Web.', ['Orbit brand palette options', 'Orbit logo delivery specifications', 'Orbit stationery mockup review']],
      ['oweb', 'Clients/Orbit/Web', 'Orbit website layouts, responsive behavior, accessibility and implementation handoff.', ['Orbit landing page content map', 'Orbit site form acceptance notes']],
      ['mbrand', 'Clients/Maple/Brand', 'Maple client identity: logo, palette, packaging and print materials, separate from Orbit and website behavior.', ['Maple packaging label dimensions', 'Maple logo sign-off notes', 'Maple print color proof']],
      ['mweb', 'Clients/Maple/Web', 'Maple ecommerce site navigation, product pages, checkout and implementation handoff.', ['Maple basket interaction prototype', 'Maple product gallery mobile layout', 'Maple shipping selector error states']],
      ['type', 'Studio/Ref/Type', 'Reusable typeface, typography and lettering references not committed to a specific client.', ['Variable font specimen collection', 'Czytelność długich akapitów: przykłady']],
      ['ux', 'Studio/Ref/UX', 'Reusable interaction design and accessibility research, independent of a client deliverable.', ['Keyboard-friendly form pattern library', 'Research on checkout abandonment', 'Przykłady dostępnych komunikatów błędu']],
      ['pl', 'Firma/Admin/PL', 'Polish freelance invoices, contracts, taxes and administration, regardless of the language of the source.', ['Polskie faktury: pola obowiązkowe', 'Rozliczenie kosztów działalności w Polsce']],
      ['de', 'Firma/Admin/DE', 'German freelance invoicing, tax and business administration, regardless of the source language.', ['German invoice numbering checklist']],
      ['camera', 'Osobiste/Foto/Sprzęt', 'Camera and lens purchases, compatibility and maintenance, rather than photo locations.', ['Porównanie obiektywów do portretów', 'Camera sensor cleaning kit guide']],
      ['places', 'Osobiste/Foto/Plenery', 'Places and routes for personal photo walks, access notes and light conditions.', ['Photo walk along the old docks', 'Punkty widokowe na wieczorne zdjęcia']]
    ],
    rows: {
      obrand: [
        ['Orbit KV / CMYK / final-ish', 'Print key visual for the Orbit identity presentation; color proof and crop marks.', 'en', 'abbreviation'],
        ['OR: logo negatyw + sygnet', 'Eksporty znaku Orbit do druku na ciemnym papierze i specyfikacja marginesów.', 'pl', 'shorthand'],
        ['Orbit — identité, retour client', 'Commentaires du client sur le symbole et les couleurs de son identité visuelle.', 'fr', 'cross-language'],
        ['Doku', 'Orbit: brand color values for packaging and stationery, with print production notes.', 'en', 'vague-title'],
        ['Orbit tokens v2', 'Brand colors and type styles intended for both the identity guide and the website.', 'en', 'overlap', 'oweb']
      ],
      oweb: [
        ['Orbit LP: CTA above fold?', 'Website hero layout, button wording and mobile breakpoints for client review.', 'en', 'abbreviation'],
        ['Orbit a11y pass / nav', 'Keyboard order, menu announcements and focus handling on the client website.', 'en', 'abbreviation'],
        ['Orbit: Fehler im Kontaktformular', 'Website-Abnahme: Fehlermeldungen und Verhalten beim Absenden auf Mobilgeräten.', 'de', 'cross-language'],
        ['v7 poprawki', 'Orbit: układ strony kontaktu, odległości między polami i zachowanie przy błędzie serwera.', 'pl', 'vague-title'],
        ['Font weight for Orbit checkout', 'Website implementation handoff showing typography in form controls and purchase steps.', 'en', 'overlap', 'obrand']
      ],
      mbrand: [
        ['Maple — DTP, spady 3 mm', 'Plik etykiety do drukarni, profil kolorów i wymiary opakowania klienta Maple.', 'pl', 'abbreviation'],
        ['MPL brandbook / RGB+CMYK', 'Maple identity guide with color values, mark variants and stationery examples.', 'en', 'abbreviation'],
        ['Maple: étiquette, bon à tirer', 'Validation de l’étiquette imprimée et de la couleur du logo avant production.', 'fr', 'cross-language'],
        ['To zatwierdzić', 'Maple: propozycje znaku oraz wariant monochromatyczny do małej etykiety.', 'pl', 'vague-title'],
        ['Maple typography scale', 'Client type styles proposed for packaging and the upcoming ecommerce site.', 'en', 'overlap', 'mweb']
      ],
      mweb: [
        ['Maple PDP: ATC disabled OOS', 'Product-page behavior when an item is out of stock and the add-to-cart button is unavailable.', 'en', 'abbreviation'],
        ['Maple PLP — filtry na mob.', 'Zachowanie filtrów i sortowania na mobilnej liście produktów sklepu Maple.', 'pl,en', 'abbreviation,mixed-language'],
        ['Maple: pago como invitado', 'Diseño del formulario de compra sin crear cuenta en la tienda del cliente.', 'es', 'cross-language'],
        ['Do sprawdzenia', 'Maple checkout: przesunięcie pola kodu pocztowego i opis błędu płatności.', 'pl,en', 'vague-title,mixed-language'],
        ['Maple label preview on product page', 'Client website layout for viewing a product label before adding the item to the basket.', 'en', 'overlap', 'mbrand']
      ],
      type: [
        ['VF: opsz vs wght demo', 'Reusable type specimen explaining optical size and weight axes in variable fonts.', 'en', 'abbreviation'],
        ['kerning / tracking — ściąga', 'Ogólna notatka o odstępach między literami i czytelności nagłówków.', 'pl,en', 'mixed-language'],
        ['Schriftmischung: Serif + Sans', 'Allgemeine Beispiele für die Kombination zweier Schriftfamilien in redaktionellen Layouts.', 'de', 'cross-language'],
        ['Aa 0123', 'Typeface specimen with lowercase forms, numeral styles and licensing options.', 'en', 'vague-title'],
        ['Readable forms: font comparison', 'A general typeface comparison for small form labels and interface text.', 'en', 'overlap', 'ux']
      ],
      ux: [
        ['WCAG: 3.3.1 vs 3.3.3', 'Reusable explanation of identifying form errors and offering useful correction suggestions.', 'en', 'abbreviation'],
        ['UXR: checkout dropoff notes', 'General research summary on why customers abandon checkout; no client-specific brief.', 'en', 'abbreviation'],
        ['Jak skrócić formularz, tl;dr', 'Wzorce projektowe do biblioteki referencji: etykiety, wskazówki i walidacja.', 'pl,en', 'mixed-language'],
        ['Contraste et daltonisme', 'Référence générale sur le contraste des contrôles et les indications qui ne reposent pas uniquement sur la couleur.', 'fr', 'cross-language'],
        ['Orbit case study: reusable menu patterns', 'A public article discussing general interaction patterns through an Orbit redesign example.', 'en', 'overlap', 'oweb']
      ],
      pl: [
        ['FV / korekta / NIP, check', 'Notatka biura księgowego o poprawianiu polskiej faktury za usługę projektową.', 'pl', 'abbreviation'],
        ['Polnische Umsatzsteuer für Freelancer', 'Überblick über Rechnungen und Steuerverwaltung für eine in Polen registrierte Tätigkeit.', 'de', 'cross-language,jurisdiction'],
        ['B2B: um. ramowa + zał.', 'Wzór umowy na usługi projektowe dla działalności prowadzonej w Polsce.', 'pl', 'shorthand'],
        ['VAT UE — rejestracja', 'Informacja administracyjna dla przedsiębiorcy z polskim numerem identyfikacyjnym.', 'pl', 'abbreviation,jurisdiction'],
        ['Orbit — termin płatności FV', 'Administracyjna korespondencja o polskiej fakturze za projekt, bez materiałów projektowych.', 'pl', 'overlap,abbreviation', 'obrand']
      ],
      de: [
        ['USt / Kleinunt. — Merkblatt', 'Hinweise zur Rechnungsstellung für eine in Deutschland angemeldete freiberufliche Tätigkeit.', 'de', 'abbreviation'],
        ['Niemcy: nr Steuernr. na FV?', 'Omówienie danych na fakturze wystawianej w ramach działalności zarejestrowanej w Niemczech.', 'pl,de', 'abbreviation,mixed-language,jurisdiction'],
        ['ELSTER — Belege sortieren', 'Checkliste zur Ablage von Ausgabenbelegen für die deutsche Steuerverwaltung.', 'de', 'abbreviation'],
        ['Invoice template, DE business', 'An English-language invoice template for a freelancer registered in Germany.', 'en', 'cross-language,jurisdiction'],
        ['Maple Rechnung — Zahlungsziel', 'Buchhaltungsnotiz zu einer Rechnung aus der deutschen Tätigkeit für den Kunden Maple.', 'de', 'overlap', 'mbrand']
      ],
      camera: [
        ['RF vs EF + adapter, AF?', 'Lens mount compatibility and autofocus limitations for a camera equipment purchase.', 'en', 'abbreviation'],
        ['szkło 35/1.8 — używka', 'Oferta używanego obiektywu fotograficznego, stan soczewek i mocowanie.', 'pl', 'shorthand'],
        ['Batteriegriff gebraucht, passt?', 'Kompatibilität eines gebrauchten Batteriegriffs mit dem vorhandenen Kameragehäuse.', 'de', 'cross-language'],
        ['Ten drugi', 'Aparat bezlusterkowy: porównanie masy, wizjera i ceny dwóch modeli.', 'pl', 'vague-title'],
        ['Lightweight tripod for city walks', 'A tripod product comparison with folded dimensions, load capacity and purchase links.', 'en', 'overlap', 'places']
      ],
      places: [
        ['wsch. słońca / most / parking', 'Miejsce na poranne zdjęcia, dojście piesze i notatka o dozwolonym postoju.', 'pl', 'shorthand'],
        ['Golden hr, west quay', 'Photo location notes with viewing direction, public access and evening light.', 'en', 'abbreviation'],
        ['Spots photo près du canal', 'Promenade photographique, points de vue et accès à pied le long du canal.', 'fr', 'cross-language'],
        ['Miejscówka', 'Stare magazyny nad rzeką: trasa dojścia i plan punktów do fotografowania.', 'pl', 'vague-title'],
        ['Street portraits: where to practise', 'A map of public places for a personal portrait photo walk, with access notes.', 'en', 'overlap', 'camera']
      ]
    },
    extra: [
      ['mweb', 'Mapel chekout err states', 'Maple client handoff: validation and error messages on the payment page.', 'en', 'typo'],
      ['obrand', 'Orbit — Друк етикеток', 'Макет етикетки клієнта Orbit, кольори та поля для друкарні.', 'uk', 'cross-language'],
      ['de', 'USt-IdNr. vs Steuernummer', 'General administration note for the German freelance activity, explaining identifiers on invoices.', 'de,en', 'abbreviation,mixed-language'],
      ['type', 'lic. desktop/webfont?', 'A reusable font licensing reference explaining desktop and web embedding terms.', 'en', 'shorthand'],
      ['camera', 'PD strap / quick release', 'A camera strap product page with attachment compatibility, dimensions and purchase options.', 'en', 'abbreviation']
    ],
    outside: [
      ['Mieszkanie: protokół zdawczo-odbiorczy', 'Prywatna umowa najmu i lista stanu wyposażenia lokalu.', 'pl'],
      ['Sourdough starter, day 3', 'A home bread recipe with feeding quantities and kitchen instructions.', 'en'],
      ['Bez tytułu', '', 'und']
    ]
  }
];

const collections = [], index = [], evaluation = [];
const descriptions = { provenance: { manual: 'Authored synthetic folder scopes defined with the index before evaluation; no generated/domain variants.' }, folders: {} };
for (const user of users) {
  const byKey = new Map(user.folders.map(([key, path, description]) => [key, { path, description }]));
  const folders = user.folders.map(([, path, description]) => ({ path, description }));
  // Include structural parent nodes even where the user stores no bookmarks directly.
  const tree = new Map();
  for (const folder of folders) {
    const parts = folder.path.split('/');
    for (let depth = 1; depth <= parts.length; depth++) {
      const path = parts.slice(0, depth).join('/');
      tree.set(path, { path, parentPath: depth === 1 ? null : parts.slice(0, depth - 1).join('/'),
        selectable: folders.some(folder => folder.path === path) });
    }
  }
  collections.push({ id: user.id, synthetic: true, habit: user.habit, folders, folderTree: [...tree.values()] });
  for (const [key, path,, titles] of user.folders) {
    descriptions.folders[`${user.id}/${path}`] = { manual: byKey.get(key).description };
    titles.forEach((title, i) => index.push({ id: `hard-${user.id}-index-${key}-${i + 1}`, collectionId: user.id,
      synthetic: true, folder: path, title, description: '', headings: [],
      url: `https://${user.id}.example/saved/${key}/${i + 1}` }));
  }
  const add = (key, [title, description, language, tags = '', alternative]) => {
    const id = `hard-${user.id}-${String(evaluation.filter(row => row.collectionId === user.id).length + 1).padStart(2, '0')}`;
    const folder = key === null ? null : byKey.get(key);
    evaluation.push({
      id, collectionId: user.id, synthetic: true,
      provenance: 'Authored synthetic browser bookmark; fictional URL and extracted metadata, not a real saved page.',
      title, description, headings: !description ? [] : tags.includes('noisy-metadata') ? ['Account', 'Cookie preferences', 'Newsletter'] : [],
      titleSource: /shorthand|vague-title|typo/.test(tags) ? 'user-edited' : 'page',
      url: `https://${user.id}.example/new/${id}`,
      languages: language.split(','),
      expectedFolder: folder?.path ?? null,
      explanation: folder ? `Use ${folder.path}: ${folder.description}`
        : language === 'und' ? 'No usable page content supports a folder choice; the bookmark needs review.'
          : 'This user has no suitable folder for the purpose of this page.',
      ambiguous: Boolean(alternative) || language === 'und',
      reviewReason: alternative ? 'A neighbouring scope is plausible; primary label follows the stated user filing policy.'
        : language === 'und' ? 'Insufficient metadata to infer the page purpose.' : null,
      acceptableAlternatives: alternative ? [byKey.get(alternative).path] : [],
      tags: ['hard-synthetic', ...tags.split(',').filter(Boolean), ...(key === null ? ['no-suitable-folder'] : [])],
      duplicateGroup: id
    });
  };
  for (const [key, rows] of Object.entries(user.rows)) for (const row of rows) add(key, row);
  for (const [key, ...row] of user.extra) add(key, row);
  for (const row of user.outside) add(null, row);
  // Two repeat saves per user, confined to evaluation. Tracking URLs should canonicalize together.
  const originalRows = evaluation.filter(row => row.collectionId === user.id && row.expectedFolder !== null);
  for (const source of [originalRows[0], originalRows[17]]) {
    const id = `hard-${user.id}-${String(evaluation.filter(row => row.collectionId === user.id).length + 1).padStart(2, '0')}`;
    evaluation.push({ ...source, id, url: `${source.url}?utm_source=second-save#saved`,
      headings: [...source.headings], tags: [...source.tags, 'duplicate'] });
  }
}

await mkdir('datasets/hard', { recursive: true });
for (const [name, data] of Object.entries({ collections, index, evaluation, descriptions })) {
  await writeFile(`datasets/hard/${name}.json`, JSON.stringify(data, null, 2) + '\n');
}
console.log(`HARD SYNTHETIC: ${collections.length} users, ${index.length} indexed examples, ${evaluation.length} evaluation cases.`);
