function renderBreadcrumbs(category) {
  const breadcrumbContainer = document.createElement("nav");
  breadcrumbContainer.classList.add("breadcrumbs");
  breadcrumbContainer.setAttribute("aria-label", "Breadcrumb");

  

  const categoryName = document.createElement("span");
  categoryName.textContent =
    category.charAt(0).toUpperCase() + category.slice(1);

  breadcrumbContainer.append(categoryName);

  const main = document.querySelector("main");
  if (main) {
    main.before(breadcrumbContainer);
  }
}

renderBreadcrumbs("tents");