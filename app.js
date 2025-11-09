document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let allProducts = [];

  async function loadProducts() {
    try {
      const response = await fetch("products.json");
      allProducts = await response.json();
      displayProducts(allProducts);
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
        <button class="buy-btn">Comprar</button>
      `;

      productList.appendChild(card);
    });
  }

  // filtro por categoria
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      if (category === "all") {
        displayProducts(allProducts);
      } else {
        const filtered = allProducts.filter(
          (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
        );
        displayProducts(filtered);
      }
    });
  });

  loadProducts();
});
