const functions = require("firebase-functions");
const axios = require("axios");

exports.criarPagamento = functions.https.onRequest(async (req, res) => {

const { total, descricao } = req.body;

try {

const response = await axios.post(
"https://api.mercadopago.com/checkout/preferences",
{
items: [
{
title: descricao,
quantity: 1,
currency_id: "BRL",
unit_price: total
}
],
back_urls: {
success: "https://seusite.com/sucesso.html",
failure: "https://seusite.com/erro.html"
}
},
{
headers: {
Authorization: "Bearer SEU_ACCESS_TOKEN_MERCADOPAGO"
}
}
);

res.json({ url: response.data.init_point });

} catch (e) {
res.status(500).send("Erro pagamento");
}

});
