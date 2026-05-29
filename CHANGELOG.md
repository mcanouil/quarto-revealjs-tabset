# Changelog

## Unreleased

### New Features

- feat: Add ARIA roles (`tablist`, `tab`, `tabpanel`) and a `presentation` role on tab list items at initialisation, so assistive technology recognises the tabset structure.
- feat: Wire keyboard navigation within each tablist (Left/Right move between tabs, Home/End jump to first/last); focus follows the active tab.
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
