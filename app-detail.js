function getAppIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("app");
}

async function loadApps() {
  const res = await fetch("./apps.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load apps.json");
  const json = await res.json();
  return json.apps || [];
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function mailto(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el) el.href = value ?? "#";
}

function showEl(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? "" : "none";
}

function youtubeEmbedUrlFromId(id) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

(async function init() {
  setYear();

  const appId = getAppIdFromUrl();
  const apps = await loadApps();
  const app = apps.find(a => a.id === appId);

  if (!app) {
    document.title = "App not found";
    setText("title", "App not found");
    setText("tagline", "This app ID doesn't exist.");
    setText("description", "Go back and pick an app from the list.");
    showEl("videoCard", false);
    showEl("reviewBtn", false);
    return;
  }

  // Page title/meta
  document.title = `Support — ${app.name}`;

  // Header
  setText("title", `Support — ${app.name}`);
  setText("tagline", "Help, questions, and feedback • EN / IT");

  // Icon
  const icon = document.getElementById("appIcon");
  icon.src = app.icon;
  icon.alt = `${app.name} icon`;

  // About
  setText("description", app.description || app.tagline || "");

  // App Store links
  setHref("appStoreTop", app.appStoreUrl);
  setHref("appStoreBtn", app.appStoreUrl);

  // Optional review button
  if (app.reviewUrl) {
    setHref("reviewBtn", app.reviewUrl);
    showEl("reviewBtn", true);
  } else {
    showEl("reviewBtn", false);
  }

  // Optional privacy button
  if (app.privacyUrl) {
    setHref("privacyBtn", app.privacyUrl);
    showEl("privacyBtn", true);
  } else {
    showEl("privacyBtn", false);
  }

  const storeUrl = app.appStoreUrl;

  if (!storeUrl || storeUrl === "#") {
    showEl("appStoreBtn", false);
    showEl("appStoreTop", false); // optional
  } else {
    setHref("appStoreTop", storeUrl);
    setHref("appStoreBtn", storeUrl);
    showEl("appStoreBtn", true);
    showEl("appStoreTop", true);
  }

  // Support email
  const email = app.supportEmail || "serj.tereshkin@gmail.com";

  const en = document.getElementById("supportEn");
  en.textContent = email;
  en.href = mailto(email, `${app.name} Support`);

  const it = document.getElementById("supportIt");
  it.textContent = email;
  it.href = mailto(email, `Supporto ${app.name}`);

  // Video (optional)
  if (app.youtubeId) {
    document.getElementById("youtubeFrame").src = youtubeEmbedUrlFromId(app.youtubeId);
    document.getElementById("youtubeLink").href = `https://www.youtube.com/watch?v=${app.youtubeId}`;
    showEl("videoCard", true);
  } else {
    showEl("videoCard", false);
  }
})();
