// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// update the number displayed beside each cart icon
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemCount = cartItems.length;

  document.querySelectorAll(".cart-count").forEach((count) => {
    count.textContent = itemCount;
    count.hidden = itemCount === 0;
    count.setAttribute(
      "aria-label",
      `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`,
    );
  });
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
