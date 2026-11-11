import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, listElement);

const categoryName = category
  .split("-")
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(" ");

document.querySelector("#product-list-title").textContent =
  `Top Products: ${categoryName}`;

productList.init();
