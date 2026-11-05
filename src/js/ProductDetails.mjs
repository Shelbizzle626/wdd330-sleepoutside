import {
    setLocalStorage,
    getLocalStorage,
    updateCartCount,
  } from "./utils.mjs";
  import ProductData from "./ProductData.mjs";

export default class ProductDetails {

    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    

}

