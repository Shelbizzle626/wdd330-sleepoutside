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
  const query = new URLSearchParams(window.location.search).get("q")?.trim().toLowerCase();

  const heading = document.querySelector("#search-heading");
  const message = document.querySelector("#search-message");
  const productList = document.querySelector(".product-list");

  if (!query) {
    message.textContent = "Enter a product category to search.";
    return;
  }

  heading.textContent = `Results for “${query}”`;
  message.textContent = "Loading products…";

  try {
    const responses = await Promise.all(
      categories.map((category) =>
        fetch(`${baseURL}products/search/${encodeURIComponent(category)}`),
      ),
    );

    if (responses.some((response) => !response.ok)) {
      throw new Error("One or more product requests failed.");
    }

    const data = await Promise.all(
      responses.map((response) => response.json()),
    );
    const allProducts = data.flatMap((category) => category.Result ?? []);
    const products = allProducts.filter((product) => {
      const searchableText = [
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
        product.Category,
        product.Id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    message.textContent = products.length === 0 ? "No products were found." : `${products.length} products found.`;

    productList.innerHTML = products.map(productCardTemplate).join("");
  } catch (error) {
    console.error(error);
    message.textContent = "Unable to retrieve search results.";
  }
}

searchProducts();