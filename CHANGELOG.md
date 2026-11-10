# Changelog

## Unreleased

- feat: Step through each tabset in the order of its fragments, so a fragment in a later tab appears after the tab that holds it.
  Fragment indices no longer collide with the other fragments of the slide.
- feat: Add the `.no-tabset-fragments` class to keep one tabset out of the stepping.
- feat: Print one PDF page per tab, numbered `N.1`, `N.2` and so on, when `pdf-separate-fragments` is `false`.
  Every tab is kept, whatever `pdf-max-pages-per-slide` says.
- feat: Step aside when Quarto's `tabset-fragments` option is on, and log one line to the browser console.
- fix: Show the tab that matches the fragment state after backward navigation, a deep link, or a click on a tab followed by the next fragment.
- fix: Leave the tab roles, `aria-selected` and `tabindex` values to tabby, so the Tab order and the Home and End keys work on a tabset in a deck.
- fix: Ignore `tab-active` on a tabset that steps with fragments, because the first step always shows the first tab.
- fix: Number and copy the PDF pages of nested tabsets and of several tabsets on one slide from the step sequence, so each tab state gets one page.
- fix: Suffix the `id` values of the PDF page copies with `-print-k` and update the links that point to them, rather than removing them.
  Scroll positions inside the slide are copied to each page.
- fix: Keep the keyboard focus where it was when a step switches the tab, and sync the tabsets of every slide rather than the current one only.
- fix: Show the last tab of each tabset in the scroll view.
- fix: Warn once for each ignored `.tabset-fragments` class and name the first tab of that tabset.

## 1.4.3 (2026-09-23)

### Documentation

- docs: Serve the extension's social card as the Open Graph image, so a shared link shows the card rather than the first image on the page. (#24)

## 1.4.2 (2026-08-02)

### Bug Fixes

- fix: Group the attributes in `_schema.yml` under the elements they are written on, rather than listing them flat, so editors read them as attributes rather than as element groups. Describe them as `tab-active` and `tabset-skip-pdf-clone`, the shorter authored spellings the documentation uses, rather than the `data-` prefixed spellings Pandoc emits; both are accepted and render identically. Target the Quarto Wizard v2 extension schema.

## 1.4.1 (2026-08-01)

### Documentation

- docs: Add a documentation website under `docs/`, built on the `atelier` project type and published to <https://m.canouil.dev/quarto-revealjs-tabset/>, including a deck to step through.
- docs: Trim `README.md` to a landing page pointing at the website.
- docs: Add the Pages workflow, which renders `docs/` on pull requests and deploys it from the release tag.
- docs: Add the Quarto Extensions Updates workflow, scanning `docs` for the website's own dependencies.

## 1.4.0 (2026-05-29)

### New Features

- feat: Add ARIA roles (`tablist`, `tab`, `tabpanel`) and a `presentation` role on tab list items at initialisation, so assistive technology recognises the tabset structure.
- feat: Honour `data-tab-active="N"` on a `.panel-tabset` to set the initial active tab (zero-based, out-of-range values fall back to `0`).
- feat: Honour `data-tabset-skip-pdf-clone` on a slide `<section>` to opt that slide out of per-tab PDF cloning; the first tab renders as a single PDF page.

### Bug Fixes

- fix: Strip element `id` attributes from cloned slides during PDF export so nested tabsets and other ID-bearing elements do not produce duplicate IDs in the document.
- fix: Use an explicit default for `config.pdfSeparateFragments` (`!== false`) so the cloning path runs only when Reveal.js or the document has explicitly disabled fragment splitting.
- fix: Validate `data-tab-index` values against the tab count before clicking, so a stray index cannot click a missing element.
- fix: Warn and skip when a `.panel-tabset` contains zero tabs instead of failing silently downstream.

## 1.3.0 (2026-04-06)

### New Features

- feat: Automatically clone tabset slides for PDF export so each tab appears on its own page without requiring `pdf-separate-fragments: true` globally.

## 1.2.0 (2026-03-30)

### Bug Fixes

- fix: Add `aria-hidden="true"` to invisible fragment trigger divs for screen reader compatibility.
- fix: Toggle `hidden` attribute on tab panels during PDF export for proper accessibility semantics.
- fix: Guard against malformed tab index values in fragment and PDF export handlers.

## 1.1.0 (2026-02-21)

### New Features

- feat: Add extension-provided code snippets (#6).
- feat: Add _schema.yml for configuration validation and IDE support (#4).

### Style

- style: Three colons by default.

## 1.0.1 (2026-02-11)

### Bug Fixes

- fix: Update copyright year.

## 1.0.0 (2025-11-24)

### New Features

- feat: Add code for tabset fragment support.
