---
name: Cosplay Shapes
description: Free, true-to-scale cosplay pattern templates, shown as anime title cards.
colors:
  ultramarine-field: '#1d2bd6'
  ultramarine-pale: '#dfe2ff'
  seam-magenta: '#ff3d7f'
  seam-magenta-deep: '#c2185b'
  highlight-yellow: '#ffd23f'
  ground: '#f7f7f2'
  paper-white: '#ffffff'
  ink: '#121212'
  ink-muted: '#4a4a52'
  rule-grey: '#d9d9cf'
  error-red: '#c0122f'
  error-tint: '#fde8ec'
typography:
  display:
    fontFamily: 'Big Shoulders, Impact, sans-serif'
    fontSize: '88px'
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: '0.01em'
  headline:
    fontFamily: 'Big Shoulders, Impact, sans-serif'
    fontSize: '40px'
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: '0.01em'
  title:
    fontFamily: 'Big Shoulders, Impact, sans-serif'
    fontSize: '24px'
    fontWeight: 900
    lineHeight: 1
  body:
    fontFamily: 'Atkinson Hyperlegible, system-ui, sans-serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.4
  body-strong:
    fontFamily: 'Atkinson Hyperlegible, system-ui, sans-serif'
    fontSize: '15px'
    fontWeight: 700
    lineHeight: 1.4
  small:
    fontFamily: 'Atkinson Hyperlegible, system-ui, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: 'Atkinson Hyperlegible, system-ui, sans-serif'
    fontSize: '12px'
    fontWeight: 700
    letterSpacing: '0.08em'
rounded:
  none: '0'
spacing:
  xxs: '4px'
  xs: '8px'
  base: '16px'
  m: '24px'
  l: '60px'
  xl: '120px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper-white}'
    typography: '{typography.body-strong}'
    rounded: '{rounded.none}'
    padding: '11px 18px'
  button-primary-hover:
    backgroundColor: '{colors.ultramarine-field}'
    textColor: '{colors.paper-white}'
  button-secondary:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.ink}'
    typography: '{typography.body-strong}'
    rounded: '{rounded.none}'
    padding: '11px 18px'
  button-secondary-hover:
    backgroundColor: '{colors.highlight-yellow}'
    textColor: '{colors.ink}'
  input:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '7px 9px'
  input-invalid:
    backgroundColor: '{colors.error-tint}'
    textColor: '{colors.ink}'
  segment:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '8px 10px'
  segment-hover:
    backgroundColor: '{colors.highlight-yellow}'
  segment-selected:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper-white}'
    typography: '{typography.body-strong}'
  rail-link:
    backgroundColor: '{colors.ultramarine-field}'
    textColor: '{colors.paper-white}'
    padding: '9px 10px'
  rail-link-hover:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.ultramarine-field}'
  rail-link-active:
    backgroundColor: '{colors.seam-magenta}'
    textColor: '{colors.ink}'
    typography: '{typography.body-strong}'
  shape-tile:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '14px 16px 16px'
  shape-tile-hover:
    backgroundColor: '{colors.highlight-yellow}'
---

# Design System: Cosplay Shapes

## Overview

**Creative North Star: "The Act-Break Title Card"**

Every shape is presented like an anime eyecatch: a flat ultramarine field cut by one hard diagonal, a magenta edge running along the cut, the shape's name in condensed heavy caps, the finished cel-shaded form on one side and its flat pattern on the other. The world is flat colour, black ink and white paper. There are no gradients, no glass and no soft depth; depth comes from the diagonal and from the cel shading of the model.

Underneath the graphic shell the tool is a cutting-table instrument. Pattern lines are drawn one device pixel wide over a true-scale grid, numbers sit in tabular figures, and the form gives one decision per line using standard web controls. The loud parts (field, title, magenta seam) frame the work; the quiet parts (ink lines on white paper on an off-white ground) are the work.

The system is light only. Patterns get checked against white paper on a cutting table, so there is no dark mode and none should be added.

**Key Characteristics:**

- One hard diagonal splits an ultramarine field from the off-white ground, edged by a thin magenta band.
- Condensed heavy uppercase display type (Big Shoulders 900) against a hyperlegible UI face (Atkinson Hyperlegible 400/700).
- Zero radius everywhere; controls are ruled in 1.5px ink.
- Pattern geometry is drawn in one-device-pixel lines at true proportion over a 1 cm or 1 in grid.
- One authored motion: the diagonal wipe when the shape changes.

## Colors

Three saturated poster inks (ultramarine, magenta, yellow) over a neutral base of off-white ground, white paper and near-black ink.

### Primary

- **Ultramarine Field** (ultramarine-field): the shape rail, the stage's title-card field, the picker intro field, the browser theme colour, and the dashed stitch and fold guides on the pattern. Text on it is paper white.
- **Pale Ultramarine** (ultramarine-pale): secondary text that sits on the field: rail group labels, the rail footer, the picker's fact list and the stage summary readout.

### Secondary

- **Seam Magenta** (seam-magenta): selection and the lit seam. It marks the active shape in the rail, the thin edge along every diagonal cut, the edited seam on the flat pattern (drawn at three times the hairline) and the tube along the same seam on the 3D model. It is also the global focus outline and the text caret.
- **Deep Magenta** (seam-magenta-deep): the checkbox accent colour only, where full magenta would fail contrast on white.

### Tertiary

- **Highlight Yellow** (highlight-yellow): the body colour of the cel-shaded model, the hover fill for secondary buttons, segments and shape tiles, the accent word in the brand and the primary button, the picker's square fact bullets, and text selection.

### Neutral

- **Ground** (ground): the page and stage background, slightly warm so white paper reads against it.
- **Paper White** (paper-white): the fill of every pattern piece, form controls, shape tiles and the export bar. It is the colour the maker will print on.
- **Ink** (ink): body text, the cut line and notches, 1.5px control borders, the primary button, the selected segment, and the model's outline hull.
- **Muted Ink** (ink-muted): hints, examples, the legend, piece label detail, page-edge marks and labels.
- **Rule Grey** (rule-grey): 1px row dividers in the form, the column rule beside it, disabled control borders, and the true-scale grid lines.
- **Error Red** (error-red) and **Error Tint** (error-tint): invalid input border and fill, and error messages.

### Named Rules

**The Magenta Means Here Rule.** Magenta marks exactly one thing per context: the current shape, the seam being edited, the focused control, or the diagonal edge. It never fills a button or decorates.

**The Flat Ink Rule.** Colour is applied as flat fills. Fields are a single colour cut by `clip-path`; no gradients, tints or transparency washes.

## Typography

**Display Font:** Big Shoulders 800/900 (with Impact, sans-serif)
**Body Font:** Atkinson Hyperlegible 400/700 (with system-ui, sans-serif)

**Character:** A condensed, shouting title-card face paired with a face designed for legibility at small sizes, so the drama lives in the headings and every number stays unmistakable.

### Hierarchy

- **Display** (900, 52px phone / 64px tablet / 72px small laptop / 88px desktop, line-height 0.88, uppercase, balanced wrap): the shape name on the stage and the brand title on the picker.
- **Headline** (900, 30 / 34 / 36 / 40px, uppercase): the picker's family headings and the flat-pattern heading on the stage.
- **Title** (900, 20 / 22 / 22 / 24px, line-height 1, uppercase): form section titles and shape-tile names.
- **Body** (400 and 700, 16px below 1024px and 15px above, line-height 1.4): all UI text; field labels are bold. Lead copy runs at the title size, line-height 1.35, to 34ch.
- **Small** (400, 13px): hints, examples and the line legend.
- **Label** (700, 12px, 0.08em tracking, uppercase): only the Round and Flat-sided group labels inside the shape rail.

### Named Rules

**The Longest Word Rule.** The stage title is sized from its longest word (about half an em per letter, capped by the xl size and the container width) so every word clears the diagonal. Do not let display type cross the cut.

**The Tabular Figures Rule.** Anywhere only values change (inputs, the stage summary readout), use tabular figures so columns don't jitter as the maker types.

## Layout

On desktop the generator is a fixed three-column grid at full viewport height: the ultramarine rail (232px), the settings form (320 to 360px, scrolling on its own, ruled off with a 1px grey line), and the stage taking the rest. The stage is a size container. Its diagonal runs from 44% across at the top to 30% at the bottom; the title sits top left on the field, the flat-pattern heading top right, the legend bottom right, and the export bar runs under it with a 1.5px ink top rule.

The picker is two columns: the intro (at least 360px, 40% wide) on a field whose diagonal runs from the right edge at the top to 84% at the bottom, and the shape grid (tiles at least 230px, 14px gaps).

Below 1024px everything stacks into one column. The rail becomes a horizontal scrolling strip with its group labels hidden, the stage becomes a fixed band (78svh, between 520 and 720px) with the diagonal turned horizontal, and the export bar splits so its summary stays in the flow while paper size and Download PDF stick to the bottom of the screen.

Spacing follows the theme scale (4, 8, 16, 24, 60, 120px on desktop; tighter on phones). Inside components, small hand-set paddings (7 to 14px) tune control density.

**The Sticky Print Rule.** On narrow screens the paper size and the primary PDF action always stay pinned to the bottom of the viewport.

## Elevation & Depth

The system is flat. No shadows are used. Depth comes from three things only: the diagonal cut between field and ground, the 1.5px ink rules that separate regions, and the cel shading of the 3D model (toon material with stepped light, an ink back-face outline hull at 1.035 scale, and ink edge lines).

**The Cel Not Shadow Rule.** If something needs to read as raised, outline it in ink or give it a flat fill. Never use a blurred shadow.

## Shapes

Every corner is square (zero radius): buttons, inputs, selects, segments, tiles, the export bar and every pattern piece. Controls are bordered with 1.5px solid ink; dividers inside the form are 1px rule grey. The one recurring silhouette is the diagonal: a field cut by `clip-path` polygons with a thin magenta parallelogram along its edge, used on the stage and on the picker intro.

Pattern drawing has its own line language, kept in step with the printed exports:

- Cut line and notches: solid ink, one device pixel (non-scaling stroke at 1 / devicePixelRatio).
- Stitch and fold guides: ultramarine, dashed 5 / 4.
- Lit seam: magenta, three hairlines wide, round caps.
- Page edges: muted ink, dotted 1 / 5 at two hairlines, labelled bottom right.
- Grid: rule grey, one hairline, at a true 1 cm or 1 in.
- Piece labels: bold ink title over a muted detail line, with a white paint-order halo.

Printed PDF and SVG exports use black cut lines, ultramarine dashed score and stitch lines, Helvetica, half-diamond marks where tiles join, and a 5 cm or 2 in calibration square on the guide page. In the PDF, headings (the title, Page map, Pieces and each tile's page name) are set in Big Shoulders caps, and piece labels carry a white halo traced around their glyphs so they stay readable where they cross a line. Labels follow the on-screen rule: across a piece that fits them, turned along a tall narrow one, and set just beside one too small for either.

**The One Device Pixel Rule.** Pattern lines are one device pixel wide at every zoom and pixel ratio, redrawn on resize. Never draw pattern geometry with a CSS-pixel stroke.

## Components

### Buttons

Heavy, square and inky.

- **Shape:** square corners, 1.5px ink border, padding 11px 18px, bold body text, no wrapping.
- **Primary:** ink fill with white text; an accent span inside turns yellow (for example the format in "Download PDF"). Hover turns the fill and border ultramarine.
- **Secondary:** white fill with ink text. Hover fills yellow.
- **Transitions:** background and colour, 150ms ease-out, hover only on fine pointers.
- **Disabled / busy:** 60% opacity with a progress cursor.

### Segmented Control

- **Style:** a grid of equal cells inside one 1.5px ink border; cells are white with no borders of their own.
- **State:** the selected cell (`aria-pressed`) is solid ink with white bold text; unselected cells fill yellow on hover. Used for the unit switch and similar two-to-four-way choices.

### Inputs / Fields

- **Style:** white fill, 1.5px ink border, square corners, padding 7px 9px, numbers right-aligned in tabular figures. Selects use the same box with an ink chevron.
- **Row:** label (bold), input (112px) and unit (34px) on one grid line, 9px vertical padding, 1px rule-grey divider below. Wide fields use label plus a 156px control.
- **Focus:** a 3px solid magenta outline flush with the border.
- **Error:** red border, pale red fill, bold red message below. **Disabled:** grey border and muted text.
- **Checkbox:** native, 18px, deep magenta accent, with a small muted hint beside it.

### Navigation (Shape Rail)

- **Style:** an ultramarine column with the brand in display caps at the top (the second word in yellow), then the shapes grouped under small tracked labels, each with a 22px line icon.
- **States:** the current shape fills magenta with ink bold text; hover fills white with ultramarine text; focus uses a yellow outline inset 3px.
- **Mobile:** a single horizontal scrolling row with the group labels visually hidden.

### Shape Tiles

- **Style:** white tile, 1.5px ink border, square, with the flat pattern drawn as a thumbnail, the shape name in title caps and a small muted example line.
- **Hover:** fills yellow.

### Title-Card Stage (signature)

The generator's stage is the system's signature. The ultramarine field and its magenta edge wipe in along the diagonal when the shape changes (620ms, expo-out `cubic-bezier(0.16, 1, 0.3, 1)`), and the title block slides in 24px from the left over 520ms after a 140ms delay. Under reduced motion both are off, and below 1024px the wipe is off. The cel-shaded model sits on the field (yellow body, ink outline, magenta tube on the edited seam) and the flat pattern sits on the ground at true proportion, with the same seam lit in magenta.

**The One Motion Rule.** The diagonal wipe is the only authored motion. Everything else is a 150ms colour change on hover. Don't add entrances, parallax or scroll effects.

## Do's and Don'ts

### Do:

- **Do** keep every corner square (zero radius) and border controls with 1.5px solid ink.
- **Do** draw pattern lines one device pixel wide with a non-scaling stroke, and keep the on-screen line language (ink cut, ultramarine dashed guides, magenta lit seam) the same as the printed one.
- **Do** use magenta for exactly one "this one" mark per context: the selection, the lit seam, focus, or the diagonal edge.
- **Do** size display titles from their longest word so they clear the diagonal.
- **Do** use tabular figures wherever values update in place.
- **Do** keep paper size and Download PDF pinned to the bottom below 1024px.
- **Do** turn the diagonal wipe off under `prefers-reduced-motion`.

### Don't:

- **Don't** add a dark mode; pattern checking happens against white paper.
- **Don't** use shadows, gradients or rounded corners on any surface.
- **Don't** fill buttons with magenta or use it as decoration.
- **Don't** let display type cross the diagonal cut.
- **Don't** add a second authored animation beyond the title-card wipe.
- **Don't** draw pattern geometry with CSS-pixel strokes or any radius.
