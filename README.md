# AP Euro matching practice

A dependency-free, static matching site at euro.jainshrey.com, hosted on GitHub Pages.

## Fixed study sets

- Period 2: 34 terms
- Period 3: 53 terms
- Period 5: 32 terms

All terms and definitions are preserved from the three supplied StudyMate files in `periods.js`. Visitors select a period and practice matching. There are no import, editing, export, or custom-set features; old browser-saved custom sets are not loaded.

Direct links use `?period=2`, `?period=3`, and `?period=5`. Matching direction, round size, shuffled rounds, scoring, retry, and answer reveal are available.

## Development

Run `npm run dev` for the local preview and `npm test` for dataset and grading checks.

## Publishing

GitHub Pages serves the `main` branch root. The IONOS `euro` CNAME points to `shreyjain11.github.io`; the Pages custom domain is `euro.jainshrey.com`.

The previous Sites project is separate and is not used by this website.
