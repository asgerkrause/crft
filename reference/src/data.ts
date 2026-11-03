interface Section {
  id: string;
  title: string;
  api: string;
}

export const sections = {
  colors: { id: "colors", title: "Colors", api: "semantic colors" },
  type: { id: "typography", title: "Typography", api: "roles · l" },
  sizes: { id: "sizes", title: "Sizes", api: "space · gap · padding · radius" },
  layout: { id: "layout", title: "Layout", api: ".c · .s" },
  grid: { id: "grid", title: "Grid", api: "g · c · r · o" },
  gridFallback: { id: "grid-no-container", title: "Grid fallback", api: "g without a container" },
  skins: { id: "skins", title: "Themes", api: "data-theme" },
  native: { id: "native", title: "Native", api: "elements first" },
  forms: { id: "forms", title: "Forms", api: "form · label · input · select · textarea" },
  motion: { id: "motion", title: "Motion", api: "data-scrub · view transitions" },
  utilities: { id: "utilities", title: "Utilities", api: ".sr" },
  architecture: { id: "architecture", title: "Architecture", api: "@layer" },
  tokens: { id: "tokens", title: "Tokens", api: "public names" },
} as const satisfies Record<string, Section>;

export const navigation = [{ id: "overview", title: "Overview" }, ...Object.values(sections)];

export const modes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export const presets = [
  { value: "claude", label: "Claude" },
  { value: "openai", label: "OpenAI" },
  { value: "github", label: "GitHub" },
  { value: "supabase", label: "Supabase" },
  { value: "core", label: "Default" },
] as const;
