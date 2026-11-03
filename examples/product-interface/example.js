const filters = document.getElementById("filters");
const compose = document.getElementById("invite-form");
const state = document.getElementById("demo-state");
const results = document.getElementById("results");
const table = results.querySelector("table");
const rows = table.querySelector("tbody");
const status = document.getElementById("result-status");
const error = document.getElementById("result-error");
const retry = document.getElementById("retry");

function render() {
  const fields = new FormData(filters);
  const query = String(fields.get("q") ?? "").trim().toLowerCase();
  const filter = fields.get("status");
  let count = 0;
  for (const row of rows.rows) {
    row.hidden = !row.cells[0].textContent.toLowerCase().includes(query) || (filter !== "all" && row.cells[2].textContent !== filter);
    if (!row.hidden) count += 1;
  }
  results.setAttribute("aria-busy", String(state.value === "loading"));
  error.hidden = retry.hidden = state.value !== "error";
  table.hidden = state.value !== "ready" || count === 0;
  status.textContent = state.value === "loading" ? "Demo loading preview…" : state.value === "error" ? "" : state.value === "empty" || !count ? "No invitations match. Adjust filters or draft an invitation." : `${count} local invitation${count === 1 ? "" : "s"}.`;
}
filters.addEventListener("submit", (event) => { event.preventDefault(); state.value = "ready"; render(); });
filters.addEventListener("reset", () => { setTimeout(() => { state.value = "ready"; render(); }, 0); });
state.addEventListener("change", render);
retry.addEventListener("click", () => { state.value = "ready"; render(); state.focus(); });
compose.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(compose);
  const row = rows.insertRow();
  for (const value of [fields.get("email"), fields.get("role"), "Draft"]) row.insertCell().textContent = String(value);
  document.getElementById("draft-status").textContent = `Local draft created for ${fields.get("email")}. No email sent.`;
  filters.reset();
});
compose.addEventListener("reset", () => { document.getElementById("draft-status").textContent = ""; });
document.getElementById("appearance").addEventListener("change", (event) => { document.documentElement.style.colorScheme = event.target.value; });
// Start expanded without script; collapse navigation on narrow screens when enhanced.
const navigation = document.querySelector(".invites > header details");
const narrow = matchMedia("(width < 60rem)");
function resizeNavigation() {
  if (narrow.matches && navigation.contains(document.activeElement)) navigation.querySelector("summary").focus();
  navigation.open = !narrow.matches;
}
narrow.addEventListener("change", resizeNavigation);
resizeNavigation();
render();

document.getElementById("demo-runtime").hidden = true;
