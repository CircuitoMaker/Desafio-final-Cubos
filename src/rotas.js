const express = require('express');
const verificarLogin = require('./intermediarios/autenticacaoUsuario');
const listarCategorias = require('./controladores/categorias');
const usuario = require('./controladores/usuarios');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);

rotas.use(verificarLogin);

rotas.get('/usuario', usuario.detalharPerfilUsuario);
rotas.put('/usuario', usuario.editarPerfilUsuario);
module.exports = rotas