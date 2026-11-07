import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function animateCartIcon() {
  const cartIcon = document.querySelector(".cart");
  if (!cartIcon) return;
  cartIcon.classList.add("cart-animate");
  cartIcon.addEventListener(
    "animationend",
    () => cartIcon.classList.remove("cart-animate"),
    { once: true },
  );
}

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
  updateCartCount();
  animateCartIcon();
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  if (!product) return;
  addProductToCart(product);
}

function renderDiscountIndicator(product) {
  const retail = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);

  if (!(retail > final)) return;

  const percentOff = Math.round((1 - final / retail) * 100);
  const saved = (retail - final).toFixed(2);

  const indicator = document.createElement("div");
  indicator.className = "discount-indicator";
  indicator.innerHTML = `<span class = "discount-badge"> ${percentOff}% OFF</span>
  <span class= "discount-savings">You save $${saved}</span>
  <div class = "discount-bar" role="img" aria-label =${percentOff}% discount">
  <div class ="discount-bar-fill" style="width: ${percentOff}%"></div></div>`;

  const priceEl = document.querySelector(
    ".product-detail .product-card__price",
  );
  if (priceEl) priceEl.insertAdjacentElement("afterend", indicator);
}

async function showDiscount() {
  const id = document.getElementById("addToCart")?.dataset.id;
  if (!id) return;
  const product = await dataSource.findProductById(id);
  if (product) renderDiscountIndicator(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

updateCartCount();
showDiscount();
