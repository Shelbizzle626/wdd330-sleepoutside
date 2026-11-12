import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

// Combine duplicate entries into one item with a Quantity

function normalizeCart(cartItems) {
  const merged = [];
  for (const item of cartItems) {
    const existing = merged.find((i) => i.Id === item.Id);
    if (existing) {
      existing.Quantity += item.Quantity || 1;
    } else {
      merged.push({ ...item, Quantity: item.Quantity || 1 });
    }
  }
  return merged;
}

function renderCartContents() {
  const cartItems = normalizeCart(getLocalStorage("so-cart") || []);
  setLocalStorage("so-cart", cartItems);

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach a listener to each X
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  // Attach a listener to each quantity input
  document.querySelectorAll(".cart-card__qty-input").forEach((input) => {
    input.addEventListener("change", changeQuantity);
  })

  if (cartItems.length > 0) {
    let total = 0;

    for (const item of cartItems) {
      total += Number(item.FinalPrice) * item.Quantity;
    }

    document.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;
    document.querySelector(".cart-footer").classList.remove("hide");
  } else {
    // Hide the total again when the cart is empty
    document.querySelector(".cart-footer").classList.add("hide");
  }
}

function changeQuantity(event) {
  const id = event.currentTarget.dataset.id;
  let qty = parseInt(event.currentTarget.value);

  const cartItems = getLocalStorage("so-cart") || [];

  // 0 removed the tiem from the cart
  if (qty === 0) {
    const updated = cartItems.filter((i) => i.Id !== id);
    setLocalStorage("so-cart", updated);
    renderCartContents();
    updateCartCount();
    return;
  }

  // Prevent NaN, negatives or huge numbers
  if (!Number.isFinite(qty) || qty < 1) qty = 1;
  if (qty > 99) qty = 99;


  const item = cartItems.find((i) => i.Id === id);
  if (item) {
    item.Quantity = qty;
    setLocalStorage("so-cart", cartItems);
  }
  renderCartContents();
  updateCartCount();
}

function removeFromCart(event) {
  const id = event.currentTarget.dataset.id;
  const cartItems = getLocalStorage("so-cart") || [];

  // Each product is one line with a Quantity, so X removed the whole line
  const updated = cartItems.filter((item) => item.Id !== id);

  // Remove only one matching item, in case the same product was added twice
  /* const index = cartItems.findIndex((item) => item.Id === id);
   if (index !== -1) {
     cartItems.splice(index, 1);
   } */

  setLocalStorage("so-cart", updated);
  renderCartContents();
  updateCartCount();
}

function cartItemTemplate(item) {
  const lineTotal = Number(item.FinalPrice) * item.Quantity;

  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">X</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium ?? item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <label class="cart-card__quantity">
    qty:
    <input type="number" class="cart-card__qty-input" data-id="${item.Id}"
            value="${item.Quantity}" min="1" max="99" step="1"
            aria-label="Quantity of ${item.Name}">
  </label>
  <p class="cart-card__price">$${lineTotal.toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartCount();
