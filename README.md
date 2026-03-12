# psychologies-services-site

Initial repository setup.

## SVG sprite usage

- Icons are stored in `public/sprite.svg` as `<symbol id="icon-name">`.
- Use icons in components via:
  `<svg aria-hidden="true"><use href="/sprite.svg#icon-name" /></svg>`.
- For monochrome icons, keep `fill`/`stroke` as `currentColor`.
- Keep multicolor icons with explicit `fill` values.

## Updating sprite from Figma

1. Export required icons from Figma as SVG.
2. Normalize IDs to stable kebab-case names (for example, `icon-users`).
3. Place each icon path data inside a `<symbol>` in `public/sprite.svg`.
4. Remove redundant metadata/inline styles and keep only required attributes.
5. Replace inline icon markup in code with `<use href="/sprite.svg#...">`.
