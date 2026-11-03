// Synthetic test-input adapter; Brand OS owns production recipes and format exports.
export const roles = { display: 5, h1: 4, h2: 3, h3: 2, lead: 1, body: 0, small: -1, label: -1, caption: -1 };

function dimension(value, units, positive = true) {
  if (!value || !Number.isFinite(value.value) || !units.includes(value.unit) || (positive && value.value <= 0)) throw new Error(`Invalid dimension: ${JSON.stringify(value)}`);
  return value.value;
}

export function resolveFixture(fixture) {
  if (fixture.contractVersion !== 3) throw new Error("Incompatible Brand OS context: crft requires contractVersion 3; v1/v2 context recipes require explicit migration");
  const f = fixture.foundations;
  const min = dimension(f["fluid-min"], ["rem"]);
  const max = dimension(f["fluid-max"], ["rem"]);
  if (max <= min) throw new Error("Fluid range must increase");
  for (const key of ["type-ratio-min", "type-ratio-max"]) if (!Number.isFinite(f[key]) || f[key] <= 0) throw new Error("Ratios must be positive");
  const baseMin = dimension(f["type-min"], ["rem"]);
  const baseMax = dimension(f["type-max"], ["rem"]);
  return Object.fromEntries(Object.keys(roles).map((name) => {
    const role = fixture.roles[name];
    if (!role || !Number.isInteger(role.step)) throw new Error(`Missing role/step ${name}`);
    const literal = role.size ? dimension(role.size, ["rem"]) : undefined;
    const lo = literal ?? (role.min ? dimension(role.min, ["rem"]) : baseMin * f["type-ratio-min"] ** role.step);
    const hi = literal ?? (role.max ? dimension(role.max, ["rem"]) : baseMax * f["type-ratio-max"] ** role.step);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi < lo) throw new Error(`Invalid endpoints ${name}`);
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
  for (const [name, value] of Object.entries(fixture.foundations)) declarations.push(`--${name}: ${typeof value === "number" ? value : value.value};`);
  for (const [name, value] of Object.entries({ ...fixture.colors, ...fixture.fonts })) declarations.push(`--${name}: ${value};`);
  for (const [name, scale] of Object.entries(fixture.scales)) {
    dimension(scale.size, ["rem"]);
    if (!Number.isFinite(scale.ratio) || scale.ratio <= 0) throw new Error(`Invalid scale ratio ${name}`);
    declarations.push(`--${name}: ${scale.size.value}rem;`, `--${name}-ratio: ${scale.ratio};`);
  }
  for (const [name, role] of Object.entries(fixture.roles)) {
    declarations.push(`--${name}-step: ${role.step};`);
    for (const key of ["font", "weight", "leading", "case", "features", "axes", "optical-sizing"]) declarations.push(`--${name}-${key}: ${role[key]};`);
    for (const key of ["tracking", "measure"]) declarations.push(`--${name}-${key}: ${role[key].value}${role[key].unit};`);
    for (const key of ["min", "max"]) if (role[key]) declarations.push(`--${name}-${key}: ${role[key].value};`);
    if (resolved[name].staticRem !== undefined) declarations.push(`--${name}-size: ${resolved[name].staticRem}rem;`);
  }
  return declarations.join("\n");
}
