async function loadApps() {
  const res = await fetch("./apps.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load apps.json");
  return await res.json();
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

(async function init() {
  setYear();

  const grid = document.getElementById("appsGrid");
  const apps = await loadApps();

  Object.entries(apps).forEach(([slug, app]) => {
    const a = document.createElement("a");
    a.className = "app";
    a.href = `./${slug}/`;
    a.setAttribute("aria-label", `Open ${app.name} support page`);

    a.innerHTML = `
      <div class="icon">
        <img src="./${slug}/${app.icon || "icon.png"}" alt="${app.name} icon" />
      </div>
      <div class="meta">
        <p class="name">${app.name}</p>
        <p class="desc">${app.tagline || ""}</p>
      </div>
    `;

    grid.appendChild(a);
  });
})();
