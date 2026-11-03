// Validate section identities, color hooks, and grid spans against direct parent tracks.
export function markupErrors(html) {
  const errors = [];
  const stack = [];
  const ids = new Set();
  const voids = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const numeric = (value, max, zero = false) => /^(?:0|[1-9]\d?)(?:-(?:0|[1-9]\d?))?$/.test(value) && value.split("-").every((part) => Number(part) >= (zero ? 0 : 1) && Number(part) <= max);
  const positions = (value) => { const parts = value.split("-").map(Number); return [parts[0], parts[1] ?? parts[0]]; };
  const active = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  for (const match of active.matchAll(/<\/?[a-z][a-z0-9-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const tag = match[0];
    const name = tag.match(/^<\/?([a-z0-9-]+)/i)[1].toLowerCase();
    if (tag.startsWith("</")) { const index = stack.findLastIndex((entry) => entry.name === name); if (index >= 0) stack.length = index; continue; }
    const attributes = Object.fromEntries([...tag.matchAll(/\s([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map((m) => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? ""]));
    const parent = stack.at(-1);
    if (Object.hasOwn(attributes, "id")) {
      const id = attributes.id;
      if (!id.trim() || /\s/.test(id)) errors.push("id must be nonempty and contain no whitespace");
      if (ids.has(id)) errors.push(`duplicate id ${id}`);
      ids.add(id);
    }
    if (name === "section") {
      if (Object.hasOwn(attributes, "class")) errors.push("never a class on section");
      if (parent?.name === "main" && (!attributes.id || /^(?:section|section-?\d+|s\d+|\d+)$/i.test(attributes.id))) errors.push("direct main > section requires a meaningful unique id");
    }
    for (const retired of ["data-skin", "data-scheme"]) if (Object.hasOwn(attributes, retired)) errors.push(`retired ${retired} attribute`);
    for (const retired of ["t", "s", "x", "y", "w", "f"]) if (Object.hasOwn(attributes, retired)) errors.push(`retired ${retired} attribute`);
    const grid = attributes.g;
    const intrinsic = grid !== undefined && /^(?:fit|fill)(?:-sm|-lg)?$/.test(grid);
    if (grid !== undefined && !["", "sg"].includes(grid) && !intrinsic && !numeric(grid, 12)) errors.push(`invalid g value ${grid}`);
    if (Object.hasOwn(attributes, "c")) {
      if (!numeric(attributes.c, 12, true)) errors.push(`invalid c value ${attributes.c}`);
      else if (!parent?.grid) errors.push("column span requires a direct grid parent");
      else if (parent.intrinsic && attributes.c !== "0") errors.push("numeric column spans are not supported in fit/fill");
      else if (!parent.intrinsic && positions(attributes.c).some((span, index) => span > parent.tracks[index])) errors.push(`column span ${attributes.c} exceeds direct parent tracks`);
    }
    if (Object.hasOwn(attributes, "r") && (!numeric(attributes.r, 4) || !parent?.grid)) errors.push(`invalid r value ${attributes.r} or missing direct grid parent`);
    if (Object.hasOwn(attributes, "o") && (!/^[fal]-[fal]-[fal]$/.test(attributes.o) || !parent?.grid)) errors.push(`invalid o value ${attributes.o} or missing direct grid parent`);
    if (Object.hasOwn(attributes, "l") && !["", "1", "2", "3", "4"].includes(attributes.l)) errors.push(`invalid l value ${attributes.l}`);
    if (attributes["data-theme"] !== undefined && !["invert", "tone", "accent"].includes(attributes["data-theme"])) errors.push("invalid data-theme");
    let tracks = [3, 3];
    if (grid === "sg") {
      if (!parent?.grid || parent.intrinsic) errors.push("subgrid requires an explicit direct grid parent");
      tracks = attributes.c ? positions(attributes.c).map((span, i) => span || parent?.tracks[i] || 3) : [1, 1];
    } else if (grid && numeric(grid, 12)) tracks = positions(grid);
    if (!voids.has(name) && !tag.endsWith("/>")) stack.push({ name, grid: grid !== undefined, intrinsic, tracks });
  }
  return errors;
}
