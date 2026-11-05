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
    }

    renderProductDetails() {
        const p = this.product;
        document.querySelector(".product-detail").innerHTML = `
      <h3>${p.Brand.Name}</h3>
      <h2 class="divider">${p.NameWithoutBrand}</h2>
      <img class="divider" src="${p.Image}" alt="${p.NameWithoutBrand}" />
      <p class="product-card__price">$${p.FinalPrice}</p>
      <p class="product__color">${p.Colors[0].ColorName}</p>
      <p class="product__description">${p.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.Id}">Add to Cart</button>
      </div>
    `;
    }

    
}


