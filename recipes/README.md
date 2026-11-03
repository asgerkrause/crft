# crft blocks

Optional, copyable Astro blocks. Each file is one section or one card. Copy the file you need; it imports only sibling blocks and uses public crft hooks and tokens.

Pick blocks by the job each page section must do.

| Block | Job | Props |
| --- | --- | --- |
| `Hero.astro` | Offer, practical note, local next step | `heading`, `summary`, `actionLabel`, `actionHref`, `detailHeading`, `detail` |
| `About.astro` | Studio story with facts and one image | `id`, `heading`, `paragraphs`, `facts`, `image` |
| `CallToAction.astro` | One closing decision and one link | `id`, `heading`, `summary`, `actionLabel`, `actionHref` |
| `Services.astro` | Three service cards with deliverables | `id`, `heading`, `intro`, `services` |
| `Team.astro` | People cards with portraits | `id`, `heading`, `intro`, `members` |
| `Testimonials.astro` | Quotes; the first spans the row | `id`, `heading`, `testimonials` |
| `SelectedWork.astro` | Four project cards in a zigzag grid | `id`, `heading`, `intro`, `projects` |
| `PortfolioIndex.astro` | Dense list of completed projects | `id`, `heading`, `intro`, `projects` |
| `CaseStudy.astro` | Project detail with facts, chapters, metrics, quote | `id`, `title`, `summary`, `facts`, `image`, `chapters`, `metrics`, `quote`, `next` |
| `Faq.astro` | Native exclusive disclosure list | `id`, `heading`, `intro`, `items` |
| `LogoRow.astro` | Text-only client names with a note | `id`, `names`, `note` |
| `Gallery.astro` | Figures with captions; the first spans the row | `id`, `heading`, `items` |
| `Card.astro` | Shared card surface used by the blocks above | optional `c` grid span; default slot |
| `SiteHeader.astro` | Brand and primary links; wraps on narrow widths | `name`, `homeHref`, `links` |
| `SiteFooter.astro` | Address, email, links, and rights | `id`, `name`, `address`, `email`, `links` |

Sample content and images for every block live in [../reference/fixtures/blocks.mjs](../reference/fixtures/blocks.mjs) and [../reference/public/blocks/](../reference/public/blocks/). The gallery renders them at `/blocks/` and checks them with [../reference/tests/blocks.spec.mjs](../reference/tests/blocks.spec.mjs).

Rules for copies:

- Pass `id` to every block that renders a `section`; a direct `main > section` needs a meaningful, unique id. `Hero.astro` is the exception: its section id is fixed at `hero`, so use it once per page.
- Keep crft hooks (`.c`, `.s`, `g`, `c`, role classes) when the page uses crft. On another stack, move the relationship into the project's own owners.
- Position a grid's wide item with `c` only when the grid has at least as many tracks as the span; the markup checker enforces this.
- Blocks link to fragments or local routes. Replace the sample hrefs before shipping.
