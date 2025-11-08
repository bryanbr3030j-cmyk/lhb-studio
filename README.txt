
LHB Studio - Pacote recreado (gratuito)
======================================

Conteúdo do pacote:
- public/index.html, public/style.css, public/client.js  (frontend)
- products.json (lista de produtos)
- server.js (backend Node.js, simula cobrança Pix e envia email após webhook simulate)
- package.json
- README.txt (este arquivo)

Como testar localmente (rápido):
1) tenha Node.js e npm instalados.
2) extraia este pacote e abra o terminal na pasta.
3) rode: npm install
4) rode: npm start
5) abra http://localhost:3000
6) faça uma compra (vai retornar um "pix copy" falso). Para simular pagamento, pegue o orderId criado (ver orders.json) e POST em /webhook/simulate-pay com {"orderId":"<id>"}.

Observações:
- Para enviar emails reais, configure variáveis de ambiente SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM) ou use serviço de email.
- Para receber Pix automático real, integre com um PSP (Gerencianet, MercadoPago, Pagar.me) — eu posso ajudar nisso depois.
