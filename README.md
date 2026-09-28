# AP Euro matching practice

A dependency-free, static matching site at https://euro.jainshrey.com, hosted on Vercel with source in GitHub.

## Fixed study sets

- Period 2: 34 terms
- Period 3: 53 terms
- Period 5: 32 terms

All terms and definitions are preserved from the three supplied StudyMate files in `periods.js`. Visitors select a period and practice matching. There are no import, editing, export, or custom-set features; old browser-saved custom sets are not loaded.

Direct links use `?period=2`, `?period=3`, and `?period=5`. Matching direction, round size, shuffled rounds, scoring, retry, and answer reveal are available.

Answers use searchable dropdowns: type a few letters to filter the current round's choices, click a suggestion or press Enter to select, and use arrow keys to browse. Tab moves to the next question. Partial or unrecognized text is not saved as an answer. Search works in both matching directions.

## Development

Run `npm run dev` for the local preview and `npm test` for dataset and grading checks.

## Publishing

The Vercel project `ap-euro` in `shreyjain11s-projects` is connected to `shreyjain11/ap-euro`. Production updates deploy from `main`. `npm run build` runs the tests and copies only the five public assets into `dist`. The IONOS `euro` CNAME uses the project's Vercel DNS target, and Vercel manages HTTPS.

Open the hosted HTTPS URL to study. Opening `index.html` directly from disk redirects to that URL because browser module imports require a web server.

The previous Sites project is separate and is not used by this website.
