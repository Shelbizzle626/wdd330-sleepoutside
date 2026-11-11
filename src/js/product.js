import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const productId = getParam("product");
const dataSource = new ProductData();
const productDetails = new ProductDetails(productId, dataSource);

productDetails.init();
