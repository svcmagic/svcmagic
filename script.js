/* ===== НАСТРОЙКИ: меняйте только этот блок ===== */
const CONFIG = {
  phone: "+79005335026",          // телефон для звонка
  phoneView: "8 900 533-50-26",   // как показывать на сайте
  whatsapp: "79005335026",        // номер WhatsApp без плюса
  telegram: "",                   // ваш ник в Telegram без @, например "svc_magic". Пусто — откроется чат по номеру телефона
  avito: "",                      // ссылка на ваш профиль Авито. Пусто — кнопка скрыта
  address: ""                     // адрес, например "ул. Мира, 1". Пусто — показываем только город
};
// Фото работ: положите файлы в папку photos и добавьте строки сюда
const WORKS = [
  // { src: "photos/work1.jpg", alt: "Замена дисплея iPhone" },
];
// Отзывы: добавляйте только настоящие отзывы клиентов
const REVIEWS = [
  // { name: "Имя клиента", text: "Текст отзыва" },
];
const SERVICES = [
  ["Замена дисплея","Вернём чёткую картинку и работающий сенсор."],
  ["Замена аккумулятора","Если смартфон быстро разряжается или выключается."],
  ["Замена заднего стекла iPhone","Аккуратно заменим разбитое заднее стекло."],
  ["Ремонт разъёма зарядки","Когда зарядка не держится или не заряжает."],
  ["Ремонт после попадания влаги","Диагностика и восстановление после воды."],
  ["Замена камер","Основная и фронтальная камеры."],
  ["Ремонт материнских плат","Сложный ремонт на уровне компонентов."],
  ["Программный ремонт","Прошивка, сбои, ошибки системы."],
  ["Перенос данных и настройка","Перенесём данные и настроим новый смартфон."]
];
/* ================================================ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const tgBase = CONFIG.telegram ? "https://t.me/" + CONFIG.telegram.replace("@","") : "https://t.me/" + CONFIG.phone;
const links = { call: "tel:" + CONFIG.phone, wa: "https://wa.me/" + CONFIG.whatsapp, tg: tgBase, avito: CONFIG.avito };
$$("[data-link]").forEach(a => {
  const u = links[a.dataset.link];
  if (u) a.href = u; else a.hidden = true;
});
$("#phoneText").textContent = CONFIG.phoneView;
$("#year").textContent = new Date().getFullYear();
if (CONFIG.address) { const a = $("#addr"); a.textContent = "Адрес: " + CONFIG.address; a.hidden = false; }
$("#mapLink").href = "https://yandex.ru/maps/?text=" + encodeURIComponent("Вологда " + CONFIG.address + " SVC Magic");

$("#serviceGrid").innerHTML = SERVICES.map(([t,d]) => `<a class="card svc" href="#contacts" data-prefill="Интересует услуга: ${t}."><h3>${t}</h3><p>${d}</p></a>`).join("");

$("#gallery").innerHTML = WORKS.length
  ? WORKS.map((w,i) => `<button data-i="${i}" aria-label="Увеличить фото"><img src="${w.src}" alt="${w.alt||"Работа SVC Magic"}" loading="lazy"></button>`).join("")
  : Array(4).fill('<div class="ph">Здесь будут ваши фото ремонтов. Добавьте их в папку photos и в список WORKS в script.js</div>').join("");

$("#reviewGrid").innerHTML = REVIEWS.length
  ? REVIEWS.map(r => `<div class="card review"><p>${r.text}</p><small>${r.name}</small></div>`).join("")
  : '<div class="card"><p>Здесь появятся отзывы клиентов. Добавьте их в список REVIEWS в script.js.</p></div>';

/* меню */
const nav = $("#nav"), burger = $("#burger");
burger.onclick = () => burger.setAttribute("aria-expanded", nav.classList.toggle("open"));
nav.onclick = e => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } };

/* лайтбокс */
const lb = $("#lb"), lbImg = $("#lbImg");
$("#gallery").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const w = WORKS[b.dataset.i]; lbImg.src = w.src; lbImg.alt = w.alt || ""; lb.hidden = false;
};
lb.onclick = e => { if (e.target !== lbImg) lb.hidden = true; };
document.onkeydown = e => { if (e.key === "Escape") lb.hidden = true; };

/* подстановка темы в форму при клике на услугу / стоимость */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-prefill]");
  if (el) $("#form").issue.value = el.dataset.prefill;
});

/* отправка заявки */
const form = $("#form");
function getText() {
  const f = form, v = n => f[n].value.trim();
  if (!v("name") || !v("phone") || !v("model") || !v("issue")) { $("#err").textContent = "Заполните все поля формы."; return null; }
  if (v("phone").replace(/\D/g,"").length < 10) { $("#err").textContent = "Проверьте номер телефона."; return null; }
  $("#err").textContent = "";
  return `Заявка на ремонт (сайт SVC Magic)\nИмя: ${v("name")}\nТелефон: ${v("phone")}\nМодель: ${v("model")}\nНеисправность: ${v("issue")}`;
}
document.querySelectorAll("[data-send]").forEach(b => b.onclick = async () => {
  const text = getText(); if (!text) return;
  const enc = encodeURIComponent(text);
  if (b.dataset.send === "wa") { window.open(`https://wa.me/${CONFIG.whatsapp}?text=${enc}`, "_blank"); return; }
  if (CONFIG.telegram) { window.open(`${tgBase}?text=${enc}`, "_blank"); return; }
  try { await navigator.clipboard.writeText(text); $("#hint").textContent = "Текст заявки скопирован. Вставьте его в открывшийся чат Telegram."; }
  catch { $("#hint").textContent = "Откроется чат Telegram — напишите в нём о неисправности."; }
  window.open(tgBase, "_blank");
});
form.onsubmit = e => e.preventDefault();

/* плавное появление секций */
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
$$(".sec").forEach(s => { s.classList.add("rv"); io.observe(s); });
