document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const categoryButtons = document.querySelectorAll(".cat-btn");
  const emptyHint = document.getElementById("emptyHint");

  async function loadProducts() {
    try {
      const response = await fetch("products.json");
      const products = await response.json();
      displayProducts(products);
      setupCategoryFilter(products);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      grid.innerHTML = "<p>Erro ao carregar os produtos.</p>";
    }
  }

  function displayProducts(products) {
    grid.innerHTML = "";

    if (products.length === 0) {
      emptyHint.style.display = "block";
      return;
    }

    emptyHint.style.display = "none";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <span class="price">R$ ${product.price.toFixed(2)}</span>
        <button class="buy-btn" data-id="${product.id}">Comprar</button>
      `;

      grid.appendChild(card);
    });
  }

  function setupCategoryFilter(products) {
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-cat");
        const filtered =
          category === "all"
            ? products
            : products.filter((p) => p.category === category);

        displayProducts(filtered);
      });
    });
  }

  loadProducts();
});
