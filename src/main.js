import "./style.css";
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, Points, PointsMaterial,
  CanvasTexture, SRGBColorSpace, Color, SphereGeometry, Mesh, MeshStandardMaterial, MeshBasicMaterial,
  DirectionalLight, AmbientLight, BoxGeometry, PlaneGeometry, InstancedMesh, Object3D, Group,
  BackSide, DoubleSide, AdditiveBlending, MathUtils,
} from "three";
import { config } from "./config.js";
import { art } from "./art.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const root = document.documentElement;

/* ---------- content from config ---------- */
document.title = `Happy Birthday ${config.name}`;
$("#forName").textContent = `for ${config.name}`;
$("#from").textContent = `with all my love, ${config.from}`;

$$("[data-split] > span").forEach((line, li) => {
  line.innerHTML = [...line.textContent]
    .map((c, i) => `<i class="ch" aria-hidden="true" style="--i:${li * 6 + i}">${c}</i>`)
    .join("");
});

$("#memories").innerHTML = config.photos
  .map(
    (p, i) => `
  <article class="card pop">
    <span class="tape" style="--tape:${i % 2 ? 5 : -4}deg"></span>
    <div class="photo p${i % 6}">${
      p.src ? `<img src="${p.src}" alt="${p.title}" loading="lazy">` : `<span class="ph">your photo goes here</span>`
    }</div>
    <div class="cap"><h3>${p.title}</h3><p>${p.text}</p></div>
    <svg class="sticker" aria-hidden="true"><use href="#${i % 2 ? "heart" : "star"}"/></svg>
  </article>`
  )
  .join("");

$("#note").insertAdjacentHTML(
  "beforeend",
  config.note
    .map((t, i) => `<p class="pop" style="--tilt:${[-2, 2, -1][i % 3]}deg;--d:${i * 120}ms">${t}</p>`)
    .join("")
);

$$("[data-art]").forEach((el) => el.insertAdjacentHTML("afterbegin", art[el.dataset.art]));
$("#cake").innerHTML = art.cake;

// star, heart: [symbol, colour, size, top, left, parallax speed, rotation]
[
  ["star", "var(--gold)", 44, "12%", "8%", -0.12, "10deg"],
  ["heart", "var(--pink)", 36, "20%", "78%", -0.2, "-12deg"],
  ["star", "var(--sky)", 28, "70%", "12%", -0.08, "0deg"],
  ["heart", "var(--lilac)", 40, "78%", "74%", -0.16, "14deg"],
  ["star", "var(--pink)", 26, "42%", "88%", -0.1, "0deg"],
  ["star", "var(--paper)", 22, "36%", "6%", -0.14, "0deg"],
].forEach(([id, c, s, top, left, k, rot]) =>
  $("#hero").insertAdjacentHTML(
    "beforeend",
    `<svg class="fl" aria-hidden="true" style="--c:${c};--s:${s}px;top:${top};left:${left};--k:${k};--rot:${rot}"><use href="#${id}"/></svg>`
  )
);

/* ---------- scroll triggered pop ins ---------- */
let burst = () => {};
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      if (e.target.id === "finale") burst();
    }),
  { threshold: 0.25, rootMargin: "0px 0px -6% 0px" }
);
$$(".pop, #finale").forEach((el) => io.observe(el));

/* ---------- three.js night sky ---------- */
function sparkleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  x.fillStyle = "#fff";
  x.beginPath();
  [[32, 0], [38, 26], [64, 32], [38, 38], [32, 64], [26, 38], [0, 32], [26, 26]].forEach(([a, b], i) =>
    i ? x.lineTo(a, b) : x.moveTo(a, b)
  );
  x.closePath();
  x.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function createSky() {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas: $("#sky"), antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (err) {
    return null; // no WebGL: the CSS gradient sky stays
  }
  const small = innerWidth < 768;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 400);

  // four point sparkle stars
  const N = small ? 700 : 1400;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const palette = ["#fff6e5", "#ffd34d", "#ff8fc4", "#b69cff", "#7fd8ff"].map((c) => new Color(c));
  for (let i = 0; i < N; i++) {
    pos.set([(Math.random() - 0.5) * 170, (Math.random() - 0.5) * 170, -12 - Math.random() * 130], i * 3);
    const c = palette[(Math.random() * palette.length) | 0];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("color", new BufferAttribute(col, 3));
  const stars = new Points(
    geo,
    new PointsMaterial({ size: 1.3, map: sparkleTexture(), vertexColors: true, transparent: true, depthWrite: false, alphaTest: 0.05 })
  );
  stars.frustumCulled = false;
  scene.add(stars);

  // the moon waxes from a thin crescent to full as you scroll
  const moon = new Mesh(
    new SphereGeometry(4.2, 48, 48),
    new MeshStandardMaterial({ color: "#fff1c2", roughness: 1, emissive: "#3a2f55", emissiveIntensity: 0.6 })
  );
  moon.position.set(0, 3, -24);
  const halo = new Mesh(
    new SphereGeometry(5.6, 32, 32),
    new MeshBasicMaterial({ color: "#ffd9a0", transparent: true, opacity: 0.12, side: BackSide, blending: AdditiveBlending, depthWrite: false })
  );
  halo.position.copy(moon.position);
  const sun = new DirectionalLight("#fff6e5", 3);
  sun.target = moon;
  scene.add(moon, halo, sun, new AmbientLight("#4b3a7a", 0.6));

  // floating lanterns drift upward as you scroll
  const box = new BoxGeometry(0.7, 0.95, 0.7);
  const glow = new MeshBasicMaterial({ color: "#ffb347", transparent: true, opacity: 0.18, blending: AdditiveBlending, depthWrite: false });
  const mats = ["#ffd34d", "#ff8fc4", "#fff1c2"].map((c) => new MeshBasicMaterial({ color: c }));
  const lanterns = [];
  for (let i = 0; i < (small ? 22 : 40); i++) {
    const g = new Group();
    g.add(new Mesh(box, mats[i % 3]));
    const h = new Mesh(box, glow);
    h.scale.setScalar(2);
    g.add(h);
    g.scale.setScalar(0.6 + Math.random() * 1.1);
    g.userData = { x: (Math.random() - 0.5) * 36, y: Math.random() * 60, z: -4 - Math.random() * 34, sp: 0.5 + Math.random() };
    scene.add(g);
    lanterns.push(g);
  }

  // square confetti for the finale
  const CN = 150;
  const conf = new InstancedMesh(new PlaneGeometry(0.35, 0.35), new MeshBasicMaterial({ side: DoubleSide }), CN);
  const cc = ["#ffd34d", "#ff6fae", "#b69cff", "#7fd8ff", "#fff6e5", "#ff4d3d"].map((c) => new Color(c));
  const bits = [];
  for (let i = 0; i < CN; i++) {
    conf.setColorAt(i, cc[i % cc.length]);
    bits.push({});
  }
  conf.instanceColor.needsUpdate = true;
  conf.frustumCulled = false;
  conf.visible = false;
  scene.add(conf);
  const dummy = new Object3D();
  let confLeft = 0;

  let lastW = 0;
  let lastH = 0;
  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 120) return; // ignore mobile URL bar wobble
    lastW = w;
    lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  return {
    resize,
    burst() {
      bits.forEach((b) =>
        Object.assign(b, {
          x: (Math.random() - 0.5) * 8, y: 2 + Math.random() * 8, z: Math.random() * 7 - 2,
          vy: -(1.2 + Math.random() * 2.2), r: Math.random() * 6, vr: (Math.random() - 0.5) * 6, ph: Math.random() * 6,
        })
      );
      conf.visible = true;
      confLeft = 8;
    },
    update(p, t, dt) {
      camera.position.set(Math.sin(p * 6) * 1.2, Math.cos(p * 4) * 0.6, 18 - p * 10);
      camera.rotation.z = Math.sin(p * 5) * 0.05;
      stars.rotation.set(0, p * 0.5 + t * 0.01, p * 0.2);

      const a = MathUtils.lerp(2.6, 0.15, p);
      sun.position.set(moon.position.x + Math.sin(a) * 10, moon.position.y + 2, moon.position.z + Math.cos(a) * 10);

      lanterns.forEach((g) => {
        const d = g.userData;
        g.position.set(d.x + Math.sin(t * 0.6 + d.y) * 0.8, ((d.y + p * 90 * d.sp + t * 0.6 * d.sp) % 60) - 20, d.z);
        g.rotation.set(0, t * 0.4 + d.x, Math.sin(t + d.y) * 0.15);
      });

      if (confLeft > 0) {
        confLeft -= dt;
        bits.forEach((b, i) => {
          b.y += b.vy * dt;
          b.r += b.vr * dt;
          b.x += Math.sin(t * 2 + b.ph) * 0.01;
          dummy.position.set(b.x, b.y, b.z);
          dummy.rotation.set(b.r, b.r * 0.7, b.r * 0.4);
          dummy.updateMatrix();
          conf.setMatrixAt(i, dummy.matrix);
        });
        conf.instanceMatrix.needsUpdate = true;
        if (confLeft <= 0) conf.visible = false;
      }
      renderer.render(scene, camera);
    },
  };
}

/* ---------- scroll driven loop ---------- */
const sky = createSky();
if (sky) burst = () => sky.burst();

const tracks = [...$$(".track")];
let maxScroll = 1;
let offsets = [];
let sp = 0;
let last = performance.now();
let lastWidth = 0;

function fillTracks() {
  tracks.forEach((t) => {
    const unit = `<span>${t.dataset.text}</span><svg class="ico" aria-hidden="true"><use href="#star"/></svg>`;
    t.innerHTML = unit;
    const w = t.offsetWidth || 200;
    t.innerHTML = unit.repeat(Math.ceil((innerWidth + 0.35 * maxScroll + 300) / w) + 1);
  });
  offsets = tracks.map((t, i) => (i % 2 ? -(t.offsetWidth - innerWidth) : 0));
}

function measure() {
  maxScroll = Math.max(1, root.scrollHeight - innerHeight);
  if (innerWidth !== lastWidth) {
    lastWidth = innerWidth;
    fillTracks();
  }
  if (sky) sky.resize();
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  const y = scrollY;
  sp += (Math.min(1, y / maxScroll) - sp) * (reduce ? 1 : 0.08);
  if (!reduce) {
    root.style.setProperty("--scroll", y.toFixed(1));
    tracks.forEach((t, i) => (t.style.transform = `translate3d(${offsets[i] + (i % 2 ? y : -y) * 0.35}px,0,0)`));
  }
  if (sky) sky.update(sp, reduce ? 0 : now / 1000, dt);
  if (!reduce) requestAnimationFrame(frame);
}

measure();
addEventListener("resize", () => {
  measure();
  if (reduce) requestAnimationFrame(frame);
});
addEventListener("load", measure);
if (document.fonts) document.fonts.ready.then(measure);

if (reduce) {
  $$(".pop").forEach((el) => el.classList.add("in"));
  addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });
}
requestAnimationFrame(frame);
