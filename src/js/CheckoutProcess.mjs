import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// turns the form into { fname: "...", lname: "...", ... } using each input's name
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const converted = {};
  formData.forEach((value, key) => {
    converted[key] = value;
  });
  return converted;
}

// simplifies cart items to the shape the server wants
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: Number(item.Quantity) || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  itemCount() {
    return this.list.reduce(
      (sum, item) => sum + (Number(item.Quantity) || 1),
      0,
    );
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) =>
        sum + Number(item.FinalPrice) * (Number(item.Quantity) || 1),
      0,
    );

    document.querySelector(`${this.outputSelector} #cartTotal`).innerText =
      `$${this.itemTotal.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #num-items`).innerText =
      this.itemCount();
  }

  calculateOrderTotal() {
    const count = this.itemCount();
    this.tax = this.itemTotal * 0.06;
    this.shipping = count > 0 ? 10 + (count - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summary = document.querySelector(this.outputSelector);
    summary.querySelector("#tax").innerText = `$${this.tax.toFixed(2)}`;
    summary.querySelector("#shipping").innerText =
      `$${this.shipping.toFixed(2)}`;
    summary.querySelector("#orderTotal").innerText =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    this.calculateOrderTotal();
    const order = formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      await services.checkout(order);
      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      const details = err?.message;
      if (details && typeof details === "object") {
        // server often returns { message: "..." } or a map of field errors
        if (typeof details.message === "string") {
          alertMessage(details.message);
        } else {
          Object.values(details).forEach((msg) => {
            if (typeof msg === "string") alertMessage(msg);
          });
        }
      } else {
        alertMessage(err?.message || "Checkout failed. Please try again.");
      }
    }
  }
}
