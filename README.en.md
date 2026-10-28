<div align="center">

<img src="public/favicon.png" width="96" alt="autopot">

# **autopot**

**A cooking calculator for Don't Starve Together**

**Figure out what a pot will yield before you put it in.**

[简体中文](README.md) | English

![Vue](https://img.shields.io/badge/Vue-42b883?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-f7d336?logo=pinia&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6e9f18?logo=vitest&logoColor=white)

</div>

## Features

Simulates the in-game cooking logic.

## Data Source

All data is parsed from the **local game installation** (`data/databundles/scripts.zip`, always up to date with the game).
A single `npm run data` extracts everything and generates `src/data/ingredients.ts` and `src/data/recipes.ts`:

```sh
npm run data
```

The script locates your Steam DST installation automatically (or pass an explicit path with
`node scripts/build-data.mjs --dst "<DST install directory>"`), then parses:

- `cooking.lua` — the ingredient registry (food values, cooked/dried variants)
- `prefabs/oceanfishdef.lua` — food values of ocean fish
- `languages/chinese_s.po` — the official Simplified Chinese names

> Re-run `npm run data` after a game update to sync the latest ingredients.

## Asset Extraction

All extracted from the local game installation (Steam located automatically, or use `--dst`):

```sh
npm run extract-icons   # inventory icons -> src/assets/icons/ (pre-upscaled + sharpened, compressed to ≤128px)
node scripts/extract-pot.mjs   # cookpot UI sprites & layout -> src/assets/pot/
npm run build-fonts     # generate the Latin @font-face and --font-game stack -> src/assets/fonts/
```

Already-extracted icons can be recompressed standalone: `node scripts/optimize-icons.mjs`.

## Fonts

Self-hosted, split by unicode-range (GitHub Pages friendly):

- **Chinese**: ZCOOL KuaiLe (OFL 1.1, via the `@fontsource/zcool-kuaile` npm dependency), split into
  unicode-range chunks by `npm run build-fonts` (output committed to the repo, ready on clone).
  Its Latin glyphs are stripped so English always renders with the Latin font
- **Latin/digits**: `konstanting.ttf` (font of the official Simplified Chinese localization; drop it into
  `.cache/fonts/` and re-run `npm run build-fonts`). Falls back to Stint Ultra Condensed
  (the in-game numeral font, OFL, bundled via npm) when missing

No manual download needed for Chinese; the Latin font is optional (falls back to Stint) — drop it in and re-run to upgrade.

## Deployment

Production build output lives in `dist/`. `base` in `vite.config.ts` is set to `/autopot/` for a
GitHub Pages project site (`https://<username>.github.io/autopot/`).

## Copyright Notice

- All code and content of this project are for **non-commercial purposes only** (learning & sharing).
  Any commercial use of the tool or its build output is strictly prohibited.

## Development

Requires Node.js `^22.18.0 || >=24.12.0` (`mise.toml` is included — just `mise install` if you use mise).

```sh
npm install
```

### Local Development

```sh
npm run dev
```

### Type Check & Production Build

```sh
npm run build
```

### Unit Tests

```sh
npm run test:unit
```

### Lint

```sh
npm run lint
```
