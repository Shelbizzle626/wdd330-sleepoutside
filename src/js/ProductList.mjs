import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.NameWithoutBrand}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
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

    // Add sorting (from your branch)
    document.querySelector("#product-sort").addEventListener("change", (event) => {
      this.sortList(event.target.value);
    });
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
