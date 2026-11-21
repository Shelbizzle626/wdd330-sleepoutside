async function loadProductCarousel() {
  const response = await fetch(
    new URL("../json/backpacks.json", import.meta.url)
  );

  if (!response.ok) {
    throw new Error("Could not load backpack data");
  }

  const data = await response.json();

  const product = data.Result.find(
    (item) => item.Id === "223RN"
  );

  if (!product) {
    throw new Error("Backpack not found");
  }

  const images = [
    {
      Title: "Main image",
      Src: product.Images.PrimaryExtraLarge,
    },
    ...(product.Images.ExtraImages || []),
  ];

  const mainImage = document.querySelector("#carousel-main-image");
  const thumbnails = document.querySelector("#carousel-thumbnails");

  mainImage.src = images[0].Src;
  mainImage.alt = product.Name;

  thumbnails.innerHTML = "";

  images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel-thumbnail";

    const img = document.createElement("img");
    img.src = image.Src;
    img.alt = image.Title || `Product image ${index + 1}`;

    button.appendChild(img);

    button.addEventListener("click", () => {
      mainImage.src = image.Src;
      mainImage.alt = img.alt;

      document.querySelectorAll(".carousel-thumbnail")
        .forEach((item) => item.classList.remove("active"));

      button.classList.add("active");
    });

    thumbnails.appendChild(button);
  });

  thumbnails.firstElementChild.classList.add("active");
}

loadProductCarousel().catch(console.error);