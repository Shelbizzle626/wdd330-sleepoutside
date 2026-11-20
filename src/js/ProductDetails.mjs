import {
    setLocalStorage,
    getLocalStorage,
    updateCartCount,
  } from "./utils.mjs";
  //import ProductData from "./ProductData.mjs";

export default class ProductDetails {

    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
        this.selectedColor= null;
    }

    async init() {
      this.product = await this.dataSource.findProductById(this.productId);
      
      // Handle a missing or wrong ?product= in the URL
      if (!this.product) {
        document.querySelector(".product-detail").innerHTML =
          "<p>Sorry, that product could not be found.</p>";
        this.product = null;
        return;
      }
        this.selectedColor= (this.product.colors || [])[0] || null;


        this.renderProductDetails();
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
        document
            .getElementById("wishlistButton")
            .addEventListener("click", this.toggleWishlist.bind(this));
        this.wireColorSwatches();
        updateCartCount();
    }


    renderColorPicker() {
    const colors = this.product.colors || [];

    // One color (or none): just show the name, no picker
    if (colors.length < 2) {
      return colors[0]
        ? `<p class="product__color">${colors[0].ColorName}</p>`
        : "";
    }

    const swatches = colors
      .map(
        (c, i) => `
        <div class="swatch">
          <input type="radio" name="color" id="color-${i}"
                 value="${i}" ${i === 0 ? "checked" : ""} />
          <label for="color-${i}" title="${c.ColorName}">
            <img src="${c.ColorChipImageSrc}" alt="${c.ColorName}" />
          </label>
        </div>`,
      )
      .join("");

    return `
      <fieldset class="color-picker">
        <legend>Color: <span id="colorName">${colors[0].ColorName}</span></legend>
        <div class="swatches">${swatches}</div>
      </fieldset>`;
  }

  wireColorSwatches() {
    document.querySelectorAll('input[name="color"]').forEach((input) => {
      input.addEventListener("change", () => {
        this.selectedColor = this.product.Colors[Number(input.value)];
        document.getElementById("colorName").textContent =
          this.selectedColor.ColorName;

        // Swap the main image if this color has its own preview image
        if (this.selectedColor.ColorPreviewImageSrc) {
          document.getElementById("productImage").src =
            this.selectedColor.ColorPreviewImageSrc;
        }
      });
    });
  }


    addProductToCart() {
      const cartItems = getLocalStorage("so-cart") || [];
      // Is this product already in the cart?
      const existing = cartItems.find((item) => item.Id === this.product.Id && item.SelectedColor === colorName,);
      const colorName = this.selectedColor ? this.selectedColor.ColorName : null;

      if (existing) {
        //Yes: add 1 to it's quantity
        existing.Quantity = (Number(existing.Quantity) || 1) + 1;
      }
      else {
        // No: add it with a quantity of 1
        cartItems.push({ ...this.product, SelectedColor: colorName, Quantity: 1 });
      }

      setLocalStorage("so-cart", cartItems);
      updateCartCount();
    }

    toggleWishlist() {
      const wishlist = getLocalStorage("so-wishlist") || [];
      const productIndex = wishlist.findIndex(
        (item) => item.Id === this.product.Id,
      );

      if (productIndex === -1) {
        wishlist.push(this.product);
      } else {
        wishlist.splice(productIndex, 1);
      }

      setLocalStorage("so-wishlist", wishlist);
      this.updateWishlistButton(productIndex === -1);
    }

    updateWishlistButton(isWishlisted) {
      const button = document.getElementById("wishlistButton");
      button.textContent = isWishlisted
        ? "Remove from Wishlist"
        : "Add to Wishlist";
      button.setAttribute("aria-pressed", String(isWishlisted));
    }

    renderProductDetails() {
      const p = this.product;
      const wishlist = getLocalStorage("so-wishlist") || [];
      const isWishlisted = wishlist.some((item) => item.Id === p.Id);
      document.title = `Sleep Outside | ${p.NameWithoutBrand}`;
        document.querySelector(".product-detail").innerHTML = `
      <h3>${p.Brand.Name}</h3>
      <h2 class="divider">${p.NameWithoutBrand}</h2>
      <img class="divider" src="${p.Images.PrimaryLarge}" alt="${p.NameWithoutBrand}" />
      <p class="product-card__price">$${p.FinalPrice}</p>
      ${this.renderColorPicker()}
      <p class="product__color">${p.Colors[0].ColorName}</p>
      <p class="product__description">${p.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.Id}">Add to Cart</button>
        <button id="wishlistButton" class="wishlist-button" type="button"
          aria-pressed="${isWishlisted}">
          ${isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    `;
    }

    
}


