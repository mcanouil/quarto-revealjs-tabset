# Changelog

## Unreleased

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
