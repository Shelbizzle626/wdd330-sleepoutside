import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach a listener to each X
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  if (cartItems.length > 0) {
    let total = 0;

    for(const item of cartItems) {
      total += Number(item.FinalPrice);
    }

    document.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;

    document.querySelector(".cart-footer").classList.remove("hide");
  } else {
    // Hide the total again when the cart is empty
    document.querySelector(".cart-footer").classList.add("hide");
  }
}

function removeFromCart(event) {
  const id = event.currentTarget.dataset.id;
  const cartItems = getLocalStorage("so-cart") || [];

  // Remove only one matching item, in case the same product was added twice
  const index = cartItems.findIndex((item) => item.Id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">X</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartCount();
