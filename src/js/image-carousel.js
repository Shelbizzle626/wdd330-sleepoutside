async function loadProductCarousel() {
  const response = await fetch(
    new URL("../json/backpacks.json", import.meta.url)
  );

  if (!response.ok) {
    throw new Error("Could not load backpack data");
  }

  const data = await response.json();

  const product = data.Result.find(
    (item) => item.Id === "541HM"
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
  const colorOptions = document.querySelector("#color-options");
  const selectedColor = document.querySelector("#selected-color");

  if (!mainImage || !thumbnails || !colorOptions || !selectedColor) {
    throw new Error("Product display elements not found");
  }

  mainImage.src = images[0].Src;
  mainImage.alt = product.Name;

  // Display the product image thumbnails
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

  // Display the available product colours
  colorOptions.innerHTML = "";

  product.Colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-option";
    button.title = color.ColorName;
    button.setAttribute("aria-label", color.ColorName);

    const chip = document.createElement("img");
    chip.src = color.ColorChipImageSrc;
    chip.alt = color.ColorName;

    button.appendChild(chip);

    button.addEventListener("click", () => {
      selectedColor.textContent = color.ColorName;

      mainImage.src = color.ColorPreviewImageSrc;
      mainImage.alt = `${product.Name} in ${color.ColorName}`;

      const firstThumbnail = thumbnails.querySelector("img");
      firstThumbnail.src = color.ColorPreviewImageSrc;
      firstThumbnail.alt = `${color.ColorName} main image`;

      thumbnails.querySelectorAll(".carousel-thumbnail")
        .forEach((item) => item.classList.remove("active"));

      thumbnails.firstElementChild.classList.add("active");

      colorOptions.querySelectorAll(".color-option")
        .forEach((item) => item.classList.remove("selected"));

      button.classList.add("selected");
    });

    colorOptions.appendChild(button);
  });

  colorOptions.firstElementChild.classList.add("selected");
}

loadProductCarousel().catch(console.error);