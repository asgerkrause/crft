// Synthetic test-input adapter; Brand OS owns production recipes and format exports.
export const roles = { display: 5, h1: 4, h2: 3, h3: 2, lead: 1, body: 0, small: -1, label: -1, caption: -1, stat: 5 };

function dimension(value, units, positive = true) {
  if (!value || !Number.isFinite(value.value) || !units.includes(value.unit) || (positive && value.value <= 0)) throw new Error(`Invalid dimension: ${JSON.stringify(value)}`);
  return value.value;
}

export function resolveFixture(fixture) {
  if (fixture.contractVersion !== 4) throw new Error("Incompatible Brand OS context: crft requires contractVersion 4; v1/v2/v3 context recipes require explicit migration");
  const f = fixture.foundations;
  const min = dimension(f["viewport-min"], ["rem"]);
  const max = dimension(f["viewport-max"], ["rem"]);
  if (max <= min) throw new Error("Fluid range must increase");
  for (const key of ["type-scale-min", "type-scale-max"]) if (!Number.isFinite(f[key]) || f[key] <= 0) throw new Error("Ratios must be positive");
  const baseMin = dimension(f["type-size-min"], ["rem"]);
  const baseMax = dimension(f["type-size-max"], ["rem"]);
  return Object.fromEntries(Object.keys(roles).map((name) => {
    const role = fixture.roles[name];
    if (!role || !Number.isInteger(role.step)) throw new Error(`Missing role/step ${name}`);
    const literal = role.size ? dimension(role.size, ["rem"]) : undefined;
    const lo = literal ?? (role["size-min"] ? dimension(role["size-min"], ["rem"]) : baseMin * f["type-scale-min"] ** role.step);
    const hi = literal ?? (role["size-max"] ? dimension(role["size-max"], ["rem"]) : baseMax * f["type-scale-max"] ** role.step);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi < lo) throw new Error(`Invalid endpoints ${name}`);
    if (hi / lo > 2.5) throw new Error(`Source ratio budget exceeded ${name}`);
    if (lo * max <= hi * min) throw new Error(`Lost zoom growth ${name}`);
    if (typeof role.axes !== "string" || /["']wght["']/.test(role.axes)) throw new Error("Role axes must preserve ordinary weight");
    dimension(role.tracking, ["em"], false);
    dimension(role.measure, ["ch"]);
    if (!Number.isFinite(role.weight) || role.weight <= 0 || !Number.isFinite(role.leading) || role.leading <= 0) throw new Error(`Invalid metadata ${name}`);
    return [name, { minRem: lo, maxRem: hi, ...(lo === hi ? { staticRem: lo } : {}) }];
  }));
}

export function fixtureCss(fixture) {
  const resolved = resolveFixture(fixture);
  const declarations = [];
  for (const [name, value] of Object.entries(fixture.foundations)) declarations.push(`--ak-${name}: ${typeof value === "number" ? value : value.value};`);
  for (const [name, value] of Object.entries({ ...fixture.colors, ...fixture.fonts })) declarations.push(`--ak-${name}: ${value};`);
  for (const [name, scale] of Object.entries(fixture.scales)) {
    dimension(scale.size, ["rem"]);
    if (!Number.isFinite(scale.scale) || scale.scale <= 0) throw new Error(`Invalid scale multiplier ${name}`);
    declarations.push(`--ak-${name}-md: ${scale.size.value}rem;`, `--ak-${name}-scale: ${scale.scale};`);
  }
  for (const [name, role] of Object.entries(fixture.roles)) {
    declarations.push(`--ak-${name}-step: ${role.step};`);
    for (const key of ["family", "weight", "leading", "case", "features", "axes", "optical-sizing"]) declarations.push(`--ak-${name}-${key}: ${role[key]};`);
    for (const key of ["tracking", "measure"]) declarations.push(`--ak-${name}-${key}: ${role[key].value}${role[key].unit};`);
    for (const key of ["size-min", "size-max"]) if (role[key]) declarations.push(`--ak-${name}-${key}: ${role[key].value};`);
    if (resolved[name].staticRem !== undefined) declarations.push(`--ak-${name}-size: ${resolved[name].staticRem}rem;`);
  }
  return declarations.join("\n");
}
