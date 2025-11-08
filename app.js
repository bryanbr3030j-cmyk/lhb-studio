const PRODUCTS_URL = 'products.json';
let products = [];
let cart = [];

function $(sel){return document.querySelector(sel)}

async function loadProducts(){
  const res = await fetch(PRODUCTS_URL);
  products = await res.json();
  const grid = $('#grid');
  grid.innerHTML = '';
  products.forEach(p => {
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
  content.innerHTML += `<div style="margin-top:18px;color:var(--muted)"><small>Pagamento simulado — após 'confirmar pagamento' você receberá o código na tela (demo).</small></div>`;
}

function closeModal(){ $('#modal').style.display='none'; $('#modalContent').innerHTML=''; }
document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='closeModal') closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

function preview(id){
  const p = products.find(x=>x.id===id);
  alert(p.name + '\n\n' + p.desc + '\n\nPreço: R$ ' + p.price.toFixed(2));
}

function clearCart(){ cart=[]; updateCartCount(); openCart(); }

function checkout(){
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
  const pixCode = generatePix(total);
  const content = $('#modalContent');
  content.innerHTML = `<h3>Pagamento PIX</h3><p>Copie o código abaixo e simule o pagamento:</p><pre style="background:rgba(0,0,0,0.4);padding:8px;border-radius:8px">${pixCode}</pre><div style="margin-top:12px"><button class="btn" onclick="simulatePayment('${pixCode}')">Simular pagamento (demo)</button></div><div style="margin-top:10px"><small>Ou escaneie (simulação)</small></div>`;
}

function generatePix(total){
  const cents = Math.round(total*100).toString().padStart(3,'0');
  const base = '00020126360014BR.GOV.BCB.PIX0114+55' + Math.floor(100000000 + Math.random()*899999999).toString();
  return base + '540' + cents;
}

async function simulatePayment(pix){
  const content = $('#modalContent');
  content.innerHTML = `<h3>Verificando pagamento...</h3><p>Aguarde um momento</p>`;
  await new Promise(r=>setTimeout(r,2000));
  let notes = '';
  cart.forEach(it=>{
    for(let i=0;i<it.qty;i++){
      const code = 'LHB-' + it.id.toUpperCase() + '-' + Math.random().toString(36).substring(2,10).toUpperCase();
      notes += `${it.name}: ${code}\n`;
    }
  });
  content.innerHTML = `<h3>Pagamento confirmado ✅</h3><p>Seu(s) código(s) foram gerados abaixo (copie e guarde):</p><pre style="background:rgba(0,0,0,0.4);padding:8px;border-radius:8px">${notes}</pre><div style="margin-top:12px"><button class="btn" onclick="finishPurchase()">Finalizar</button></div>`;
  cart = [];
  updateCartCount();
}

function finishPurchase(){ closeModal(); }

