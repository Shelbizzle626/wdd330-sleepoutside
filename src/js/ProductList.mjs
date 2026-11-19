import { renderListWithTemplate } from "./utils.mjs";

function discountIndicatorTemplate(product) {
  const retailPrice = Number(product.SuggestedRetailPrice);
  const finalPrice = Number(product.FinalPrice);

  if (!(retailPrice > finalPrice)) {
    return "";
  }

  const percentOff = Math.round((1 - finalPrice / retailPrice) * 100);
  const savings = (retailPrice - finalPrice).toFixed(2);

  return `<div class="discount-indicator">
    <span class="discount-badge">${percentOff}% OFF</span>
    <span class="discount-savings">You save $${savings}</span>
  </div>`;
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.NameWithoutBrand}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
      ${discountIndicatorTemplate(product)}
    </a>
    <button type="button" class="quick-view-button" data-id="${product.Id}">Quick View</button>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);

    // Display products
    this.renderList(this.products);

    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest(".quick-view-button");
      if (button) {
        this.showQuickView(button.dataset.id);
      }
    });

    // Add sorting (from your branch)
    document.querySelector("#product-sort").addEventListener("change", (event) => {
      this.sortList(event.target.value);
    });
  }

  showQuickView(productId) {
    const product = this.products.find((item) => item.Id === productId);

    if (!product) return;

    const modal = document.querySelector("#quick-view-modal");

    modal.querySelector("#quick-view-title").textContent =
      product.NameWithoutBrand;

    modal.querySelector("#quick-view-content").innerHTML = `
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.NameWithoutBrand}"
      />
      <p>${product.Brand.Name}</p>
      <p>$${Number(product.FinalPrice).toFixed(2)}</p>
      <p>${product.Colors[0].ColorName}</p>
      <div>${product.DescriptionHtmlSimple || ""}</div>
      <p>$${Number(product.FinalPrice).toFixed(2)}</p>
      ${discountIndicatorTemplate(product)}
      <a href="/product_pages/?product=${product.Id}">
        View full product details
      </a>
    `;

    modal.showModal();
  }

  sortList(sortBy) {
    const sortedProducts = [...this.products];

    if (sortBy === "name") {
      sortedProducts.sort((a, b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
      );
    } else if (sortBy === "price") {
      sortedProducts.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    this.renderList(sortedProducts);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }
}
