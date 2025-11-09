document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const categoryButtons = document.querySelectorAll(".category-btn");

  async function loadProducts() {
    try {
      const response = await fetch("products.json");
      const products = await response.json();
      displayProducts(products);
      setupCategoryFilter(products);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  function displayProducts(products) {
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <span class="price">R$ ${product.price.toFixed(2)}</span>
        <button class="buy-btn" da
