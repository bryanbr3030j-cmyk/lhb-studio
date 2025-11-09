// carregar produtos e inicializar UI
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_URL);
    products = await res.json();
  } catch (e) {
    console.error('Erro ao carregar products.json', e);
    products = [];
  }

  // Inicializa botões e exibe todos os produtos
  initCategoryButtons();
  renderProducts('all');
}

// categorias (botões)
function initCategoryButtons() {
  const buttons = document.querySelectorAll('.cat-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.cat;
      const filtered =
        category === 'all'
          ? products
          : products.filter(p => (p.category || '').toLowerCase() === category);

      renderProducts(category);
    });
  });
}
// ======================
// app.js — LHB Studio (categorias + carrinho + checkout PIX real)
// ======================

const PRODUCTS_URL = 'products.json';
let products = [];
let cart = [];

function $(sel){ return document.querySelector(sel) }

// carregar produtos e inicializar UI
async function loadProducts(){
  try {
    const res = await fetch(PRODUCTS_URL);
    products = await res.json();
  } catch(e){
    console.error('Erro ao carregar products.json', e);
    products = [];
  }

  renderProducts('all');
  initCategoryButtons();
}

function renderProducts(category='all'){
  const grid = $('#grid');
  grid.innerHTML = '';
  const filtered = (category === 'all') ? products : products.filter(p => (p.category || 'uncategorized') === category);
  if(filtered.length === 0){
    $('#emptyHint').style.display = 'block';
  } else {
    $('#emptyHint').style.display = 'none';
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

// categorias (botões)
function initCategoryButtons(){
  const btns = document.querySelectorAll('.cat-btn');
  btns.forEach(b=>{
    b.addEventListener('click', ()=>{
      btns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const cat = b.getAttribute('data-cat');
      renderProducts(cat);
    });
  });
}

// carrinho
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const item = cart.find(c=>c.id===id);
  if(item) item.qty++;
  else cart.push({id:p.id, name:p.name, price:p.price, qty:1});
  updateCartCount();
  openCart();
}

function updateCartCount(){
  $('#cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function openCart(){
  const modal = $('#modal');
  const content = $('#modalContent');
  modal.style.display = 'flex';
  content.innerHTML = `<h3>Seu Carrinho</h3>`;
  if(cart.length===0) content.innerHTML += '<p>Carrinho vazio</p>';
  else{
    const list = document.createElement('div');
    cart.forEach(it=>{
      const row = document.createElement('div');
      row.style.display='flex'; row.style.justifyContent='space-between'; row.style.marginTop='8px';
      row.innerHTML = `<div>${it.name} x${it.qty}</div><div>R$ ${(it.price*it.qty).toFixed(2)}</div>`;
      list.appendChild(row);
    });
    content.appendChild(list);
    const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
    content.innerHTML += `<div style="margin-top:12px;font-weight:800">Total: R$ ${total.toFixed(2)}</div>`;
    content.innerHTML += `<div style="margin-top:12px"><button class="btn" onclick="checkout()">Pagar com PIX</button> <button class="small" onclick="clearCart()">Limpar</button></div>`;
  }
}

function clearCart(){ cart=[]; updateCartCount(); openCart(); }

function preview(id){
  const p = products.find(x=>x.id===id);
  alert(p.name + '\n\n' + p.desc + '\n\nPreço: R$ ' + p.price.toFixed(2));
}

function closeModal(){ $('#modal').style.display='none'; $('#modalContent').innerHTML=''; }
document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='closeModal') closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

// ----------------------
// CHECKOUT SEM SIMULAÇÃO (PIX REAL)
// ----------------------
async function checkout(){
  if(cart.length === 0) return alert('Seu carrinho está vazio.');
  const totalCents = Math.round(cart.reduce((s,i)=>s+i.qty*i.price,0)*100);
  const totalDisplay = (totalCents/100).toFixed(2);

  const myPhonePix = '5519971055502'; 
  const myPixKey = '4b13b07b-59a8-41a5-8f41-eeddd91ba739';
  const merchantName = 'LHB Studio';
  const merchantCity = 'Limeira';

  // payload de exibição (para QR); para QR/payload oficial recomendo PSP
  const payload = `00020126360014BR.GOV.BCB.PIX0114+55${myPhonePix}520400005303986540${totalCents.toString().padStart(3,'0')}5802BR59${merchantName.length}${merchantName}6009${merchantCity}6108054090006304`;

  const content = $('#modalContent');
  content.innerHTML = `
    <h3>Pagamento PIX</h3>
    <p style="margin:0 0 8px 0">Valor: <strong>R$ ${totalDisplay}</strong></p>
    <p style="margin:0 0 6px 0">Chave PIX (UUID): <br><code>${myPixKey}</code></p>
    <p style="margin:6px 0 12px 0">Chave PIX (celular): <br><strong>+55 ${formatPhoneForDisplay(myPhonePix)}</strong></p>
    <div id="qrWrap" style="margin:0 auto 12px;display:flex;justify-content:center"></div>
    <pre style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;white-space:pre-wrap">${payload}</pre>

    <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <label class="btn" style="cursor:pointer">
        <input id="fileProof" type="file" accept="image/*,application/pdf" style="display:none">
        Enviar comprovante
      </label>
      <a class="btn" href="https://wa.me/55${myPhonePix}?text=${encodeURIComponent(`Olá, eu paguei R$ ${totalDisplay} por *${merchantName}*. Segue o comprovante:`)}" target="_blank">Enviar por WhatsApp</a>
      <button class="small" onclick="closeModal()">Cancelar</button>
    </div>

    <div style="margin-top:12px;color:var(--muted);text-align:center">
      <small>Recebemos o comprovante? Verificaremos e liberaremos o pedido manualmente. Para confirmação automática use um PSP com webhooks.</small>
    </div>
  `;

  // gerar QR usando Google Chart API (client-side)
  const qrWrap = document.getElementById('qrWrap');
  const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(payload)}`;
  qrWrap.innerHTML = `<img src="${qrUrl}" alt="QR Code PIX" style="width:220px;height:220px;object-fit:contain;border-radius:12px">`;

  // upload de comprovante (precisa de endpoint /upload-proof no seu servidor)
  const fileInput = document.getElementById('fileProof');
  fileInput.addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if(!file) return alert('Nenhum arquivo selecionado.');
    qrWrap.innerHTML += '<div style="margin-top:8px">Enviando comprovante...</div>';
    const form = new FormData();
    form.append('proof', file);
    form.append('amount', totalCents);
    form.append('payload', payload);
    form.append('pix_key', myPixKey);
    try {
      const resp = await fetch('/upload-proof', { method: 'POST', body: form });
      if(resp.ok){
        alert('Comprovante enviado! Em breve confirmaremos seu pedido.');
        cart = []; updateCartCount(); closeModal();
      } else {
        const text = await resp.text();
        alert('Falha ao enviar comprovante: ' + text);
      }
    } catch(err){
      console.error(err);
      alert('Erro ao enviar comprovante. Tente pelo WhatsApp.');
    }
  });
}

function formatPhoneForDisplay(num){
  const s = (num || '').replace(/\D/g,'');
  if(s.length===13 && s.startsWith('55')){
    const ddd = s.slice(2,4);
    const rest = s.slice(4);
    return `(${ddd}) ${rest.slice(0,5)}-${rest.slice(5)}`;
  }
  return num;
}

function finishPurchase(){ closeModal(); }

// exec
document.addEventListener('DOMContentLoaded', ()=>{ loadProducts(); });
// abre carrinho com botão header
document.getElementById('cartBtn').addEventListener('click', openCart);
