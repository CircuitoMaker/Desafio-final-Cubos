const express = require('express');
const verificarLogin = require('./intermediarios/autenticacaoUsuario');
const rotas = express();

rotas.get('/', async (req, res) => {
    return res.json('Servidor de pé')
})

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', cadastrarUsuario);
rotas.post('login', login)

rotas.use(verificarLogin);

//APAGARCOMENTÁRIO: Rotas abaixo dependem exigem usuário logado
rotas.get('/usuario', detalharPerfilUsuario);
rotas.put('/usuario', editarPerfilUsuario);
module.exports = rotas