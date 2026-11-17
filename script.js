// ---------- DATA ----------
const DELIVERY_FEE = 50;

const items = [
  { id: 1, category: "food", name: "Ultimate Sizzling Adobo Special", detailName: "Ultimate Sizzling Adobo Special",
    price: 290, rating: 4.7, img: "images/adobo.jpg", imgLarge: "images/adobo.jpg" },
  { id: 2, category: "drinks", name: "Strawberry Mango Sunrise Mocktail", detailName: "Strawberry Mango Sundae Mocktail",
    price: 140, rating: 4.8, img: "images/mocktail.jpg", imgLarge: "images/mocktail-large.jpg" },
  { id: 3, category: "dessert", name: "Sundae Delight", detailName: "Sundae Delight",
    price: 250, rating: 4.9, img: "images/sundae.jpg", imgLarge: "images/sundae.jpg" }
];

const state = { category: "food", query: "", selected: null, qty: 1, user: "Ted" };

// ---------- HELPERS ----------
const $ = (id) => document.getElementById(id);
const peso = (n) => "\u20B1 " + n;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0);
}

// ---------- PAGE 1: LOGIN ----------
$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = $("username").value.trim();
  const pass = $("password").value;
  if (!user || !pass) {
    $("loginError").textContent = "Enter your username and password.";
    return;
  }
  $("loginError").textContent = "";
  state.user = user;
  $("greetingText").textContent = `"Gutom ka na ba, ${user}? Pumili ka na!"`;
  renderCards();
  showScreen("menu");
});

// ---------- PAGE 2: MENU ----------
function renderCards() {
  const q = state.query.toLowerCase();
  const list = items.filter((i) =>
    q ? i.name.toLowerCase().includes(q) : i.category === state.category
  );
  $("cards").innerHTML = list.length
    ? list.map((i) => `
        <article class="card">
          <img src="${i.img}" alt="${i.name}">
          <h4>${i.name}</h4>
          <p class="price">${peso(i.price)}</p>
          <button class="add" data-id="${i.id}">ADD TO CART</button>
        </article>`).join("")
    : `<p class="empty">No items found.</p>`;
}

$("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  state.category = tab.dataset.category;
  state.query = "";
  $("searchInput").value = "";
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
  renderCards();
});

$("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value.trim();
  renderCards();
});

$("cards").addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  openDetail(Number(btn.dataset.id));
});

// ---------- PAGE 3: DETAIL ----------
function openDetail(id) {
  state.selected = items.find((i) => i.id === id);
  state.qty = 1;
  const it = state.selected;
  $("detailImg").src = it.imgLarge;
  $("detailImg").alt = it.detailName;
  $("detailName").textContent = it.detailName;
  $("detailRating").textContent = it.rating;
  $("detailPrice").textContent = peso(it.price);
  $("qtyValue").textContent = state.qty;
  showScreen("detail");
}

$("plus").addEventListener("click", () => {
  state.qty++;
  $("qtyValue").textContent = state.qty;
});
$("minus").addEventListener("click", () => {
  if (state.qty > 1) state.qty--;
  $("qtyValue").textContent = state.qty;
});

$("toCheckout").addEventListener("click", () => {
  const it = state.selected;
  const subtotal = it.price * state.qty;
  $("sumName").textContent = it.detailName;
  $("sumQty").textContent = "x" + state.qty;
  $("sumPrice").textContent = peso(subtotal);
  $("sumFee").textContent = peso(DELIVERY_FEE);
  $("sumTotal").textContent = peso(subtotal + DELIVERY_FEE);
  $("orderMsg").textContent = "";
  $("orderMsg").classList.remove("ok");
  showScreen("checkout");
});

// ---------- PAGE 4: CHECKOUT ----------
$("placeOrder").addEventListener("click", () => {
  const pay = document.querySelector('input[name="payment"]:checked');
  const msg = $("orderMsg");
  if (!pay) {
    msg.classList.remove("ok");
    msg.textContent = "Choose a payment method.";
    return;
  }
  msg.classList.add("ok");
  msg.textContent = pay.value === "GCash" ? "Order placed! Paid via GCash." : "Order placed! Pay cash on delivery.";
});

// ---------- BACK BUTTONS ----------
document.querySelectorAll(".btn-back").forEach((b) =>
  b.addEventListener("click", () => showScreen(b.dataset.goto))
);

renderCards();
