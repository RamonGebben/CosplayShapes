# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Cosplayers, prop makers and other crafty makers who need a flat pattern for a basic 3D shape (a bracer, a horn, a helmet dome, a box-shaped armour piece) and want to go from their measurements to a printed pattern on the cutting mat quickly, without drafting the geometry by hand.

## Product Purpose

CosplayShapes is a free convenience tool. The maker picks a basic 3D shape, enters dimensions, and exports a flat pattern that can be printed or sent to a cutter straight away. Success means the printed pattern is true to scale, assembles into the intended shape in the chosen material, and the maker didn't have to do any maths or rescaling themselves.

## Name

CosplayShapes (written as one word, displayed as "cosplay / shapes" in the brand mark). Chosen to lead with the core audience; prop makers and other crafters are reached through page copy and per-shape keywords ("foam cone template", "bracer pattern") rather than the name. Hosted at https://cosplayshapes.ra-ge.net; no own domain bought yet.

## Positioning

Free, focused on basic shapes, and print-ready on export: no calculating, no rescaling, no redrawing. Whether comparable tools exist hasn't been researched yet, so no claims of being "the only" or "the first".

## Operating Context

- Makers work from their own measurements (often body measurements) and print at home on A4 or Letter paper, then trace or tape the pieces onto material.
- Some makers send patterns to cutting machines (Cricut, laser, vinyl cutters).
- Materials in scope: EVA foam, fabric, thermoplastics (e.g. Worbla), paper/cardstock, and cardboard.
- Both metric (mm/cm) and imperial (inches) units are used.

## Capabilities and Constraints

Initial shape families:

- Cylinders and cones, including truncated cones
- Spheres and domes (gore patterns)
- Boxes and prisms (cubes, cuboids, pyramids, prisms)

Export requirements:

- True-scale PDF that prints at 100%, with a way to verify scale
- Tiling of large pieces across multiple A4/Letter pages, with alignment marks
- SVG export for cutting machines
- Optional seam allowance (relevant for fabric)
- Optional material-thickness compensation: material thickness (e.g. EVA foam) changes the measurements, so the calculation should be able to account for it

Units: metric and imperial.

Undecided: accounts or saved patterns, the exact shape list within each family, and any monetisation beyond being free.

## Evidence on Hand

None yet: the app is still the Next.js starter. There are no testimonials, user counts, example builds or photos of finished pieces. Future work must not fabricate any of these.

## Product Principles

1. **Print-ready or it isn't done.** Every export must produce a correct physical result at 100% scale. Accuracy outranks features.
2. **Convenience over control.** Ask only for the measurements the shape needs and handle the geometry, thickness and tiling for the maker.
3. **Speak maker, not maths.** Use the terms cosplayers and prop makers already use (foam thickness, seam allowance, gores, bevels), not geometry jargon.
4. **Material-aware.** Treat material choice (foam, fabric, thermoplastic, paper, cardboard) as an input that changes the pattern, not as a label.
5. **Free and frictionless.** No barrier between arriving and printing a pattern.
