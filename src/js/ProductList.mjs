import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.NameWithoutBrand}">
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
    const list = await this.dataSource.getData();
    const allowed = ["880RR", "985RF", "985PR", "344YJ"];
    const filtered = list.filter((product) => allowed.includes(product.Id));
    this.renderList(filtered);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
