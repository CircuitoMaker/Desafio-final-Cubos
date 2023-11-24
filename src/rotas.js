const express = require('express');
const rotas = express();

rotas.get('/', async(req,res)=>{
return res.json('Servidor de pé')
})

module.exports = rotas