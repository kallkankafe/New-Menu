const WHATSAPP_NUMBER = "38976228755";

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobileNav");
if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const cards = Array.from(document.querySelectorAll(".menu-zone .menu-card"));
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("menuSearch");
let activeFilter = "all";
let activeSearch = "";

function filterCards() {
  let visibleCount = 0;
  cards.forEach(card => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.name.includes(activeSearch.toLowerCase());
    const visible = matchesFilter && matchesSearch;
    card.classList.toggle("hide", !visible);
    if (visible) visibleCount += 1;
  });
  if (noResults) noResults.classList.toggle("show", visibleCount === 0);
}

document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
    filterCards();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", event => {
    activeSearch = event.target.value.trim();
    filterCards();
  });
}

document.querySelectorAll("[data-filter-link]").forEach(link => {
  link.addEventListener("click", () => {
    const filter = link.dataset.filterLink;
    setTimeout(() => {
      const target = document.querySelector(`.filter-chip[data-filter="${filter}"]`);
      if (target) target.click();
    }, 120);
  });
});

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".image-open").forEach(button => {
  button.addEventListener("click", () => {
    if (!modal || !modalImage) return;
    modalImage.src = button.dataset.image;
    modalImage.alt = button.dataset.alt;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  if (!modal || !modalImage) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modal) modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

const reserveFields = ["guestName", "guestDate", "guestTime", "guestCount", "guestNote"].map(id => document.getElementById(id));
const whatsappButton = document.getElementById("whatsappButton");
function updateWhatsAppLink() {
  if (!whatsappButton || reserveFields.some(field => !field)) return;
  const [name, date, time, guests, note] = reserveFields.map(field => field.value.trim());
  const message = [
    "Hello Rrem's, I would like to reserve a table.",
    name ? `Name: ${name}` : "Name:",
    date ? `Date: ${date}` : "Date:",
    time ? `Time: ${time}` : "Time:",
    guests ? `Guests: ${guests}` : "Guests:",
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n");
  whatsappButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
reserveFields.forEach(field => { if (field) field.addEventListener("input", updateWhatsAppLink); });
updateWhatsAppLink();

// Keep sections visible immediately to avoid delayed loading / disappearing on scroll back.
document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));


// Premium-first ordering for sales focus
function getCardPrice(card) {
  const priceEl = card.querySelector('[itemprop="price"]');
  const price = priceEl ? Number(priceEl.textContent.trim()) : 0;
  return Number.isFinite(price) ? price : 0;
}
function sortCardsByPriceDesc(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const sorted = Array.from(container.children).sort((a, b) => {
    const pa = getCardPrice(a);
    const pb = getCardPrice(b);
    if (pb !== pa) return pb - pa;
    const aCategory = a.dataset.category || '';
    const bCategory = b.dataset.category || '';
    // prioritize hookah, then cocktails, then cold, hot, snacks
    const order = { hookah: 0, cocktails: 1, cold: 2, hot: 3, snacks: 4 };
    return (order[aCategory] ?? 9) - (order[bCategory] ?? 9);
  });
  sorted.forEach(card => container.appendChild(card));
}
sortCardsByPriceDesc('.featured-grid');
document.querySelectorAll('[data-sort-grid]').forEach(grid => {
  const sorted = Array.from(grid.children).sort((a, b) => {
    const pa = getCardPrice(a);
    const pb = getCardPrice(b);
    return pb - pa;
  });
  sorted.forEach(card => grid.appendChild(card));
});

// Opening animation
const introOverlay = document.getElementById('introOverlay');
if (introOverlay) {
  document.body.classList.add('intro-active');
  const closeIntro = () => {
    introOverlay.classList.add('hide');
    document.body.classList.remove('intro-active');
    setTimeout(() => introOverlay.remove(), 950);
  };
  window.addEventListener('load', () => {
    setTimeout(closeIntro, 2850);
  }, { once: true });
  setTimeout(() => {
    if (document.body.classList.contains('intro-active')) closeIntro();
  }, 3900);
}


// Pointer glow + touch ripple
const pointerGlow = document.createElement('div');
pointerGlow.className = 'pointer-glow';
document.body.appendChild(pointerGlow);
function moveGlow(x, y) {
  pointerGlow.style.setProperty('--x', `${x}px`);
  pointerGlow.style.setProperty('--y', `${y}px`);
}
window.addEventListener('mousemove', (e) => moveGlow(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  moveGlow(touch.clientX, touch.clientY);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  moveGlow(touch.clientX, touch.clientY);
}, { passive: true });
