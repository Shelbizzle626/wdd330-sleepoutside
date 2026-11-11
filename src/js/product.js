import { updateCartCount, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");
const productPage = new ProductDetails(productId, dataSource);

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

function renderDiscountIndicator(product) {
  const retail = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);

  if (!(retail > final)) return;

  const percentOff = Math.round((1 - final / retail) * 100);
  const saved = (retail - final).toFixed(2);

  const indicator = document.createElement("div");
  indicator.className = "discount-indicator";
  indicator.innerHTML = `<span class="discount-badge">${percentOff}% OFF</span>
  <span class="discount-savings">You save $${saved}</span>
  <div class="discount-bar" role="img" aria-label="${percentOff}% discount">
    <div class="discount-bar-fill" style="width: ${percentOff}%"></div>
  </div>`;

  const priceEl = document.querySelector(".product-detail .product-card__price");
  if (priceEl) priceEl.insertAdjacentElement("afterend", indicator);
}

async function initPage() {
  updateCartCount();
  await productPage.init(); // builds the page and the Add to Cart button
  if (!productPage.product) return;

  renderDiscountIndicator(productPage.product);
  document.getElementById("addToCart").addEventListener("click", animateCartIcon);
}

initPage();
