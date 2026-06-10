# 🎾 Padel Pro Tracker

Padel Pro Tracker er en lynrask, mobilvennlig web-applikasjon (PWA) designet for å holde styr på poeng, kamper og tabeller i uformelle padel-turneringer. Appen støtter både dynamisk partnerbytte (Americano) og tradisjonell spillestil.

Appen er bygget for å fungere **100 % offline**, slik at den kan brukes i padelhaller med dårlig eller manglende mobildekning.

## ✨ Funksjoner

*   **To Spillemoduser:**
    *   **Americano:** Hvert enkelt poeng teller. Tabellen sorteres basert på poengdifferanse.
    *   **Vanlige Sett:** Det spilles tradisjonelle sett (f.eks. til 6 games). Tabellen prioriterer antall seire, med gamedifferanse som "tiebreaker".
*   **Dynamisk Skalering:** Støtter alt fra 2 til 8 spillere.
    *   **Singel (1v1):** Aktiveres automatisk hvis det registreres 2 eller 3 spillere.
    *   **Lag (2v2):** Aktiveres automatisk ved 4 eller flere spillere, og genererer en "Round Robin"-rotasjon der man roterer partnere.
*   **Feiltolerant:** Inkluderer en dedikert "Angre/Gå tilbake"-knapp på resultatskjermen, slik at en turnering ikke slettes ved et uhell. Tidligere kamper kan også redigeres eller slettes direkte fra historikken.
*   **Fungerer Offline (PWA):** Kan installeres direkte på hjemskjermen på iOS og Android. Ingen eksterne avhengigheter (CDN-lenker) betyr at appen laster umiddelbart uavhengig av nettforbindelse.
*   **Persistent Lagring:** Bruker `localStorage` for å lagre nåværende turnering, slik at du ikke mister data selv om du lukker appen eller oppdaterer siden midt i en match.

## 🛠️ Teknologier

Appen er minimalistisk bygget for maksimal ytelse og uavhengighet:
*   **HTML5 & CSS3:** Skreddersydd mørkt design (Dark Mode) optimert for mobilskjermer.
*   **JavaScript (Vanilla):** Ren, moderne JavaScript som driver spillogikken og tabellberegningene uten tunge eksterne rammeverk.
*   **Web App Manifest:** Gjør nettsiden kjørbar som en frittstående, installerbar applikasjon på smarttelefoner.

## 🚀 Slik installerer du den på telefonen

Siden dette er en Progressive Web App (PWA), trenger du ikke gå via Google Play eller App Store:

1.  Åpne nettadressen i nettleseren på telefonen din (f.eks. via Safari på iPhone eller Chrome på Android).
2.  **På iPhone (Safari):** Trykk på *Del-knappen* (firkant med pil opp) og velg **Legg til på Hjem-skjermen**.
3.  **På Android (Chrome):** Trykk på de tre prikkene øverst til høyre og velg **Installer app** eller **Legg til på startskjerm**.
4.  Appen ligger nå på hjemskjermen din med eget ikon og åpnes i fullskjerm uten nettleserfelt.

## 💻 Lokal utvikling og distribusjon

Prosjektet er rigget for kontinuerlig utrulling (CI/CD) via Vercel. 

For å gjøre endringer lokalt:
1. Klone dette prosjektet til din PC.
2. Gjør endringer i `index.html` eller `manifest.json`.
3. Push endringene til GitHub:
```bash
   git add .
   git commit -m "Beskrivelse av endringen din"
   git push origin main
