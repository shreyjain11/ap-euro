# AP Euro matching practice

A small, dependency-free static study tool for euro.jainshrey.com. Paste a StudyMate glossary, choose definitions-first or terms-first, and match answers using dropdowns.

Pasted sets are stored only in the current browser's local storage. They are not uploaded to GitHub or shared with other visitors. Export a TSV backup from the editor. No credentials or server are required.

## Development

Run `npm run dev` for the local preview and `npm test` for import and grading checks.

## Publishing

GitHub Pages serves the `main` branch root. DNS for `euro` must be a CNAME pointing to `shreyjain11.github.io`. Configure `euro.jainshrey.com` in the repository's Pages settings and enable HTTPS after GitHub issues the certificate.

The previous Sites project is separate and is not used by this website.
