const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Edit these lists to update the site */
const SKILLS = [
  { name: "C++", cat: "tech", level: 55, tag: "Core" },
  { name: "Python", cat: "tech", level: 50, tag: "Core" },
  { name: "Machine Learning", cat: "tech", level: 45, tag: "Core" },
  { name: "Deep Learning", cat: "tech", level: 35, tag: "Growing" },
  { name: "Data Analysis", cat: "tech", level: 45, tag: "Core" },
  { name: "Algorithms and Problem Solving", cat: "tech", level: 60, tag: "Strong" },
  { name: "System Thinking", cat: "systems", level: 65, tag: "Strong" },
  { name: "System Modeling", cat: "systems", level: 55, tag: "Core" },
  { name: "System Designing", cat: "systems", level: 50, tag: "Core" },
  { name: "AI Entrepreneurship", cat: "biz", level: 50, tag: "Core" },
  { name: "Product Thinking", cat: "biz", level: 45, tag: "Core" },
  { name: "Startup Strategy", cat: "biz", level: 40, tag: "Growing" }
];
// Sample certificates: replace with your real ones. Set SAMPLE_BADGE to false only when all are real.
const SAMPLE_BADGE = true;
const CERTS = [
  { title: "AI Hackathon Winner", org: "Sample Organizer", year: "2026", icon: "⚡" },
  { title: "C++ Programming Mastery", org: "Sample Academy", year: "2026", icon: "{ }" },
  { title: "Machine Learning Specialization", org: "Sample Platform", year: "2026", icon: "◈" },
  { title: "Deep Learning Essentials", org: "Sample Platform", year: "2026", icon: "∞" },
  { title: "Systems Thinking and Modeling", org: "Sample Institute", year: "2026", icon: "⌬" },
  { title: "System Design Fundamentals", org: "Sample Institute", year: "2026", icon: "▦" },
  { title: "AI Entrepreneurship Program", org: "Sample Startup Lab", year: "2026", icon: "✦" },
  { title: "Data Analysis with Python", org: "Sample Academy", year: "2026", icon: "∑" },
  { title: "Product and Startup Strategy", org: "Sample Startup Lab", year: "2026", icon: "↗" },
  { title: "Natural Language Processing Fundamentals", org: "Sample Platform", year: "2026", icon: "Aa" },
  { title: "Computer Vision with Python", org: "Sample Platform", year: "2026", icon: "◉" },
  { title: "Data Structures and Algorithms in C++", org: "Sample Academy", year: "2026", icon: "⌗" },
  { title: "Cloud and AI Practitioner", org: "Sample Cloud Institute", year: "2026", icon: "☁" },
  { title: "Git and GitHub for Developers", org: "Sample Academy", year: "2026", icon: "⑂" },
  { title: "Cybersecurity Essentials", org: "Sample Institute", year: "2026", icon: "⛨" }
];
const TYPED = ["machine learning", "C++ and algorithms", "system design", "AI products that solve real problems"];

/* Navigation */
const menuToggle = $("#menuToggle"), navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => { navLinks.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }));

/* Theme */
const root = document.documentElement, tt = $("#themeToggle");
const setTheme = t => { root.dataset.theme = t; tt.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme"); try { localStorage.setItem("theme", t); } catch (e) {} };
let saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
tt.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

/* Skills + filters */
const grid = $("#skillsGrid");
grid.innerHTML = SKILLS.map(s => `<div class="skill" data-cat="${s.cat}"><div class="skill-top"><strong>${s.name}</strong><span>${s.tag}</span></div><div class="bar" role="progressbar" aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100"><i data-w="${s.level}"></i></div></div>`).join("");
$$(".filter").forEach(b => b.addEventListener("click", () => {
  $$(".filter").forEach(x => x.classList.toggle("active", x === b));
  $$(".skill").forEach(s => s.classList.toggle("hide", b.dataset.filter !== "all" && s.dataset.cat !== b.dataset.filter));
}));

/* Certificates */
$("#certGrid").innerHTML = CERTS.map(c => `<article class="cert"><div class="cert-icon">${c.icon}</div>${SAMPLE_BADGE ? '<span class="sample">Sample</span>' : ""}<h3>${c.title}</h3><p>${c.org}</p><small>${c.year}</small></article>`).join("");

/* Typing effect */
(function () {
  const el = $("#typed"); let w = 0, c = 0, del = false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = TYPED[0]; return; }
  (function tick() {
    const word = TYPED[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % TYPED.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
})();

/* Reveal bars and count up stats when seen */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const t = e.target; io.unobserve(t);
  if (t.matches(".bar")) $("i", t).style.width = $("i", t).dataset.w + "%";
  if (t.matches("[data-count]")) { const n = +t.dataset.count; let i = 0; const id = setInterval(() => { t.textContent = ++i; if (i >= n) clearInterval(id); }, 220 / n + 40); }
}), { threshold: .4 });
$$(".bar, [data-count]").forEach(el => io.observe(el));

/* Back to top + footer year */
const top = $("#toTop");
addEventListener("scroll", () => top.classList.toggle("show", scrollY > 600), { passive: true });
top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
$("#year").textContent = new Date().getFullYear();

/* 3D: drag or move over the hero scene to turn it */
(function () {
  const scene = $("#scene"), stage = $(".stage", scene);
  const turn = e => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stage.style.setProperty("--ry", (24 + x * 70) + "deg");
    stage.style.setProperty("--rx", (-18 - y * 50) + "deg");
  };
  scene.addEventListener("pointermove", turn);
  scene.addEventListener("pointerleave", () => { stage.style.removeProperty("--ry"); stage.style.removeProperty("--rx"); });
})();

/* 3D: cards flip in on scroll and tilt toward the pointer */
(function () {
  const cards = $$(".project, .cert, .goal, .step, .skill, .timeline li");
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; ro.unobserve(el);
    const sib = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = (sib % 3) * 90 + "ms";
    el.classList.add("in");
    setTimeout(() => (el.style.transitionDelay = ""), 900);
  }), { threshold: .15 });
  cards.forEach(el => {
    el.classList.add("rv"); ro.observe(el);
    if (!el.matches(".project, .cert, .goal")) return;
    el.addEventListener("pointermove", e => {
      if (!el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(700px) rotateX(${(-y * 14).toFixed(1)}deg) rotateY(${(x * 14).toFixed(1)}deg) translateZ(12px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
})();

/* More 3D: glare on cards, floating shards, certificate tilt and zoom */
(function () {
  $$(".project, .cert, .goal").forEach(el => {
    const g = document.createElement("span"); g.className = "glare"; el.appendChild(g);
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100) + "%");
      el.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const box = $("#shards"), cols = ["", "c", "m"];
  const shards = Array.from({ length: 12 }, (_, i) => {
    const s = document.createElement("i");
    s.className = "shard " + cols[i % 3];
    const size = 30 + (i * 17) % 50;
    s.style.cssText = `--s:${size}px;left:${(i * 83) % 96}%;top:${(i * 47) % 90}%`;
    box.appendChild(s);
    return { s, k: .6 + (i % 5) * .35, z: (i % 4) * 60 - 80 };
  });
  const place = () => {
    const y = scrollY;
    shards.forEach(({ s, k, z }, i) => { s.style.transform = `translate3d(0,${-y * .08 * k}px,${z}px) rotateX(${y * .12 * k + i * 20}deg) rotateY(${y * .16 * k + i * 30}deg)`; });
  };
  place();
  if (!reduce) { let t = false; addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(() => { place(); t = false; }); } }, { passive: true }); }

  const card = $("#featureCard"), lb = $("#lightbox"), lbImg = $("img", lb);
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateX(${(-y * 16).toFixed(1)}deg) rotateY(${(x * 20).toFixed(1)}deg) translateZ(20px)`;
    card.style.setProperty("--gx", (x + .5) * 100 + "%"); card.style.setProperty("--gy", (y + .5) * 100 + "%");
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
  const open = () => { lbImg.src = $("img", card).src; lb.hidden = false; };
  const close = () => { lb.hidden = true; lbImg.style.transform = ""; };
  card.addEventListener("click", open);
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  lb.addEventListener("click", close);
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  lb.addEventListener("pointermove", e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    lbImg.style.transform = `rotateX(${(-y * 14).toFixed(1)}deg) rotateY(${(x * 18).toFixed(1)}deg)`;
  });
})();
