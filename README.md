# Reveal.js Tabset Extension For Quarto

A Reveal.js plugin that brings proper tabset support to Quarto presentations.
This extension enables fragment-based navigation through panel tabsets, allowing smooth transitions between tabs using keyboard navigation.

## Features

- **Fragment Navigation**: Tabs are treated as fragments, enabling smooth keyboard-based navigation.
- **PDF Export Support**: Correct tab state is preserved when exporting presentations to PDF.
- **Multiple Tabsets**: Support for multiple tabsets per slide.
- **Nested Fragments**: Fragments within tabs are properly indexed and navigated.
- **Bidirectional Navigation**: Navigate forwards and backwards through tabs seamlessly.

## Installation

```bash
quarto add mcanouil/quarto-revealjs-tabset
```

This will install the extension under the `_extensions` subdirectory.
If you are using version control, you will want to check in this directory.

## Usage

### Basic Setup

Add the plugin to your Reveal.js presentation:

```yaml
---
title: "My Presentation"
format:
  revealjs: default
revealjs-plugins:
  - tabset
---
```

### Creating Tabsets

Use Quarto's native panel tabset syntax to create tabs in your slides:

```markdown
## Slide with Tabset

:::: {.panel-tabset}

### Tab 1

Content for the first tab.

### Tab 2

Content for the second tab.

### Tab 3

Content for the third tab.

:::
```

### Navigation

- Use **arrow keys** or **space bar** to navigate through tabs.
- Press **right arrow** or **space** to advance to the next tab.
- Press **left arrow** to return to the previous tab.
- Tabs are treated as fragments in the presentation flow.

## How it Works

The plugin automatically:

1. Detects all panel tabsets (`.panel-tabset`) in your slides.
2. Assigns fragment indices to tab content and any nested fragments.
3. Creates invisible fragment triggers for tab switching.
4. Listens to fragment events to switch tabs during navigation.
5. Ensures correct tab state during PDF export.

## PDF Export

For proper PDF export with separate slides for each tab state, you must enable the `pdf-separate-fragments` option in your document YAML:

```yaml
format:
  revealjs:
    pdf-separate-fragments: true
```

This ensures that each tab appears on a separate page in the exported PDF, allowing viewers to see all tab content sequentially.

## Example

Here is the source code for a comprehensive example: [example.qmd](example.qmd).

Output of `example.qmd`:

- [Reveal.js](https://m.canouil.dev/quarto-revealjs-tabset/)
