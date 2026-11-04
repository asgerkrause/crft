# crft

crft is a CSS system for semantic HTML: tokens, type roles, layout, grid, and motion in eight cascade layers. It is built so agents and people can adopt it without guessing. A machine-readable contract states what is public API, and the checkers fail when a project drifts from it.

It is not a component library. `.btn`, `.crd`, and `.lnk` stay project-owned.

By Asger Krause and SANITIZE Studio.

## Files

- `styles/tokens.css`: brand foundations, recipes, color schemes, and optional fonts.
- `styles/crft.css`: framework behavior in the `reset`, `base`, `type`, `layout`, `grid`, `motion`, and `utility` layers.
- `styles/global.css`: the layer order and both imports.
- `CRFT.md`: the task router. Topic guides are in `docs/`.
- `SKILL.md`: the entry point for coding agents.
- `examples/`, `recipes/`, and `reference/`: runnable examples, copyable Astro blocks, and the reference site.

## Adopt

Pick the smallest mode that does the job, per subsystem:

- **Strategy only:** follow the guidance with your own CSS.
- **Local extraction:** copy only the rules you need into your stylesheet.
- **Tokens only:** copy `tokens.css`.
- **Full:** copy `tokens.css` and `crft.css`.

The copier handles tokens-only and full adoption. It writes the CSS and a `crft-manifest.json` that records the source revision, file hashes, and contract:

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /path/to/project/styles
node scripts/copy-system.mjs --layers full --fonts /path/to/project/styles
```

Then check the project against its manifest:

```sh
node scripts/check-project.mjs /path/to/project/styles
```

## Example

With full adoption:

```html
<section id="intro" data-theme="tone">
  <div class="c">
    <div class="s">
      <h2>Meaning before presentation</h2>
      <div g="3-2">
        <article c="2-1">...</article>
        <aside data-accent="secondary">...</aside>
      </div>
    </div>
  </div>
</section>
```

## Develop

Core tools need Node 24 or later and no install.

```sh
node scripts/check-system.mjs
node --test scripts/*.test.mjs
node scripts/emit-contract.mjs
node scripts/build-dist.mjs
```

The reference site needs Bun and Playwright Chromium:

```sh
cd reference
bun install
bun run test
bun run test:rendered
```

Static checks don't prove accessibility, visual quality, or browser behavior. See `docs/verify.md` for the rendered and review gates.

## License

MIT. See `LICENSE`. The bundled fonts, Inter and Geist Mono, use the SIL Open Font License; see `styles/LICENSE-Inter.txt` and `styles/LICENSE-Geist.txt`.
