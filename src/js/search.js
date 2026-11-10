const baseURL =
  import.meta.env.VITE_SERVER_URL ||
  "https://wdd330-backend.onrender.com/";

const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img
          src="${product.Images.PrimaryMedium}"
          alt="${product.NameWithoutBrand}"
        />
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

async function searchProducts() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim().toLowerCase();

  const heading = document.querySelector("#search-heading");
  const message = document.querySelector("#search-message");
  const productList = document.querySelector(".product-list");

  if (!query) {
    message.textContent = "Enter a product name.";
    return;
  }

  heading.textContent = `Results for “${query}”`;
  message.textContent = "Loading products...";

  try {
    let allProducts = [];

    for (const category of categories) {
      const response = await fetch(`${baseURL}products/search/${category}`);

      if (!response.ok) {
        throw new Error("Unable to retrieve products.");
      }

      const data = await response.json();
      allProducts = allProducts.concat(data.Result);
    }

    const matches = allProducts.filter(function (product) {
      return product.Name.toLowerCase().includes(query);
    });

    message.textContent =
      matches.length === 0
        ? "No products were found."
        : `${matches.length} products found.`;
    productList.innerHTML = matches.map(productCardTemplate).join("");
  } catch (error) {
    message.textContent = "Unable to retrieve search results.";
  }
}

searchProducts();