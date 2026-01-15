function setYear(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = new Date().getFullYear();
}

function getSelectedAppId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("app");
}

function pushAppToUrl(appId) {
  const url = new URL(window.location.href);
  url.searchParams.set("app", appId);
  window.history.pushState({}, "", url);
}

function clearAppFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("app");
  window.history.pushState({}, "", url.pathname);
}

function mailto(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

async function loadApps() {
  const res = await fetch("./apps.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load apps.json");
  const json = await res.json();
  return json.apps || [];
}

function show(viewId) {
  document.getElementById("listView").style.display = viewId === "list" ? "" : "none";
  document.getElementById("detailView").style.display = viewId === "detail" ? "" : "none";
}

function renderList(apps) {
  const grid = document.getElementById("appsGrid");
  grid.innerHTML = "";

  apps.forEach(app => {
    const a = document.createElement("a");
    a.className = "app";
    a.href = `./?app=${encodeURIComponent(app.id)}`;
    a.setAttribute("aria-label", `Open ${app.name} support page`);

    a.innerHTML = `
      <div class="icon">
        <img src="${app.icon}" alt="${app.name} icon" />
      </div>
      <div class="meta">
        <p class="name">${app.name}</p>
        <p class="desc">${app.tagline || ""}</p>
      </div>
    `;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      pushAppToUrl(app.id);
      render(apps);
    });

    grid.appendChild(a);
  });
}

function renderDetail(app) {
  document.title = `Support — ${app.name}`;

  document.getElementById("detailTitle").textContent = `Support — ${app.name}`;
  document.getElementById("detailTagline").textContent = app.tagline || "Help, questions, and feedback • EN / IT";
  document.getElementById("detailDescription").textContent = app.description || app.tagline || "";

  const icon = document.getElementById("detailIcon");
  icon.src = app.icon;
  icon.alt = `${app.name} icon`;

  // App Store links
  document.getElementById("detailAppStoreTop").href = app.appStoreUrl || "#";
  document.getElementById("detailAppStoreBtn").href = app.appStoreUrl || "#";

  // Support emails
  const email = app.supportEmail || "serj.tereshkin@gmail.com";

  const enLink = document.getElementById("supportEmailEn");
  enLink.textContent = email;
  enLink.href = mailto(email, `${app.name} Support`);

  const itLink = document.getElementById("supportEmailIt");
  itLink.textContent = email;
  itLink.href = mailto(email, `Supporto ${app.name}`);

  // Video (optional)
  const videoCard = document.getElementById("videoCard");
  if (app.youtubeId) {
    document.getElementById("youtubeFrame").src =
      `https://www.youtube-nocookie.com/embed/${app.youtubeId}`;
    document.getElementById("youtubeLink").href =
      `https://www.youtube.com/watch?v=${app.youtubeId}`;
    videoCard.style.display = "";
  } else {
    videoCard.style.display = "none";
  }
}

async function render(apps) {
  const selected = getSelectedAppId();

  if (!selected) {
    document.title = "Apps — johnshade-himself";
    show("list");
    renderList(apps);
    return;
  }

  const app = apps.find(a => a.id === selected);
  if (!app) {
    // fallback to list if unknown id
    clearAppFromUrl();
    show("list");
    renderList(apps);
    return;
  }

  show("detail");
  renderDetail(app);
}

(async function init() {
  setYear("year");
  setYear("year2");

  const apps = await loadApps();

  // Back pill behavior (no reload)
  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearAppFromUrl();
    render(apps);
  });

  // Handle browser back/forward
  window.addEventListener("popstate", () => render(apps));

  // First render
  render(apps);
})();
