---
status: example
canonical: false
crft_api: confirmed
---

# Page from reference

An editorial article with a labeled argument figure and related reading. This synthetic composition makes no screenshot-fidelity claim.

Open `/examples/page-from-reference/` in the reference app.
Read [`markup.html`](markup.html) and [`example.css`](example.css).

The article keeps copy before its figure in source order. Related links open runnable examples.
The figure explains claim → evidence → next step, with equivalent caption text.
`g="12-6"` sets large and medium tracks; small screens stack automatically.
Image scrub is progressive; reduced motion preserves the complete static figure.

## Layout intent

```text
Wide:   Article | Figure
        Related reading
Narrow: Article
        Figure
        Related reading
```

Run `bun run test` and `bun run test:rendered` from `reference/`.
Browser checks cover responsive layout, keyboard operation, content pressure, themes, and reduced motion where applicable.

Stop: Backend integration, real-device behavior, and Firefox/WebKit proof remain outside this example.
Reply: Changed paths, executed checks, rendered evidence, remaining gaps.
