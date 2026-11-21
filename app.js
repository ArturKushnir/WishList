import { ITEMS, CATS, BOOKS } from "./data.js";
import { firebaseConfig } from "./firebase-config.js";

// Мінімальний захист: у коді зберігається не пароль, а SHA-256 від "пошта:пароль".
const ADMIN_HASH = "c160889f1e1d2ab273efde4b73a13929bb94e4dc4e9f5247b371d1e2c0cabdca";
const FB = "https://www.gstatic.com/firebasejs/10.12.2/";

const $ = (s) => document.querySelector(s);
const app = $("#app"), note = $("#note"), tabs = $("#tabs");
const BUILTIN = new Set(ITEMS.map((i) => i.id));

// ---------- localStorage (безпечні обгортки) ----------
const mem = {};
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return mem[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { mem[k] = v; } },
  del(k) { try { localStorage.removeItem(k); } catch { delete mem[k]; } },
};
let uid = ls.get("wl_uid");
if (!uid) { uid = Math.random().toString(36).slice(2) + Date.now().toString(36); ls.set("wl_uid", uid); }
let isAdmin = ls.get("wl_admin") === ADMIN_HASH;

// ---------- Сховище: Firestore або демо (localStorage) ----------
let overrides = {}, res = {}, ready = false;

function localStore() {
  const read = (k) => { try { return JSON.parse(ls.get(k) || "{}"); } catch { return {}; } };
  const subs = { items: [], res: [] };
  const emit = (k) => subs[k].forEach((cb) => cb(read("wl_" + k)));
  const write = (k, fn) => { const o = read("wl_" + k); fn(o); ls.set("wl_" + k, JSON.stringify(o)); emit(k); };
  addEventListener("storage", (e) => { if (e.key === "wl_items") emit("items"); if (e.key === "wl_res") emit("res"); });
  return {
    demo: true,
    watch(k, cb) { subs[k].push(cb); cb(read("wl_" + k)); },
    async saveItem(id, data) { write("items", (o) => { o[id] = { ...(o[id] || {}), ...data }; }); },
    async removeItem(id) { write("items", (o) => { if (BUILTIN.has(id)) o[id] = { deleted: true }; else delete o[id]; }); write("res", (o) => { delete o[id]; }); },
    async reserve(id) {
      let taken = false;
      write("res", (o) => { if (o[id]) taken = true; else o[id] = { by: uid, at: Date.now() }; });
      if (taken) throw new Error("taken");
    },
    async unreserve(id) { write("res", (o) => { delete o[id]; }); },
  };
}

async function firebaseStore(cfg) {
  const { initializeApp } = await import(FB + "firebase-app.js");
  const fs = await import(FB + "firebase-firestore.js");
  const db = fs.getFirestore(initializeApp(cfg));
  const col = (k) => fs.collection(db, k === "res" ? "reservations" : "items");
  return {
    demo: false,
    watch(k, cb) {
      fs.onSnapshot(col(k), (s) => { const o = {}; s.forEach((d) => { o[d.id] = d.data(); }); cb(o); },
        (err) => { console.error(err); showNote("Не вдалося підключитися до бази. Перевір налаштування Firebase (див. README)."); });
    },
    async saveItem(id, data) { await fs.setDoc(fs.doc(db, "items", id), data, { merge: true }); },
    async removeItem(id) {
      const ref = fs.doc(db, "items", id);
      if (BUILTIN.has(id)) await fs.setDoc(ref, { deleted: true }); else await fs.deleteDoc(ref);
      await fs.deleteDoc(fs.doc(db, "reservations", id));
    },
    async reserve(id) {
      const ref = fs.doc(db, "reservations", id);
      await fs.runTransaction(db, async (t) => {
        if ((await t.get(ref)).exists()) throw new Error("taken");
        t.set(ref, { by: uid, at: Date.now() });
      });
    },
    async unreserve(id) { await fs.deleteDoc(fs.doc(db, "reservations", id)); },
  };
}

let store = null;

// ---------- Дані ----------
function allItems() {
  const list = ITEMS.map((b) => (overrides[b.id] ? { ...b, ...overrides[b.id] } : b));
  const custom = Object.entries(overrides)
    .filter(([id]) => !BUILTIN.has(id))
    .map(([id, d]) => ({ ...d, id }))
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return list.concat(custom).filter((i) => !i.deleted && i.n);
}

// ---------- Рендер ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");
const safeImg = (u) => (/^(https?:\/\/|img\/|data:image\/)/i.test(u || "") ? u : "");

const S = (b) => `<svg viewBox="0 0 100 100" width="70%" height="70%" fill="none" stroke-linecap="round" aria-hidden="true">${b}</svg>`;
const G = 'fill="#dff1ff" stroke="#aab2bd" stroke-width="2"';
const ART = {
  "j-blackwhite": S(`<circle cx="50" cy="60" r="22" stroke="#aab2bd" stroke-width="6"/><circle cx="50" cy="60" r="22" stroke="#e8ecf1" stroke-width="1.5"/><polygon points="50,18 61,30 50,44 39,30" ${G}/>`),
  "j-palko": S(`<path d="M18 18Q50 80 82 18" stroke="#aab2bd" stroke-width="2.5" stroke-dasharray="1 4"/><path d="M50 54C41 64 41 76 50 79C59 76 59 64 50 54Z" ${G}/>`),
  "j-moe": S(`<circle cx="32" cy="48" r="17" stroke="#aab2bd" stroke-width="4"/><circle cx="68" cy="48" r="17" stroke="#aab2bd" stroke-width="4"/><circle cx="32" cy="72" r="4" ${G}/><circle cx="68" cy="72" r="4" ${G}/>`),
  "j-yolo": S(`<ellipse cx="50" cy="30" rx="28" ry="8" stroke="#aab2bd" stroke-width="5"/><ellipse cx="50" cy="50" rx="28" ry="8" stroke="#c9d0d9" stroke-width="5"/><ellipse cx="50" cy="70" rx="28" ry="8" stroke="#aab2bd" stroke-width="5"/>`),
};

function card(i) {
  const r = res[i.id], mine = r && r.by === uid;
  const url = safeUrl(i.u), img = safeImg(i.img);
  const pic = img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ART[i.id] || esc(i.e || "🎁");
  const phOpen = url ? `<a class="ph" href="${esc(url)}" target="_blank" rel="noopener">`
    : `<div class="ph"${i.list ? ' data-list="1" style="cursor:pointer"' : ""}>`;
  const phClose = url ? "</a>" : "</div>";

  let book = "";
  if (ready && !i.list) {
    if (r && (mine || isAdmin)) book = `<button data-id="${esc(i.id)}" data-a="off">${mine ? "Скасувати бронь" : "Зняти бронь"}</button>`;
    else if (r) book = `<button disabled>Заброньовано</button>`;
    else book = `<button class="main" data-id="${esc(i.id)}" data-a="on">Забронювати</button>`;
  }
  const link = url ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${i.shop ? "Магазин" : "Де замовити"}</a>` : "";
  const list = i.list ? `<button class="main" data-list="1">Список книжок</button>` : "";
  const btns = link || book || list ? `<div class="btns">${link}${list}${book}</div>` : "";
  const price = i.p ? esc(i.p) : i.shop || !url ? "" : "ціна на сайті";
  const tools = isAdmin ? `<div class="tools"><button data-edit="${esc(i.id)}" title="Редагувати" aria-label="Редагувати">✏️</button><button data-del="${esc(i.id)}" title="Видалити" aria-label="Видалити">🗑️</button></div>` : "";

  return `<div class="card${r ? " res" : ""}">${tools}${phOpen}${pic}${r ? '<span class="badge">Заброньовано</span>' : ""}${phClose}
  <div class="body"><div class="name">${esc(i.n)}</div>${i.m ? `<div class="meta">${esc(i.m)}</div>` : ""}
  <div class="price">${price}</div>${btns}</div></div>`;
}

function render() {
  const items = allItems();
  app.innerHTML = CATS.map((c) => {
    const list = items.filter((i) => i.cat === c.name);
    return `<section id="${c.slug}" data-cat="${esc(c.name)}"><h2>${esc(c.name)}</h2>${c.note ? `<p class="cnote">${esc(c.note)}</p>` : ""}
      ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<p class="empty">Тут поки нічого немає.</p>`}</section>`;
  }).join("");
  onScroll();
}

function renderTabs() {
  tabs.innerHTML = CATS.map((c) => `<a class="tab" href="#${c.slug}" data-slug="${c.slug}">${esc(c.name)}</a>`).join("");
}
tabs.addEventListener("click", (e) => {
  const t = e.target.closest(".tab"); if (!t) return;
  e.preventDefault();
  document.getElementById(t.dataset.slug)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", "#" + t.dataset.slug);
  setActive(t.dataset.slug);
  lockUntil = Date.now() + 900; // не перемикати підсвітку, поки йде плавна прокрутка
});

// Активна вкладка під час прокрутки
let activeSlug = "", lockUntil = 0;
function onScroll() {
  if (Date.now() < lockUntil) return;
  const secs = [...app.querySelectorAll("section")];
  let cur = secs[0]?.id || "";
  const edge = navH() + 20;
  for (const s of secs) if (s.getBoundingClientRect().top <= edge) cur = s.id;
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4 && secs.length) cur = secs[secs.length - 1].id;
  setActive(cur);
}
function setActive(cur) {
  if (cur === activeSlug) return;
  activeSlug = cur;
  tabs.querySelectorAll(".tab").forEach((t) => {
    const on = t.dataset.slug === cur;
    t.classList.toggle("on", on);
    if (on) tabs.scrollTo({ left: t.offsetLeft - tabs.clientWidth / 2 + t.clientWidth / 2, behavior: "smooth" });
  });
}
addEventListener("scroll", onScroll, { passive: true });

// ---------- Дрібниці UI ----------
function showNote(t) { note.textContent = t; note.hidden = !t; }
let toastT;
function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2800); }
function openDlg(el) { el.hidden = false; el.querySelector("input,select,button")?.focus(); }
function closeDlg(el) { el.hidden = true; }
document.querySelectorAll(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) closeDlg(d); }));
addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".dlg:not([hidden])").forEach(closeDlg); });

const navH = () => document.querySelector("nav").offsetHeight;
// Щоб заголовок розділу не ховався під липким меню
const fitScrollPadding = () => { document.documentElement.style.scrollPaddingTop = navH() + 8 + "px"; };
addEventListener("resize", fitScrollPadding);

function updateAdminUI() {
  $("#addBtn").hidden = !isAdmin;
  $("#loginBtn").hidden = isAdmin;
  $("#logoutBtn").hidden = !isAdmin;
  fitScrollPadding();
}

// ---------- Книжки ----------
function showBooks() {
  $("#dlist").innerHTML = BOOKS.length ? BOOKS.map((b, k) => `<div class="bk"><div class="bn">${k + 1}</div><div class="bi"><div class="bt">${esc(b.t)}</div><div class="ba">${esc(b.a)}</div><div class="bp">${esc(b.p)}</div></div><a class="btn" href="${esc(safeUrl(b.u))}" target="_blank" rel="noopener">Де замовити</a></div>`).join("") : '<p class="meta">Список ще формується.</p>';
  openDlg($("#booksDlg"));
}

// ---------- Кліки по картках ----------
app.addEventListener("click", async (e) => {
  if (e.target.closest("[data-list]")) return showBooks();

  const ed = e.target.closest("[data-edit]");
  if (ed && isAdmin) return openItemForm(ed.dataset.edit);

  const del = e.target.closest("[data-del]");
  if (del && isAdmin) {
    const it = allItems().find((i) => i.id === del.dataset.del);
    if (!it || !confirm(`Видалити «${it.n}» з вішліста?`)) return;
    try { await store.removeItem(it.id); toast("Видалено"); } catch (err) { console.error(err); toast("Не вдалося видалити"); }
    return;
  }

  const b = e.target.closest("button[data-id]");
  if (!b || !store) return;
  b.disabled = true;
  try {
    if (b.dataset.a === "on") { await store.reserve(b.dataset.id); toast("Заброньовано 💝 Дякую!"); }
    else {
      if (isAdmin && res[b.dataset.id]?.by !== uid && !confirm("Зняти чужу бронь з цього товару?")) { b.disabled = false; return; }
      await store.unreserve(b.dataset.id); toast("Бронь скасовано");
    }
  } catch (err) {
    console.error(err);
    toast(err.message === "taken" ? "Ой, цей подарунок щойно хтось забронював" : "Не вдалося зберегти. Спробуй ще раз.");
    b.disabled = false;
  }
});

// ---------- Вхід адміна ----------
async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
$("#loginBtn").addEventListener("click", () => { $("#loginErr").textContent = ""; $("#loginForm").reset(); openDlg($("#loginDlg")); });
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target, h = await sha256(f.email.value.trim().toLowerCase() + ":" + f.password.value);
  if (h !== ADMIN_HASH) { $("#loginErr").textContent = "Невірна пошта або пароль"; return; }
  isAdmin = true; ls.set("wl_admin", h); updateAdminUI(); closeDlg($("#loginDlg")); render(); toast("Привіт! Тепер можна додавати товари ✨");
});
$("#logoutBtn").addEventListener("click", () => { isAdmin = false; ls.del("wl_admin"); updateAdminUI(); render(); });

// ---------- Форма товару ----------
const form = $("#itemForm");
let editId = null, imgData = "";
$("#catSel").innerHTML = CATS.map((c) => `<option>${esc(c.name)}</option>`).join("");
$("#addBtn").addEventListener("click", () => openItemForm(null));

function setPreview(src) {
  imgData = src || "";
  $("#imgPrev").hidden = !imgData;
  $("#imgPrev img").src = imgData || "";
}

function openItemForm(id) {
  if (!isAdmin) return;
  editId = id;
  form.reset(); $("#itemErr").textContent = "";
  const it = id ? allItems().find((i) => i.id === id) : null;
  $("#itemT").textContent = it ? "Редагувати товар" : "Новий товар";
  if (it) {
    for (const k of ["n", "cat", "m", "p", "e", "u"]) form[k].value = it[k] || "";
    if (/^https?:/i.test(it.img || "")) form.imgUrl.value = it.img;
  } else {
    // За замовчуванням — розділ, який зараз на екрані
    const cur = CATS.find((c) => c.slug === activeSlug);
    if (cur) form.cat.value = cur.name;
  }
  setPreview(it?.img || "");
  openDlg($("#itemDlg"));
}

form.imgUrl.addEventListener("input", () => { if (safeUrl(form.imgUrl.value)) { form.imgFile.value = ""; setPreview(form.imgUrl.value); } });
$("#imgClear").addEventListener("click", () => { form.imgUrl.value = ""; form.imgFile.value = ""; setPreview(""); });

// Стискаємо фото в браузері, щоб влізло в документ бази (ліміт ~1 МБ)
function compress(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      URL.revokeObjectURL(url);
      let side = 900, q = 0.82, out = "";
      for (let n = 0; n < 6; n++) {
        const k = Math.min(1, side / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        out = c.toDataURL("image/jpeg", q);
        if (out.length < 600_000) break;
        side *= 0.8; q -= 0.08;
      }
      resolve(out);
    };
    im.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
    im.src = url;
  });
}
form.imgFile.addEventListener("change", async () => {
  const f = form.imgFile.files[0]; if (!f) return;
  try { form.imgUrl.value = ""; setPreview(await compress(f)); }
  catch { $("#itemErr").textContent = "Не вдалося прочитати це фото"; form.imgFile.value = ""; }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = (k) => form[k].value.trim();
  if (!v("n")) return;
  if (v("u") && !safeUrl(v("u"))) { $("#itemErr").textContent = "Посилання має починатися з http:// або https://"; return; }
  const data = { n: v("n"), cat: v("cat"), m: v("m"), p: v("p"), e: v("e"), u: v("u"), img: imgData };
  const id = editId || "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  if (!editId) data.createdAt = Date.now();
  if (editId && BUILTIN.has(editId)) data.deleted = false;
  const btn = $("#itemSave"); btn.disabled = true;
  try {
    await store.saveItem(id, data);
    closeDlg($("#itemDlg")); toast(editId ? "Збережено" : "Додано у вішліст ✨");
    if (!editId) setTimeout(() => document.getElementById(CATS.find((c) => c.name === data.cat)?.slug)?.scrollIntoView(), 50);
  } catch (err) { console.error(err); $("#itemErr").textContent = "Не вдалося зберегти. Спробуй ще раз."; }
  finally { btn.disabled = false; }
});

// ---------- Старт ----------
renderTabs(); updateAdminUI(); render();
(async () => {
  try { store = firebaseConfig ? await firebaseStore(firebaseConfig) : localStore(); }
  catch (err) { console.error(err); showNote("Не вдалося завантажити базу. Переглядати вішліст можна, але бронювання тимчасово недоступне."); return; }
  if (store.demo) showNote("Демо-режим: база ще не підключена, тому бронювання й нові товари видно лише в цьому браузері.");
  ready = true;
  store.watch("items", (o) => { overrides = o; render(); });
  store.watch("res", (o) => { res = o; render(); });
})();
