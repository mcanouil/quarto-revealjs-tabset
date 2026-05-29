# Reveal.js Tabset Extension For Quarto

A Reveal.js plugin that brings proper tabset support to Quarto presentations.
This extension enables fragment-based navigation through panel tabsets, allowing smooth transitions between tabs using keyboard navigation.

## Features

- **Fragment Navigation**: Tabs are treated as fragments, enabling smooth keyboard-based navigation.
- **ARIA Semantics**: `role="tablist"`, `role="tab"`, and `role="tabpanel"` are applied at init for assistive technology.
- **Initial Tab Selection**: Set `tab-active="N"` on a tabset (emitted as `data-tab-active` in HTML) to open on a specific tab.
- **PDF Export Support**: Each tab automatically appears on its own PDF page, with a per-slide opt-out.
- **Multiple Tabsets**: Support for multiple tabsets per slide.
- **Nested Fragments**: Fragments within tabs are properly indexed and navigated.
- **Bidirectional Navigation**: Navigate forwards and backwards through tabs seamlessly.

## Installation

```bash
quarto add mcanouil/quarto-revealjs-tabset@1.3.0
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

::: {.panel-tabset}

### Tab 1

Content for the first tab.

### Tab 2

Content for the second tab.

### Tab 3

Content for the third tab.

:::
```

### Navigation

- Use **arrow keys** or **space bar** to move between fragments, which advances tabs.
- Tabs are treated as fragments in the presentation flow.

### Initial Active Tab

Set `tab-active="N"` on a `.panel-tabset` to activate the `N`-th tab (zero-based) on first display.
Pandoc emits non-prefixed attributes with a `data-` prefix in HTML, so the plugin reads `data-tab-active`:

```markdown
::: {.panel-tabset tab-active="1"}

### First

This is not the initial tab.

### Second

This is the initial tab.

:::
```

Out-of-range or non-integer values fall back to `0`.

## How it Works

The plugin automatically:

1. Detects all panel tabsets (`.panel-tabset`) in your slides.
2. Applies ARIA roles (`tablist`, `tab`, `tabpanel`) for assistive technology.
3. Assigns fragment indices to tab content and any nested fragments.
4. Creates invisible fragment triggers for tab switching.
5. Listens to fragment events to switch tabs during navigation.
6. Ensures correct tab state during PDF export.

## PDF Export

Each tab automatically appears on a separate page when exporting to PDF.
No additional configuration is needed; the plugin clones tabset slides during export so that every tab gets its own page without requiring `pdf-separate-fragments: true` globally (which would affect all fragments in the deck).

### Per-Slide Opt-Out

Add `tabset-skip-pdf-clone="true"` to a slide heading attributes block so Pandoc emits it as `data-tabset-skip-pdf-clone` on the slide `<section>`.
The slide then stays a single PDF page showing only the first tab:

```markdown
## My Slide {tabset-skip-pdf-clone="true"}

::: {.panel-tabset}

### Tab 1

Visible in PDF.

### Tab 2

Hidden in PDF for this slide only.

:::
```

This has no effect when `pdf-separate-fragments: true` is set globally; in that mode, the plugin defers to Reveal.js' fragment-based export.

## Example

Here is the source code for a comprehensive example: [example.qmd](example.qmd).

Output of `example.qmd`:

- [Reveal.js](https://m.canouil.dev/quarto-revealjs-tabset/)
