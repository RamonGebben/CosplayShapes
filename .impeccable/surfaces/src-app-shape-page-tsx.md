---
version: 1
slug: "src-app-shape-page-tsx"
primary_target: "src/app/[shape]/page.tsx"
related_targets: ["src/app/page.tsx"]
---

# Pattern generator

## Scope and mode

Operate. Two routes: the shape picker (`/`, src/app/page.tsx) and one linkable generator per shape (`/[shape]`, src/app/[shape]/page.tsx). Desktop first; phone works by stacking the stage above the form. Build path: code-led. Chosen sketch: `.impeccable/mocks/decision/assigned.html`, the composition the build matches and the finish review audits.

## Job

A cosplayer or prop maker at a desktop, with measurements already taken, picks a shape, enters dimensions, chooses material, thickness and units, checks the preview and exports. Success: a true-scale PDF (100% print, calibration square, tiled A4/Letter with alignment marks) or a cutter SVG that builds the intended shape in that material. The proof is the live flat pattern, drawn from real geometry. No claims; example measurements are labelled as examples.

## Content

- Picker: thumbnails in two tiers, Basic shapes (tubes and cones; domes and spheres; boxes and prisms) and Complex shapes (angled and bent tubes; shaped domes and capsules; faceted), each category collapsible.
- Generator: shape rail; settings form (unit switch cm/in, the shape's dimensions, material from EVA foam, fabric, thermoplastic, paper/cardstock or cardboard, thickness, a thickness-compensation toggle, a seam-allowance toggle and amount); a title-card stage with a rotatable 3D model and the flat pattern; an export bar (Download PDF primary, paper A4/Letter, SVG for cutter, page count).

## States

- Invalid geometry gets an inline error and the stage keeps the last valid pattern.
- Large pieces tile across many pages; the page count shows on the export bar and page edges can be toggled on the stage.
- Ranges: thickness 0–10 mm, seam allowance 0–2 cm.
- Switching units converts the values rather than resetting them.
- Export: generating, done and failed.
- With no WebGL, the flat pattern stands alone.
- Reduced motion turns off the title-card wipe.
- Fully keyboard operable, including 3D rotation.

## Out of scope

Accounts, saved patterns, marketing or landing pages, monetisation.

## Open decisions

- 3D and PDF libraries (e.g. three.js, pdf-lib).
- Default sphere gore count.
- Whether thickness compensation measures to the inside or the outside surface.
- Grainline marks for fabric.

## Direction contract

THESIS: Each shape is shown as an anime act-break title card. The finished cel-shaded 3D form sits on one colour field and its live flat pattern on the other, split by one hard diagonal. This refuses the category default of a grey settings panel beside a white canvas.

OWN-WORLD:
- Ultramarine #1d2bd6 shape rail and title fields; magenta #ff3d7f for selection and the active seam; yellow #ffd23f for highlights; ground #f7f7f2; ink #121212.
- Big Shoulders Display for titles, Atkinson Hyperlegible for the UI, tabular figures in fixed columns where only values change.
- Pattern lines are one device pixel wide, redrawn on resize, with zero radius on anything touching the pattern.
- The form shows one decision per line.
- Standard web controls.

STORY: The maker sees immediately that the 3D shape they meant has become this flat piece. They trust the numbers because the pattern redraws precisely as they type, then download and print.

FIRST VIEWPORT:
- Left: the ultramarine shape rail, in Basic and Complex tiers of collapsible categories, with the active shape marked in magenta.
- Next: the settings form column with unit switch, dimensions, material, thickness and toggles.
- Right, dominant: the stage. Its title band shows the shape name in condensed heavy caps; below it, a diagonal split with the cel-shaded 3D model on one field and the flat pattern at true proportion on the other, with the edited seam lit in magenta on both.
- Bottom right: the export bar, with Download PDF as the primary action, the paper size, SVG for cutter and the page count.

FORM: Eyecatch, position 7 on the ordered grounded list (assigned by the roll), seed:cae119d5c96ceb7a. The signature interaction is the live pattern redraw plus one diagonal title-card wipe on shape change.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
