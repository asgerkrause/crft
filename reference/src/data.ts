interface Section {
  id: string;
  title: string;
  api: string;
  nav?: string;
}

export const sections = {
  colors: { id: "colors", title: "Colors", api: "semantic colors", nav: "Color" },
  type: { id: "typography", title: "Typography", api: "roles · l", nav: "Type" },
  sizes: { id: "sizes", title: "Sizes", api: "space · gap · padding · radius", nav: "Sizes" },
  layout: { id: "layout", title: "Layout", api: ".c · .s", nav: "Layout" },
  grid: { id: "grid", title: "Grid", api: "g · c · r · o" },
  skins: { id: "skins", title: "Skins", api: "data-skin", nav: "Skins" },
  native: { id: "native", title: "Native", api: "elements first", nav: "Defaults" },
  forms: { id: "forms", title: "Forms", api: "form · label · input · select · textarea", nav: "Forms" },
  motion: { id: "motion", title: "Motion", api: "data-scrub · view transitions" },
  utilities: { id: "utilities", title: "Utilities", api: ".sr" },
  architecture: { id: "architecture", title: "Architecture", api: "@layer" },
  tokens: { id: "tokens", title: "Tokens", api: "public names" },
} as const satisfies Record<string, Section>;

export const navigation = Object.values(sections).filter((section) => "nav" in section);

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
