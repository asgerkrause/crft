---
title: CRFT performance
status: canonical
owner: performance
read_when: Planning media, font loading, client runtime, layout stability, third-party work, performance budgets, or measured acceptance.
---

# Performance

Performance decisions follow the product’s real content, delivery stack, and budget. Do not claim speed from source inspection alone. Measure the built product.

## Budget and ownership

Record:

```text
Supported devices and networks:
Page or interaction budget:
Likely Largest Contentful Paint element:
Layout-shift risks:
Font-loading risks:
Client runtime owners:
Third-party owners:
Measurement environment:
```

A budget must name the measured route, state, device class, network, and threshold. CRFT does not supply a universal product budget.

## Media

For each image or video:

- reserve intrinsic dimensions or an aspect ratio;
- choose crop and focal point from content meaning;
- provide responsive sources when they materially reduce transfer;
- give likely above-fold or Largest Contentful Paint media deliberate priority;
- defer below-fold media when it does not block understanding;
- avoid decoding or loading decorative media before essential content;
- verify that optimization preserves proof and legibility.

Do not lazy-load the likely Largest Contentful Paint image by default. Do not preload every possible responsive candidate.

Media composition belongs to [`composition.md`](composition.md). This file owns delivery and measurement.

## Fonts

CRFT’s copied source registers two variable TrueType files with swap behavior. A project may replace the copied files or loading strategy after it verifies license, format, required glyphs and weights, fallback metrics, preload cost, and layout shift.

Load only families, weights, styles, and subsets the rendered product needs. A preload is useful only when the resource is required early and the browser would otherwise discover it late.

## Runtime

Ship no client runtime for static sections. Prefer native HTML and CSS for structure, responsive layout, state styling, disclosure, and progressive features.

JavaScript owns behavior, data, lifecycle, and integration that the platform cannot provide cleanly. Load it at the smallest useful boundary. Remove listeners, observers, and timers during teardown.

Defer third-party work when it is not required for the first task. Record its owner, user value, loading point, failure behavior, consent boundary, and measured cost.

## Layout stability

Reserve media and embedded-content space. Keep pending controls and status regions stable where movement would disrupt the task. Verify webfont fallback, async content, validation, navigation, and overlays for unexpected shifts.

Do not trade accessible content or correct source order for a better metric.

## Motion cost

Prefer static results. When motion is justified, animate the smallest surface and explicit properties. Inspect layout, paint, style recalculation, and main-thread work in the target browser. A transform is not automatically cheap when it creates a large layer or updates many descendants.

## Common mistakes

- A performance claim without a measured build and environment.
- Lazy-loading the primary visible image.
- Preloading every font, weight, and image.
- Shipping framework runtime for static content.
- Updating a large tree for a small animation.
- Deferring content required to understand or operate the page.
- Optimizing one metric while introducing layout shift or inaccessible behavior.

## Verify

Build the real product. Measure the supported route and state with the declared environment. Inspect transfer, request priority, font use, Largest Contentful Paint, layout shift, long tasks, client runtime, third-party work, console errors, and failed requests. Compare the result with the project budget and label missing environments as not verified.
