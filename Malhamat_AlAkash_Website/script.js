"use strict";

// عدّل أسماء المنتجات وأسعارها حسب الأسعار الحقيقية في الملحمة.
const products = [
  {
    id: 1,
    name: "لحم بقري",
    category: "لحم بقري",
    price: 65,
    unit: "كيلو",
    description: "للاستخدامات المختلفة في المطبخ",
    tag: "لحم بقري",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "لحم خروف",
    category: "لحم خروف",
    price: 85,
    unit: "كيلو",
    description: "مناسب للطبخ والمناسبات",
    tag: "لحم خروف",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "لحم مفروم",
    category: "مفروم",
    price: 60,
    unit: "كيلو",
    description: "مناسب للكفتة والطبخ",
    tag: "الأكثر استخدامًا",
    image: "https://images.unsplash.com/photo-1625938145744-e380515399bf?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "صدر دجاج",
    category: "دجاج",
    price: 30,
    unit: "كيلو",
    description: "لوجبات متنوعة وشهية",
    tag: "دجاج",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "قطع لحم للطبخ",
    category: "لحم بقري",
    price: 62,
    unit: "كيلو",
    description: "لليخنات والأطباق المنزلية",
    tag: "لحم بقري",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "ريش خروف",
    category: "لحم خروف",
    price: 90,
    unit: "كيلو",
    description: "للطبخ أو الشواء",
    tag: "لحم خروف",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "دجاج كامل",
    category: "دجاج",
    price: 25,
    unit: "حبة",
    description: "وجبة مناسبة للعائلة",
    tag: "دجاج",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "كفتة",
    category: "مفروم",
    price: 55,
    unit: "كيلو",
    description: "مناسبة للشواء والوجبات",
    tag: "مفروم",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=700&q=80"
  }
];

const WHATSAPP_NUMBER = "972599094315";

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");

let cart = [];
let activeCategory = "الكل";

function formatPrice(price) {
  return "₪" + price.toLocaleString("en-US");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderProducts() {
  const filteredProducts = activeCategory === "الكل"
    ? products
    : products.filter(product => product.category === activeCategory);

  productCount.textContent = `${filteredProducts.length} منتجات`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<div class="empty-products">لا توجد منتجات في هذا القسم.</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-bottom">
          <div class="product-price">
            ${formatPrice(product.price)}
            <small>/ ${product.unit}</small>
          </div>

          <button
            class="add-button"
            type="button"
            data-add="${product.id}"
          >+ أضف للسلة</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`تمت إضافة ${product.name} إلى السلة`);
}

function changeQuantity(productId, amount) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);
  checkoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        🛒<br>
        سلتك فارغة حاليًا.<br>
        اختر المنتجات التي تريدها من القائمة.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <div class="cart-item-price">
          ${formatPrice(item.price * item.quantity)}
        </div>

        <div class="quantity-controls">
          <button
            type="button"
            data-plus="${item.id}"
            aria-label="زيادة الكمية"
          >+</button>

          <span>${item.quantity} ${item.unit === "حبة" ? "حبة" : "كيلو"}</span>

          <button
            type="button"
            data-minus="${item.id}"
            aria-label="تقليل الكمية"
          >−</button>
        </div>
      </div>

      <button
        class="remove-button"
        type="button"
        data-remove="${item.id}"
      >حذف</button>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  document.body.classList.remove("cart-open");
}

function checkout() {
  if (cart.length === 0) {
    showToast("أضف منتجًا إلى السلة أولًا");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerAddress = document.getElementById("customerAddress").value.trim();

  if (!customerName) {
    document.getElementById("customerName").focus();
    showToast("اكتب اسمك أولًا");
    return;
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderLines = cart.map(item => {
    return `• ${item.name}: ${item.quantity} ${item.unit} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;
  });

  const message = [
    "السلام عليكم، أريد طلبًا من ملحمة العكش 🥩",
    "",
    `الاسم: ${customerName}`,
    "",
    "تفاصيل الطلب:",
    ...orderLines,
    "",
    `المجموع التقريبي: ${formatPrice(totalPrice)}`,
    "",
    `العنوان أو الملاحظات: ${customerAddress || "لا يوجد"}`,
    "",
    "يرجى تأكيد توفر المنتجات والأسعار والتوصيل. شكرًا لكم."
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", checkout);

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const plusButton = event.target.closest("[data-plus]");
  const minusButton = event.target.closest("[data-minus]");
  const removeButton = event.target.closest("[data-remove]");

  if (plusButton) {
    changeQuantity(Number(plusButton.dataset.plus), 1);
  } else if (minusButton) {
    changeQuantity(Number(minusButton.dataset.minus), -1);
  } else if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(categoryButton => {
    categoryButton.classList.toggle("active", categoryButton === button);
  });

  renderProducts();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
