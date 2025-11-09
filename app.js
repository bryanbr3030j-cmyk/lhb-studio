document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const buttons = document.querySelectorAll(".cat-btn");
  const emptyHint = document.getElementById("emptyHint");

  async function loadProducts() {
    try {
      const res = await fetch("products.json");
      const products = await res.json();
      showProducts(products);
      setupButtons(products);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      grid.innerHTML = "<p>Erro ao carregar os produtos.</p>";
    }
  }

  function showProducts(products) {
    grid.innerHTML = "";

    if (!products.length) {
      emptyHint.style.display = "block";
      return;
    }

    emptyHint.style.display = "none";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="price">R$ ${p.price.toFixed(2)}</span>
        <button class="buy-btn" data-id="${p.id}">Comprar</button>
      `;
      grid.appendChild(card);
    });
  }

  function setupButtons(products) {
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const cat = btn.dataset.cat;
        const filtered = cat === "all" ? products : products.filter(p => p.category === cat);
        showProducts(filtered);
      });
    });
  }

  loadProducts();
});
