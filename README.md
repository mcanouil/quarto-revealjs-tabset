# Reveal.js Tabset Extension For Quarto

A Reveal.js plugin that brings proper tabset support to Quarto presentations: the arrow keys step through the tabs and the fragments inside them in document order, and a PDF export gives each tab its own page.
Quarto's own `tabset-fragments` option does the same, and the extension steps aside when that option is on.

## Installation

```bash
quarto add mcanouil/quarto-revealjs-tabset@1.4.3
```

This will install the extension under the `_extensions` subdirectory.
If you are using version control, you will want to check in this directory.

## Documentation

The full documentation lives at <https://m.canouil.dev/quarto-revealjs-tabset/>: the attributes and classes, the fragment order, the PDF behaviour, the relation to Quarto's `tabset-fragments` option, and a deck to step through.

[`example.qmd`](example.qmd) is a short, standalone starting point you can copy.

## Licence

[MIT](https://github.com/mcanouil/quarto-revealjs-tabset?tab=MIT-1-ov-file#readme).
