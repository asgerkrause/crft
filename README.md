# CRFT

> **Superseded.** This repo is archived. crft now lives in AK `skills/craft` (github.com/asgerkrause/ak). Do not read, run, copy, or install anything from here.

CRFT is the SNZ CSS, token, class, naming, and architecture strategy plus a reference structure. It supplies semantic CSS constraints, accessibility primitives and fallbacks, adoption guidance, and verification—not product strategy, design judgment, taste, or product acceptance.

Start with [`CRAFT.md`](CRAFT.md). It routes tasks to the relevant canonical owner.

## Documentation

[`CRAFT.md`](CRAFT.md) is the only complete task router. It routes to 16 focused topic owners under `craft/`.

`styles/global.css` imports two owners: `styles/tokens.css` for brand values/recipes/optional fonts, and `styles/crft.css` for framework behavior. Eight logical layers keep their precedence. [`examples/`](examples/) contains runnable evidence, not API.

CRFT has no dependency on another frontend doctrine. It is not a component library.

## Adopt the strategy

Choose the least complete mode for each affected subsystem. A project may combine local extraction for one subsystem with tokens-only adoption for another; extraction itself grants no CRFT hooks.

- **Strategy only:** use the guidance with semantic HTML and project CSS; add no CRFT hooks or files.
- **Local extraction:** move only the useful rules, tokens, and relationships into the project’s existing stylesheet, then remove unused CRFT state and dependencies. The result is project CSS, not a partial CRFT API.
- **Tokens only:** copy the complete token owner; framework selectors remain project-owned.
- **Explicit full adoption:** request `--layers full`; never infer this mode from an existing site.

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers full --fonts /absolute/path/to/project/styles
```

The copier is an optional whole-layer convenience. It writes `tokens.css`, optionally `crft.css`, plus `crft-manifest.json`, an adoption record with the source revision, file hashes, and a contract snapshot. It does not copy `global.css`, and never merges or upgrades project-owned files. `--layers` accepts only `tokens` or `full`. Fonts and their declarations copy only with `--fonts`. Semantic contractVersion 2 is unchanged; packagingVersion 1 identifies the flat package. Keep product presentation and every adopted result in the project’s normal owners.

## Built for agents

The public API is machine-readable, not prose. `node scripts/emit-contract.mjs` derives the full contract (tokens, hooks, skins, accents, layer dependencies, bans) from live CSS. The manifest makes every adopting repo self-describing, and `node scripts/check-project.mjs <styles-dir>` verifies consumer CSS against its adopted contract. Run the checker from this checkout; it uses its adjacent contract helpers. An agent never has to guess what is API: the contract says so, and the checkers fail when it drifts.

[`CRAFT.md`](CRAFT.md) is the task router. [`craft/`](craft/) holds topic guidance. [`skills/crft/SKILL.md`](skills/crft/SKILL.md) is the thin agent entrypoint.

## Full-adoption example

This markup assumes tokens.css and crft.css are present. Strategy-only and local-extraction projects use their own CSS API.

```html
<section data-skin="tone">
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

`.btn`, `.crd`, and `.lnk` are project component naming conventions. CRFT does not style or implement them.

## Verify

```sh
node scripts/check-system.mjs
node --test scripts/*.test.mjs
cd reference && bun run test
cd reference && bun run test:rendered
```

Static checks do not prove strategy, accessibility, visual quality, or browser behavior. Use the three gates in [`craft/verify.md`](craft/verify.md).
