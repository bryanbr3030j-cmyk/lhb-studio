const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const products = JSON.parse(fs.readFileSync(path.join(__dirname,'products.json'),'utf8'));

app.get('/api/products', (req,res)=> res.json(products));

// create-charge - Simula criação de cobrança Pix (substitua por PSP real)
app.post('/api/create-charge', (req,res)=>{
  const {productId, name, email} = req.body;
  const prod = products.find(p=>p.id===productId);
  if(!prod) return res.json({error:'produto nao encontrado'});
  const ordersFile = path.join(__dirname,'orders.json');
  let orders = [];
  if(fs.existsSync(ordersFile)) orders = JSON.parse(fs.readFileSync(ordersFile,'utf8'));
  const order = { id: Date.now().toString(), productId: prod.id, name, email, price: prod.price, paid:false };
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  // fake pix code (copia e cola)
  const fakePix = '00020126360014BR.GOV.BCB.PIX0114+552199999999520400005303986540' + Math.round(prod.price*100);
  res.json({ pix_copy: fakePix, qr_base64: null, orderId: order.id });
});

// webhook simulation endpoint to mark order as paid and send email (for testing)
app.post('/webhook/simulate-pay', async (req,res)=>{
  const { orderId } = req.body;
  const ordersFile = path.join(__dirname,'orders.json');
  if(!fs.existsSync(ordersFile)) return res.status(400).send('no orders');
  let orders = JSON.parse(fs.readFileSync(ordersFile,'utf8'));
  const order = orders.find(o=>o.id===orderId);
  if(!order) return res.status(404).send('order not found');
  order.paid = true;
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  // send email
  await sendCodeEmail(order);
  res.sendStatus(200);
});

async function sendCodeEmail(order){
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password'
    }
  });
  const code = 'CODIGO-' + order.productId.toUpperCase() + '-' + Math.random().toString(36).substring(2,10).toUpperCase();
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'loja@exemplo.com',
    to: order.email,
    subject: 'Seu pedido - LHB Studio',
    text: `Obrigado pela compra! Aqui está seu código para ${order.productId}:\n\n${code}\n\nAbraços, LHB Studio`
  };
  await transporter.sendMail(mailOptions);
  console.log('email sent to', order.email);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
