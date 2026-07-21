# Frontend-quality migration evidence

Use after mapping a migration slice. This is an evidence guide, not a second system handbook: CSS remains source of selectors, values, formulas, breakpoints, skin mappings, and motion policy. Start with [README.md](../../../../README.md#verification), then inspect the owning CSS file named by [Files and layers](../../../../README.md#files-and-layers).

## Evidence by seam

- **Semantics and access:** Use native elements and controls. Check labels, names, descriptions, disabled and hidden states, keyboard focus, screen-reader-only content that restores focus when applicable, and DOM order. Do not replace native behavior with ARIA or custom controls without a demonstrated need. Source: `styles/base.css`, `README.md#base-guarantees`.
- **Responsive composition:** Render the migrated slice in large, medium, and small states from its nearest documented container boundary. Include nested boundaries when present and confirm a grid outside a boundary stacks. Preserve meaningful source and keyboard order; visual order is presentation only. Source: `styles/layout.css`, `README.md#grid-grammar`.
- **Skins and contrast:** Check each affected skin in light and dark schemes, including nested skin boundaries. Confirm text, accent, selection, form, and surface relationships remain legible; do not treat a swatch as an accent route. Source: `styles/tokens.css`, `styles/base.css`, `README.md#skins`, `README.md#accent-routing`.
- **Motion and progressive features:** With reduced motion enabled, content and controls must remain complete without motion. In browsers lacking an optional feature, check useful native/default behavior rather than pixel parity. Test disclosure, corner-shape, and scroll-motion only when the slice uses them. Source: `styles/features.css`, `styles/tokens.css`, `README.md#features`, `README.md#browser-policy`.
- **Cascade and ownership:** Verify import and layer order, then find the first owner whose job fully explains each changed rule. Keep consumer details in its project layer; do not override a shared role merely because a local result looks similar. Source: `global.css`, `README.md#files-and-layers`, `README.md#extension`.

## Finding authority

1. Read the relevant README section for public intent and permitted API.
2. Inspect `global.css`, then the owning CSS file for actual behavior.
3. Search consumer markup and CSS before deleting selectors, tokens, files, or generated output.
4. Treat examples and this guide as navigation only; resolve conflict in CSS source and the repository contract.

## Minimum record

Record the slice, semantic markup, affected states, container sizes, skin/scheme coverage, motion/fallback coverage, and exact static/rendered checks run. Note residual project-owned rules and any unverified browser path.

## Stop

Stop and escalate when ownership or entrypoint is unclear; a change needs a public API; native or fallback behavior cannot be preserved; contrast, keyboard access, source order, or reduced-motion behavior cannot be verified; or deletion lacks consumer-search evidence. Do not call migration complete on static checks alone.
