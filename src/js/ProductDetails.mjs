import {
  setLocalStorage,
  getLocalStorage,
  updateCartCount,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
    updateCartCount();
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
    this.animateCartIcon();
  }

  animateCartIcon() {
    const cartIcon = document.querySelector(".cart");
    if (!cartIcon) return;

    cartIcon.classList.add("cart-animate");
    cartIcon.addEventListener(
      "animationend",
      () => cartIcon.classList.remove("cart-animate"),
      { once: true },
    );
  }

  getDiscountMarkup() {
    const retail = Number(this.product.SuggestedRetailPrice);
    const final = Number(this.product.FinalPrice);

    if (!(retail > final)) return "";

    const percentOff = Math.round((1 - final / retail) * 100);
    const saved = (retail - final).toFixed(2);

    return `
      <div class="discount-indicator">
        <span class="discount-badge">${percentOff}% OFF</span>
        <span class="discount-savings">You save $${saved}</span>
        <div
          class="discount-bar"
          role="img"
          aria-label="${percentOff}% discount"
        >
          <div class="discount-bar-fill" style="width: ${percentOff}%"></div>
        </div>
      </div>
    `;
  }

  renderProductDetails() {
    const p = this.product;

    document.querySelector(".product-detail").innerHTML = `
      <h3>${p.Brand.Name}</h3>
      <h2 class="divider">${p.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${p.Images.PrimaryLarge}"
        alt="${p.NameWithoutBrand}"
      />
      <p class="product-card__price">$${p.FinalPrice}</p>
      ${this.getDiscountMarkup()}
      <p class="product__color">${p.Colors[0].ColorName}</p>
      <div class="product__description">${p.DescriptionHtmlSimple}</div>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.Id}">Add to Cart</button>
      </div>
    `;
  }
}

