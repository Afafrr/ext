// All content below is authored synthetic data, not scraped pages or real users.
// Keep this source editable; generated JSON is committed for easy review.
import { mkdir, writeFile } from 'node:fs/promises';
const specs = [
  {
    id: 'developer', habit: 'Topic-based nested folders. Courses go under Learn; reference and production debugging go under Work.',
    folders: [
      ['Work / Frontend', 'Production browser UI, CSS, accessibility and React reference.', 'CSS grid intrinsic sizing|Debugging React hydration mismatches'],
      ['Work / Backend', 'Server APIs, SQL databases and service operations.', 'PostgreSQL query plan reference|Node server graceful shutdown'],
      ['Learn / Courses', 'Structured courses and exercises, including programming courses.', 'Full stack curriculum with weekly assignments|Ćwiczenia z algorytmów dla początkujących'],
      ['Learn / AI', 'Embedding models, machine learning papers and experiments.', 'Evaluating multilingual sentence embeddings|Wprowadzenie do wektorowych baz danych'],
      ['Personal / Cooking', 'Recipes and meal preparation.', 'Pieczona dynia z ciecierzycą|How to make sourdough starter'],
      ['Personal / Cycling', 'Bike maintenance and weekend rides.', 'Regulacja przerzutki tylnej']
    ],
    rows: [
      [0,'Container queries in a real component','Adapt a card layout to its parent width, with CSS examples.'],
      [0,'Dlaczego przycisk nie ma fokusu?','Diagnostyka kolejności tabulacji i focus-visible w formularzu.'],
      [0,'Notes','Fix a React effect that subscribes twice after mounting.','vague-title'],
      [1,'Slow endpoint after a release','An investigation into missing indexes and SQL joins.'],
      [1,'Kolejka zadań w Node','Retry i idempotencja przy przetwarzaniu płatności w API.'],
      [1,'Reference: HTTP cache validators','ETag and conditional requests for a REST service.'],
      [2,'React from zero: 8-week course','Lessons, homework and mentor feedback for beginning developers.'],
      [2,'Kurs SQL z zadaniami','Dwanaście lekcji i sprawdzane ćwiczenia z baz danych.'],
      [3,'Quantization and nearest neighbours','Measuring retrieval quality after quantizing embeddings.'],
      [3,'Czy embedding rozumie polski?','Porównanie reprezentacji zdań w dwóch językach.'],
      [4,'Zupa z pieczonych pomidorów','Prosty przepis na kolację z bazylią i grzankami.'],
      [4,'Weeknight tofu tray bake','A recipe with vegetables and a sesame dressing.'],
      [5,'Tubeless tyre losing air overnight','Find a leaking valve and refresh bicycle sealant.','sparse-folder'],
      [5,'Pętla rowerowa nad Wisłą','Spokojna trasa na sobotni przejazd z mapą.','sparse-folder'],
      [0,'Read this later','Accessible names for icon-only buttons in a browser toolbar.','vague-title'],
      [1,'Strona główna','Konfiguracja puli połączeń PostgreSQL w aplikacji Node.','vague-title'],
      [3,'Attention in plain language','Visual explanation of transformer attention and token vectors.'],
      [2,'Build your first classifier: guided lab','A sequential course with quizzes and graded exercises.','overlap',true,3],
      [0,'AI autocomplete for a web form','Implement keyboard navigation and screen-reader announcements.','overlap',true,3],
      [1,'Deploy a vector search endpoint','API pagination, timeout handling and production database indexes.','overlap',true,3],
      [4,'Przepis dnia | Akceptuj cookies','Pierogi z soczewicą. Newsletter, reklama, polecane produkty.','noisy-metadata'],
      [0,'Sticky header jumps on mobile','Subscribe now. CSS viewport units and browser address bar resizing.','noisy-metadata'],
      [3,'Model card: sentence encoder','', 'missing-metadata'],
      [4,'Chleb bez wyrabiania','Mąka, woda, drożdże i długi czas wyrastania.'],
      [4,'Chleb bez wyrabiania','Mąka, woda, drożdże i długi czas wyrastania.','duplicate'],
      [null,'Finding a divorce mediator','How to arrange family mediation and prepare documents.'],
      [null,'Bilety do opery na grudzień','Repertuar sceny operowej i wybór miejsc.'],
      [5,'Brake pads for wet commutes','Comparison of disc brake compounds for a commuter bicycle.'],
      [2,'Python exercises, chapter 4','Loops and functions with automated feedback for students.'],
      [null,'Untitled','', 'vague-title',true]
    ]
  },
  {
    id: 'family', habit: 'Polish household. Shopping links are stored by project, not by shop; recipes are separate from health.',
    folders: [
      ['Dom / Remont', 'Renovating the kitchen and bathroom; project purchases and instructions.', 'Jak dobrać fugę do płytek|Kitchen cabinet hinge adjustment'],
      ['Dom / Obiady', 'Family recipes and weekly meal plans.', 'Jadłospis na pięć dni|Quick vegetable curry recipe'],
      ['Dzieci / Szkoła', 'School administration, homework and educational activities.', 'Plan lekcji klasy czwartej|Printable multiplication games'],
      ['Wyjazdy / Polska', 'Domestic holidays and family weekend trips.', 'Weekend w Kazimierzu z dziećmi|Szlaki spacerowe w Beskidach'],
      ['Zdrowie', 'Appointments, preventive care and exercise guidance.', 'Jak przygotować się do badania krwi|Home stretches for desk workers'],
      ['Finanse / Rachunki', 'Household utility bills and recurring costs.', 'Jak odczytać rachunek za prąd']
    ],
    rows: [
      [0,'Szafka pod umywalkę 80 cm','Wymiary i montaż mebla do remontowanej łazienki.'],
      [0,'How to seal a shower tray','Replace old silicone around bathroom fittings.'],
      [1,'Makaron z brokułem w 20 minut','Przepis na obiad dla całej rodziny.'],
      [1,'Lunchbox without nuts','Five packed lunch recipes for children.','overlap',true,2],
      [2,'Zgoda na wycieczkę klasową','Formularz i termin oddania do wychowawcy.'],
      [2,'Fractions with paper strips','A printable maths activity for primary school pupils.'],
      [3,'Hel poza sezonem','Rodzinny weekend nad morzem, noclegi i spacery.'],
      [3,'Family walks near Kraków','Short routes with pushchair access and picnic stops.'],
      [4,'Wizyta kontrolna u dentysty','Jak przygotować dziecko do pierwszej wizyty.'],
      [4,'Stretching after sitting all day','Gentle mobility routine for adults.'],
      [5,'Zmiana taryfy energii','Porównanie godzin rozliczeń za prąd w domu.','sparse-folder'],
      [5,'Water bill explained','Meter readings, fixed charges and payment dates.','sparse-folder'],
      [0,'To kupić','Wodoodporna farba do ścian w łazience, wydajność i kolory.','vague-title'],
      [1,'Saved page','Baked salmon with potatoes: ingredients and cooking time.','vague-title'],
      [2,'Ważne','Zapisy na świetlicę i harmonogram zebrań rodziców.','vague-title'],
      [3,'Mapa','Łatwa trasa spacerowa wokół jeziora na Mazurach.','vague-title'],
      [4,'Serwis pacjenta | Logowanie','Rezerwacja terminu szczepienia w przychodni.','noisy-metadata'],
      [0,'Bateria kuchenna - promocja!','Dostawa gratis, kup teraz. Wylewka obrotowa, przyłącze 3/8.','noisy-metadata'],
      [1,'Low-salt soup ideas','Recipes for vegetable soups with herbs instead of salt.','overlap',true,4],
      [3,'Wyjazd szkolny do Torunia: co zobaczyć','Pomysły na rodzinne zwiedzanie miasta po wycieczce.','overlap',true,2],
      [5,'Insulation and the heating bill','Estimate how much household heating costs change after insulation.','overlap',true,0],
      [2,'Dyktando: rz czy ż?','', 'missing-metadata'],
      [1,'Placki z cukinii','Lista składników i sposób smażenia.'],
      [1,'Placki z cukinii','Lista składników i sposób smażenia.','duplicate'],
      [null,'Rust lifetime annotations','Borrow checker examples for systems programmers.'],
      [null,'Winylowy album ambientowy','Recenzja nowego wydania muzycznego.'],
      [4,'Badanie wzroku dziecka','Kiedy umówić kontrolę u okulisty.'],
      [0,'Tile grout cracking at the corner','Repairing movement joints around a bathtub.'],
      [3,'Agroturystyka z placem zabaw','Nocleg na Podlasiu na długi weekend.'],
      [null,'Oferta','', 'vague-title',true]
    ]
  },
  {
    id: 'researcher', habit: 'English folder labels, bilingual reading. Papers, practical methods and teaching materials are organized by use.',
    folders: [
      ['Research / Papers', 'Empirical psychology papers, preprints and systematic reviews.', 'Sleep restriction and memory consolidation study|Przegląd badań nad uwagą selektywną'],
      ['Research / Methods', 'Statistical methods, experimental design and analysis code.', 'Mixed effects regression tutorial|Power analysis for repeated measures'],
      ['Teaching', 'Lesson plans, student assignments and classroom demonstrations.', 'Designing a first-year psychology seminar|Materiały do ćwiczeń z metodologii'],
      ['Writing / Sources', 'Citation management, academic writing and publishing.', 'Organizing a Zotero group library|How to write a clear abstract'],
      ['Outside / Hiking', 'Mountain walks, outdoor equipment and route planning.', 'Packing for a day in the Tatras|Reading contour lines on a trail map'],
      ['Outside / Coffee', 'Coffee brewing and equipment.', 'Adjusting grind size for a V60']
    ],
    rows: [
      [0,'Bilingualism and task switching: a replication','A preregistered experiment reports reaction-time effects.'],
      [0,'Sen a pamięć robocza','Wyniki badania 240 uczestników po ograniczeniu snu.'],
      [1,'When residuals are not normal','Robust regression diagnostics and worked R examples.'],
      [1,'Braki danych w ankiecie','Porównanie imputacji i analizy kompletnych przypadków.'],
      [2,'Demonstrating the Stroop effect in class','A 20-minute activity and discussion questions for students.'],
      [2,'Karta pracy: korelacja i przyczynowość','Ćwiczenia do rozdania studentom podczas zajęć.'],
      [3,'Responding to reviewer two','How to structure a response letter and revision table.'],
      [3,'Zotero: łączenie duplikatów','Porządkowanie bibliografii przed wysłaniem artykułu.'],
      [4,'An easy ridge walk in autumn','Trail conditions, elevation profile and public transport.'],
      [4,'Raki czy raczki na szlak?','Dobór sprzętu do zimowych spacerów górskich.'],
      [5,'Aeropress for one cup','Brewing ratio and steep time for a small coffee.','sparse-folder'],
      [5,'Woda do kawy przelewowej','Mineralizacja wody i smak naparu.','sparse-folder'],
      [0,'PDF download','Longitudinal study of stress and episodic memory in adults.','vague-title'],
      [1,'Useful script','R code for bootstrap confidence intervals in paired data.','vague-title'],
      [2,'Tydzień 3','Scenariusz laboratorium dla studentów: randomizacja i grupa kontrolna.','vague-title'],
      [3,'Journal home','Author guidelines: references, figure captions and submission checklist.','noisy-metadata'],
      [0,'Attention networks | Accept cookies','Open access. Sign up for alerts. A meta-analysis of 62 experiments.','noisy-metadata'],
      [1,'A simulation of low-powered experiments','Practical code to select sample size before data collection.','overlap',true,0],
      [2,'Teaching students to use Zotero','Workshop handout with activities and learning outcomes.','overlap',true,3],
      [0,'Caffeine and sustained attention','A randomized trial of caffeine and cognitive performance.','overlap',true,5],
      [4,'Fieldwork on a mountain trail','Walking route and shelter options for a weekend outdoors.','overlap',true,0],
      [3,'Checklist for transparent reporting','', 'missing-metadata'],
      [1,'Bayesian priors in a small sample','A worked example with sensitivity analysis.'],
      [1,'Bayesian priors in a small sample','A worked example with sensitivity analysis.','duplicate'],
      [null,'Kitchen cabinet clearance sale','Discounted cupboards and installation packages.'],
      [null,'Oferty pracy kierowcy autobusu','Rekrutacja i warunki zatrudnienia w komunikacji miejskiej.'],
      [4,'Schronisko otwarte zimą','Dojście piesze i nocleg na dwudniowej trasie.'],
      [0,'Does spaced practice generalize?','Experimental results on transfer across learning tasks.'],
      [3,'Choosing a journal for a manuscript','Scope, readership and submission requirements.'],
      [null,'Supplement','', 'vague-title',true]
    ]
  },
  {
    id: 'freelancer', habit: 'Project-first filing. Client work overrides general topic; business administration and reference inspiration stay separate.',
    folders: [
      ['Clients / Cafe Luna', 'Website and visual identity for a small coffee shop.', 'Cafe Luna menu typography exploration|Luna coffee shop landing page brief'],
      ['Clients / Green Shop', 'Online plant shop checkout, product photos and branding.', 'Green Shop product page requirements|Plant store ecommerce color palette'],
      ['Studio / Inspiration', 'General design examples not tied to a client project.', 'Editorial layouts with oversized type|Gallery of minimalist packaging'],
      ['Studio / Tools', 'Design software techniques and reusable workflow utilities.', 'Figma component property reference|Exporting print-ready PDFs'],
      ['Business / Admin', 'Invoices, taxes, contracts and freelance administration.', 'Szablon faktury dla klienta zagranicznego|Freelance project contract checklist'],
      ['Personal / Music', 'Albums, playlists and concert recordings.', 'Live jazz trio session in a small club']
    ],
    rows: [
      [0,'Luna menu photos for the homepage','Client assets: espresso, pastries and opening hours for the cafe site.'],
      [0,'Karta kawiarni Luna — wersja mobilna','Układ menu i przycisk rezerwacji w witrynie klienta.'],
      [1,'Green Shop checkout review','Shipping options and basket errors for the plant store project.'],
      [1,'Zdjęcia monster do Green Shop','Kadrowanie kart produktów do sklepu klienta.'],
      [2,'Twenty expressive poster layouts','A general gallery of graphic design references.'],
      [2,'Polskie szyldy z lat 60.','Zbiór inspiracji literniczych i fotografii ulicznych.'],
      [3,'Figma variables for spacing','A reusable workflow for maintaining design tokens.'],
      [3,'Jak eksportować SVG bez pustych ramek','Instrukcja obsługi narzędzia do projektowania.'],
      [4,'Invoice correction after a refund','How to record a corrected invoice in freelance bookkeeping.'],
      [4,'Umowa o projekt identyfikacji','Zakres prac, odbiór i prawa do materiałów dla klienta.'],
      [5,'A quiet piano record for late evenings','Album review and listening notes.','sparse-folder'],
      [5,'Koncert kwartetu w radiu','Nagranie jazzowe z wieczornego występu.','sparse-folder'],
      [0,'Final final v3','Luna cafe hero image options and menu link placement.','vague-title'],
      [1,'Do poprawy','Green Shop: koszyk zasłania wybór dostawy na telefonie.','vague-title'],
      [3,'Quick fix','Convert outlined text back to editable layers in a design tool.','vague-title'],
      [2,'Design archive | Join our newsletter','Collection of historic exhibition posters. Subscribe, privacy, cookies.','noisy-metadata'],
      [4,'Portal przedsiębiorcy','Logowanie. Ewidencja kosztów działalności, pobierz formularz.','noisy-metadata'],
      [0,'Coffee packaging moodboard for Luna','Selected visual references for the cafe client presentation.','overlap',true,2],
      [1,'Green Shop brand tokens in Figma','The client-specific palette and type styles for the plant store.','overlap',true,3],
      [4,'Luna invoice payment terms','Administrative payment schedule for the cafe contract.','overlap',true,0],
      [2,'Record sleeve typography archive','Graphic design inspiration drawn from jazz album covers.','overlap',true,5],
      [3,'Keyboard shortcuts for vector editing','', 'missing-metadata'],
      [2,'Museum identity collection','Logos and signage from contemporary museums.'],
      [2,'Museum identity collection','Logos and signage from contemporary museums.','duplicate'],
      [null,'Sourdough feeding schedule','How to keep a bread starter alive while away.'],
      [null,'Trening do pierwszego maratonu','Plan biegowy na szesnaście tygodni.'],
      [1,'Green Shop delivery badges','Client product page labels for shipping live plants.'],
      [0,'Luna opening hours sign','Bilingual door signage for the cafe rebrand.'],
      [4,'Tracking freelance business expenses','Separating software subscriptions from personal purchases.'],
      [null,'Link','', 'vague-title',true]
    ]
  },
  {
    id: 'collector', habit: 'Loose short labels: read stores long essays, watch stores videos, buy stores products, go stores places. Format and intent override topic.',
    folders: [
      ['read', 'Long-form articles and essays to read later, across subjects.', 'An essay on how cities remember|Historia map: długi reportaż'],
      ['watch', 'Videos, recorded talks and tutorials to watch.', 'Recorded talk: the future of public libraries|Filmowy poradnik naprawy starego radia'],
      ['buy', 'Products to consider buying; shopping pages across topics.', 'Compact binoculars product comparison|Skórzany plecak miejski — oferta'],
      ['go', 'Places, events and trips to visit or book.', 'Weekend jazz festival tickets|Ogród botaniczny: godziny otwarcia'],
      ['make / food', 'Recipes to actually cook.', 'Domowy ramen krok po kroku|Lemon cake ingredients and method'],
      ['make / repairs', 'Written DIY repair instructions.', 'Replacing a broken zipper by hand']
    ],
    rows: [
      [0,'Why cities need dark skies','A long essay about urban lighting and astronomy.'],
      [0,'Historia jednego dworca','Reportaż o zmianach w małym mieście.'],
      [1,'Watch: repairing a bicycle wheel','A 25-minute video demonstration of spoke tension.'],
      [1,'Nagranie wykładu o śnie','Film z konferencji, pełny wykład z napisami.'],
      [2,'Waterproof walking shoes — size guide','Product page with sizes, stock and a buy button.'],
      [2,'Atlas ptaków — kup książkę','Cena, dostępność i dostawa papierowego wydania.'],
      [3,'Book a night at the observatory','Visitor sessions, dates and reservation form.'],
      [3,'Muzeum neonu — bilety','Godziny otwarcia i rezerwacja wejścia na wystawę.'],
      [4,'Crispy roast chickpeas','Ingredients and oven timings for a snack.'],
      [4,'Zupa ogórkowa babci','Przepis, proporcje składników i czas gotowania.'],
      [5,'How to fix a loose chair leg','Written steps for gluing and clamping a wooden joint.','sparse-folder'],
      [5,'Wymiana uszczelki w kranie','Instrukcja tekstowa ze zdjęciami krok po kroku.','sparse-folder'],
      [0,'This is interesting','An investigative feature about disappearing night trains.','vague-title'],
      [1,'Zobacz','Wideo: spacer po dawnej fabryce, 45 minut.','vague-title'],
      [2,'Może kiedyś','Oferta sklepu: kompaktowy ekspres do kawy, cena i dostawa.','vague-title'],
      [3,'Sobota','Zapisy na lokalny spacer architektoniczny z przewodnikiem.','vague-title'],
      [0,'Magazine | Subscribe today','An essay on the social history of coffee. Cookies, newsletter, related stories.','noisy-metadata'],
      [2,'SALE - ostatnie sztuki','Zestaw narzędzi ręcznych, dodaj do koszyka, darmowa dostawa.','noisy-metadata'],
      [1,'Video recipe: dumplings from scratch','A cook demonstrates folding dumplings in a 15-minute film.','overlap',true,4],
      [0,'The repair movement is changing cities','Long-form reporting about repair cafes, not a how-to guide.','overlap',true,5],
      [3,'Coffee tasting workshop tickets','Reserve a place at a Saturday event in a local roastery.','overlap',true,4],
      [2,'Buy the complete recorded photography course','A product listing with a price and checkout for video lessons.','overlap',true,1],
      [4,'Apple crumble: ingredients and method','', 'missing-metadata'],
      [3,'Noc muzeów: program spaceru','Miejsca spotkań i bezpłatne wejściówki.'],
      [3,'Noc muzeów: program spaceru','Miejsca spotkań i bezpłatne wejściówki.','duplicate'],
      [null,'Account recovery code','One-time account recovery notice without useful article content.'],
      [null,'Panel firmowej poczty','Ekran logowania do służbowej skrzynki.'],
      [5,'Sewing a button back onto a coat','Illustrated written instructions for a small clothing repair.'],
      [0,'How a forgotten language returned','A magazine feature about language revival.'],
      [null,'Home','', 'vague-title',true]
    ]
  }
];
const collections = [], examples = [], cases = [];
for (const spec of specs) {
  collections.push({ id: spec.id, synthetic: true, habit: spec.habit, folders: spec.folders.map(([path, description]) => ({ path, description })) });
  spec.folders.forEach(([folder,, titles], f) => titles.split('|').forEach((title, i) => examples.push({
    id: `${spec.id}-index-${f}-${i}`, collectionId: spec.id, synthetic: true, folder, title,
    url: `https://${spec.id}.example/index/${f}/${i}`, description: '', headings: []
  })));
  spec.rows.forEach(([f,title,description,tag,ambiguous=false,alternative], i) => {
    const prior = cases.at(-1), duplicate = tag === 'duplicate';
    const id = `${spec.id}-${String(i+1).padStart(2,'0')}`;
    const expectedFolder = f === null ? null : spec.folders[f][0];
    const tags = [tag ?? 'ordinary', ...(f === null ? ['no-suitable-folder'] : [])];
    const reason = f === null ? (ambiguous ? 'Insufficient page information to justify any existing folder; review required.' : 'This collection has no folder matching the purpose of this bookmark.')
      : `${description || title} Matches: ${spec.folders[f][1]}`;
    cases.push({ id, collectionId: spec.id, synthetic: true, title, description,
      headings: tag === 'missing-metadata' || !description ? [] : [title, ...(tag === 'noisy-metadata' ? ['Privacy policy', 'Polecane produkty', 'Subscribe to newsletter'] : [])],
      url: duplicate ? `${prior.url}?utm_source=second-save` : `https://${spec.id}.example/page/${i+1}`,
      expectedFolder, explanation: reason, ambiguous, acceptableAlternatives: alternative === undefined ? [] : [spec.folders[alternative][0]],
      tags, duplicateGroup: duplicate ? prior.id : id });
  });
}
await mkdir('datasets/synthetic', { recursive: true });
const descriptions = {
  provenance: { manual: 'Authored synthetic folder descriptions from collections.json; generated and domain variants are not available.' },
  folders: Object.fromEntries(collections.flatMap(collection => collection.folders.map(folder =>
    [`${collection.id}/${folder.path}`, { manual: folder.description }])) )
};
for (const [name, data] of Object.entries({ collections, index: examples, evaluation: cases, descriptions })) {
  await writeFile(`datasets/synthetic/${name}.json`, JSON.stringify(data, null, 2)+'\n');
}
console.log(`Synthetic: ${collections.length} collections, ${examples.length} indexed examples, ${cases.length} evaluation cases.`);
