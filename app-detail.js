function getSlugFromPath() {
  const clean = window.location.pathname.replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);

  // if user visits ".../encoding/index.html"
  let last = parts[parts.length - 1] || "";
  if (last.endsWith(".html")) last = parts[parts.length - 2] || last;

  return last;
}

async function loadAppData(slug) {
  const res = await fetch("../apps.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load apps.json");
  const data = await res.json();
  return data[slug];
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function mailto(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

(async function init() {
  setYear();

  const slug = getSlugFromPath();
  const app = await loadAppData(slug);

  if (!app) {
    document.title = "App not found";
    document.getElementById("pageTitle").textContent = "App not found";
    return;
  }

  // Title + meta
  document.title = `Support — ${app.name}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", `Support page for ${app.name}.`);

  // Header
  document.getElementById("pageTitle").textContent = `Support — ${app.name}`;
  document.getElementById("appIcon").src = `./${app.icon || "icon.png"}`;
  document.getElementById("appIcon").alt = `${app.name} icon`;

  // App Store
  const appStoreUrl = app.appStoreUrl || "#";
  document.getElementById("appStoreLinkTop").href = appStoreUrl;
  document.getElementById("appStoreBtn").href = appStoreUrl;

  // Support emails
  const email = app.supportEmail || "serj.tereshkin@gmail.com";
  const enSubject = `${app.name} Support`;
  const itSubject = `Supporto ${app.name}`;

  const enA = document.getElementById("supportEmailEn");
  enA.textContent = email;
  enA.href = mailto(email, enSubject);

  const itA = document.getElementById("supportEmailIt");
  itA.textContent = email;
  itA.href = mailto(email, itSubject);

  // YouTube (optional)
  if (app.youtubeId) {
    const videoCard = document.getElementById("videoCard");
    const frame = document.getElementById("youtubeFrame");
    const link = document.getElementById("youtubeLink");

    frame.src = `https://www.youtube-nocookie.com/embed/${app.youtubeId}`;
    link.href = `https://www.youtube.com/watch?v=${app.youtubeId}`;
    videoCard.style.display = "";
  }
})();
