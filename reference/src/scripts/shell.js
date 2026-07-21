const STORAGE_KEY = "snz-styleguide-preferences:v1";

function values(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]`), (input) => input.value);
}

function allowed(options, value, fallback) {
  return options.includes(value) ? value : fallback;
}

function readPreferences() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePreferences(preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    /* Preferences remain usable when storage is unavailable. */
  }
}

function setRadio(form, name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function applyPreferences(root, form, preferences) {
  root.setAttribute("data-mode", preferences.mode);
  root.setAttribute("data-preset", preferences.preset);
  setRadio(form, "mode", preferences.mode);
  setRadio(form, "preset", preferences.preset);
  savePreferences(preferences);
}

function installControlsPopover(form) {
  const button = document.querySelector(`[popovertarget="${form.id}"]`);
  if (!button) return;

  function syncExpanded(event) {
    const expanded = event ? event.newState === "open" : form.matches(":popover-open");
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  form.addEventListener("beforetoggle", syncExpanded);
  syncExpanded();
}

function installSectionNavigation() {
  const links = Array.from(document.querySelectorAll('.sg-logo[href^="#"], .sg-rail-nav a[href^="#"]'));
  const pairs = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((pair) => pair.section);
  if (!pairs.length) return;

  function setCurrent(section) {
    let currentLink;
    let changed = false;
    for (const pair of pairs) {
      if (pair.section === section) {
        currentLink = pair.link;
        changed = pair.link.getAttribute("aria-current") !== "location";
        pair.link.setAttribute("aria-current", "location");
      } else {
        pair.link.removeAttribute("aria-current");
      }
    }
    if (changed && currentLink.closest(".sg-rail-nav")) {
      currentLink.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function syncCurrent() {
    const activationLine = window.innerHeight * 0.25;
    let current = pairs[0].section;
    for (const pair of pairs) {
      if (pair.section.getBoundingClientRect().top <= activationLine) current = pair.section;
    }
    setCurrent(current);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(syncCurrent, {
      rootMargin: "-24% 0px -75% 0px",
      threshold: 0,
    });
    for (const pair of pairs) observer.observe(pair.section);
  }

  window.addEventListener("hashchange", syncCurrent);
  window.addEventListener("resize", syncCurrent);
  syncCurrent();
}

function installDialogFallback() {
  if ("commandForElement" in HTMLButtonElement.prototype) return;

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[commandfor][command]");
    if (!button) return;

    const dialog = document.getElementById(button.getAttribute("commandfor"));
    if (!dialog || dialog.nodeName !== "DIALOG") return;

    if (button.getAttribute("command") === "show-modal") {
      event.preventDefault();
      if (!dialog.open) dialog.showModal();
    }

    if (button.getAttribute("command") === "close") {
      event.preventDefault();
      if (dialog.open) dialog.close();
    }
  });
}

function init() {
  const root = document.documentElement;
  const form = document.getElementById("styleguide-preferences");
  if (!form) return;

  const stored = readPreferences();
  const modeValues = values(form, "mode");
  const presetValues = values(form, "preset");
  const preferences = {
    mode: allowed(modeValues, stored.mode || root.getAttribute("data-mode"), "system"),
    preset: allowed(presetValues, stored.preset || root.getAttribute("data-preset"), "core"),
  };

  applyPreferences(root, form, preferences);
  form.addEventListener("change", () => {
    const mode = form.querySelector('input[name="mode"]:checked');
    const preset = form.querySelector('input[name="preset"]:checked');
    applyPreferences(root, form, {
      mode: allowed(modeValues, mode?.value, "system"),
      preset: allowed(presetValues, preset?.value, "core"),
    });
  });

  installControlsPopover(form);
  installSectionNavigation();
  installDialogFallback();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
