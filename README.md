# CRFT

CRFT is the SNZ frontend design and CSS system. It combines product strategy, visual judgment, semantic structure, CSS, accessibility, performance, and verification.

Start with [`CRAFT.md`](CRAFT.md). It routes tasks to the relevant canonical owner.

## Documentation

[`CRAFT.md`](CRAFT.md) is the only complete task router. It routes to 16 focused topic owners under `craft/`.

`styles/**` owns live values, formulas, breakpoints, selectors, skins, and motion. [`examples/`](examples/) contains runnable evidence, not API.

CRFT has no dependency on another frontend doctrine. It is not a component library.

## Copy the CSS

Ask which layers to copy. Do not dump the full tree onto an existing site.

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers tokens,type --fonts /absolute/path/to/project/styles
```

The copier writes requested `layers/*.css` files. It does not copy `global.css`. Fonts copy only with `--fonts`. It refuses conflicts and never merges or upgrades project-owned files. Put the printed prelude and `@import`s at the top of the project CSS file. Brand in the copied `tokens.css`. Keep product presentation in the project’s normal CSS owner.

CRFT is the system. [`CRAFT.md`](CRAFT.md) is the task router. [`craft/`](craft/) holds topic owners. [`skills/crft/SKILL.md`](skills/crft/SKILL.md) is the thin agent entrypoint.

## Use

```html
<section data-skin="tone">
  <div c>
    <div s>
      <h2>Meaning before presentation</h2>
      <div g="3-2">
        <article x="2-1">...</article>
        <aside data-accent="secondary">...</aside>
      </div>
    </div>
  </div>
</section>
```

`.btn`, `.crd`, and `.lnk` are project component naming conventions. CRFT does not style or implement them.

## Verify

```sh
node scripts/check-system.mjs
node --test
cd reference && bun run test
cd reference && bun run test:rendered
```

Static checks do not prove strategy, accessibility, visual quality, or browser behavior. Use the three gates in [`craft/verify.md`](craft/verify.md).
