# BeeD Energy — image assets

## Realistic house renders (`public/house/`)

**These are AI-generated illustrations, not photos of a real building, installation or product.** No brand, model or seller is shown; any resemblance of an appliance to a real product is accidental. Do not caption them as a real home or as a specific product from the catalogue.

| File | What it is |
|---|---|
| `base-1600.webp`, `base-900.webp` | The house: a two-storey Albanian family house in daylight, isometric ¾ view from the front-right, white render walls, terracotta tile roof with an 8-panel PV array and a tilted solar thermal collector, garage with driveway and wall EV charger, heat pump, inverter/battery unit and meter box on the right wall. Transparent background with a soft ink contact shadow. |
| `base-dusk-1600.webp`, `base-dusk-900.webp` | The same house at blue hour with lit windows (for the finale, "Ndize"). Same canvas and crop as the day file, so the two can be cross-faded. |
| `part-pv-{800,400}.webp` | Six PV panels on aluminium rails. |
| `part-inverter-{800,400}.webp` | Wall-mounted solar inverter. |
| `part-battery-{800,400}.webp` | Stacked home battery (LFP modules). |
| `part-heatpump-{800,400}.webp` | Air-to-water heat pump outdoor unit. |
| `part-swh-{800,400}.webp` | Flat-plate solar water heater (collector + tank). |
| `part-ev-{800,400}.webp` | Wall EV charger with coiled cable. |
| `part-meter-{800,400}.webp` | Meter cabinet with digital meter and breakers. |
| `part-envelope-{800,400}.webp` | Building envelope: stone wool / EPS board stack in front of a PVC window (two renders composited). |
| `manifest.json` | Pixel sizes, byte sizes, each object's bounding box, and for the house the centre of every piece of equipment (pv, swh, heatpump, inverter, battery, ev, meter, windows) in the 1600-wide image, for the stage's hotspots. Multiply by 0.5625 for the 900 files. |

Part sizes (800 / 400) are the long side. All files are WebP with alpha; the 1600 house files are ≤ 185 KB, the parts ≤ 72 KB.

- **Model:** FLUX.2 [klein] 4B, `@cf/black-forest-labs/flux-2-klein-4b`, run on Cloudflare Workers AI inside the account's free daily allowance (32 renders, about 6,700 of the 10,000 daily neurons). The dusk image is a FLUX.2 edit with the day render as reference image.
- **Prompts:** `tools/art/house-prompts.mjs` (rerunnable: `node tools/art/house-prompts.mjs <raw dir> --only base,part-pv --n 2`; the header lists which candidate of each prompt was kept).
- **Date:** 2026-10-27.
- **Licence:** the FLUX.2 [klein] 4B weights are released by Black Forest Labs under Apache 2.0 (open weights, commercial use allowed). Workers AI lists Black Forest Labs' terms of service for this model (<https://bfl.ai/legal/terms-of-service>); read them once before launch. The 9B variant of the same model is non-commercial and was not used.
- **Post-processing** (sharp, scripts kept outside the repo): flat background removed by an edge flood fill guided by gradients, with hand-traced polygons where a white wall matched the grey background; soft contact shadow kept as semi-transparent ink; 1 px feathered edge; trimmed to content. Small pseudo-lettering the model drew on the EV charger, the heat pump and the meter face was painted out. The dusk render was scaled 0.954 and shifted (+10, +6) px to line up with the day render.

### Known weaknesses
- The house has 8 PV panels, not 12, and its solar water heater is a collector on a tilt frame with no tank on the roof (a forced-circulation system, tank indoors). The `part-swh` image does show a tank.
- No separate battery cabinet on the house: the white wall unit stands for a hybrid inverter + battery (the `battery` hotspot sits on its lower half). The meter is the small grey box above it.
- The parts were generated on their own, so their styling does not match the equipment drawn on the house exactly (e.g. the house's heat pump has its fan on the side, `part-heatpump` on the front).
- Dusk vs day: a few pixels of mismatch remain around the tilted collector and the roof's right tip, and the right-wall patio door became a lit front door at dusk.
- The meter face keeps some faint smudges.

Raw renders, contact sheets and the cut-out scripts are not in the repository (they lived in the session scratchpad).
