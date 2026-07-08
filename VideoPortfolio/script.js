// =========================================================
// KRAXX Portfolio — interactions
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.classList.toggle("active", isOpen);
    });

    siteNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Floating decorative icons in About ---------- */
  const floatWrap = document.getElementById("floatingIcons");
  if (floatWrap) {
    const icons = ["🎬", "🎞️", "✂️", "✨", "▶", "🎚️"];
    icons.forEach((icon, i) => {
      const el = document.createElement("span");
      el.className = "float-icon";
      el.textContent = icon;
      el.style.top = `${10 + Math.random() * 75}%`;
      el.style.left = `${5 + Math.random() * 88}%`;
      el.style.animationDelay = `${i * 1.4}s`;
      el.style.animationDuration = `${12 + Math.random() * 8}s`;
      floatWrap.appendChild(el);
    });
  }
  //Portfolio section:-
  const portfolioItems = [
    { title: "All The Stars — Kendrick Lama", category: "cinematic", duration: "00:29",
      youtube: "BJyWQ0Dtu90",
      gradient: "linear-gradient(135deg,#1e3a8a,#0f172a)" },
    { title: "Duvet — Jujutsu Kaisen", category: "cinematic", duration: "00:44",
      youtube: "mT4AjUqRhhQ",
      gradient: "linear-gradient(135deg,#0f172a,#3b82f6)" },
    { title: "Sem controle — MoonKnight", category: "shorts", duration: "00:15",
      youtube: "YoiR7S8MMGY",
      gradient: "linear-gradient(135deg,#7c2d12,#fb923c)" },
     { title: "Fein — Travis scott", category: "shorts", duration: "00:45",
      youtube: "IcAgtUKIzeU",
      gradient: "linear-gradient(135deg,#9a3412,#f97316)" },
    { title: "Super 30 — Memory reboot", category: "shorts", duration: "00:52",
      youtube: "QideSziqv80",
      gradient: "linear-gradient(135deg,#78350f,#facc15)" },
    { title: "The Conjuring", category: "Cinematic", duration: "00:45",
      youtube: "1OVIENkIdUI",
      gradient: "linear-gradient(135deg,#7c2d12,#fb923c)" }
  ];

  const grid = document.getElementById("video-grid");
  const categoryButtons = document.querySelectorAll(".category-card");

  // Stops whichever card is currently playing and restores its thumbnail.
  function stopAllPlayers() {
    if (!grid) return;
    grid.querySelectorAll(".video-thumb.is-playing").forEach(thumb => {
      const player = thumb.querySelector("video, iframe");
      if (player) player.remove();
      const closeBtn = thumb.querySelector(".thumb-close");
      if (closeBtn) closeBtn.remove();
      thumb.classList.remove("is-playing");
    });
  }

  // Plays the video directly inside the given .video-thumb element (in-card playback).
  function playInThumb(thumb, item) {
    // If this exact card is already playing, do nothing.
    if (thumb.classList.contains("is-playing")) return;

    stopAllPlayers(); // only one card plays at a time

    let player;
    if (item.video) {
      player = document.createElement("video");
      player.src = item.video;
      player.controls = true;
      player.autoplay = true;
      player.playsInline = true;
    } else if (item.youtube) {
      player = document.createElement("iframe");
      player.src = `https://www.youtube.com/embed/${item.youtube}?autoplay=1&rel=0`;
      player.allow = "autoplay; fullscreen; picture-in-picture";
      player.allowFullscreen = true;
    } else if (item.vimeo) {
      player = document.createElement("iframe");
      player.src = `https://player.vimeo.com/video/${item.vimeo}?autoplay=1`;
      player.allow = "autoplay; fullscreen; picture-in-picture";
      player.allowFullscreen = true;
    } else {
      return; // no video attached to this item yet
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "thumb-close";
    closeBtn.setAttribute("aria-label", "Stop video");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      stopAllPlayers();
    });

    thumb.classList.add("is-playing");
    thumb.appendChild(player);
    thumb.appendChild(closeBtn);
  }

  function renderGrid(filter) {
    if (!grid) return;
    grid.innerHTML = "";
    portfolioItems
      .filter(item => filter === "all" || item.category === filter)
      .forEach(item => {
        const card = document.createElement("div");
        card.className = "video-card";

        const thumbStyle = item.poster
          ? `background-image:url('${item.poster}')`
          : `background:${item.gradient}`;

        card.innerHTML = `
          <div class="video-thumb" style="${thumbStyle}">
            <div class="play-btn"></div>
            <span class="duration">${item.duration}</span>
          </div>
          <div class="video-info">
            <h4>${item.title}</h4>
            <span class="video-tag">${item.category}</span>
          </div>
        `;

        const thumb = card.querySelector(".video-thumb");
        thumb.addEventListener("click", () => playInThumb(thumb, item));
        grid.appendChild(card);
      });
  }

  renderGrid("all");

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGrid(btn.dataset.filter);
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector("button[type='submit']");
      const name = document.getElementById("name").value.trim();

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = "Sending...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          if (status) {
            status.textContent = `Thanks${name ? ", " + name : ""} — your message has been sent. I'll reply within 24 hours.`;
          }
          form.reset();
        } else {
          if (status) {
            status.textContent = "Something went wrong — please email me directly instead.";
          }
        }
      } catch (err) {
        if (status) {
          status.textContent = "Network error — please check your connection and try again.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

});
