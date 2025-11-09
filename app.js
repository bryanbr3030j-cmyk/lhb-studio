document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const categoryButtons = document.querySelectorAll(".cat-btn");
  let allProducts = [];

  async function loadProducts(){
    try {
      const response = await fetch("products.json");
      allProducts = await response.json();
    } catch(e) {
      console.error('Erro ao carregar products.json', e);
      allProducts = [];
    }
    initCategoryButtons();
    renderProducts('all');
  }

  function renderProducts(category) {
    grid.innerHTML = '';
    const filtered = category === 'all'
      ? allProducts
      : allProducts.filter(p => (p.category || '').toLowerCase() === category);

    if(filtered.length === 0) {
      document.getElementById('emptyHint').style.display = 'block';
    } else {
      document.getElementById('emptyHint').style.display = 'none';
    }

    filtered.forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="card-img">
          <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">
        </div>
        <h4>${p.name}</h4>
        <p>${p.desc || ''}</p>
        <div class="price">R$ ${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn" onclick="addToCart('${p.id}')">Comprar</button>
          <button class="small" onclick="preview('${p.id}')">Detalhes</button>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  function initCategoryButtons(){
    categoryButtons.forEach(button=>{
      button.addEventListener('click', ()=>{
        categoryButtons.forEach(b=>b.classList.remove('active'));
        button.classList.add('active');
        const cat = button.getAttribute('data-cat');
        renderProducts(cat);
      });
    });
  }

  // resto das funções (addToCart, checkout etc) continuam iguais…

  loadProducts();
});
