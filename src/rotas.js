const express = require('express');
const verificarLogin = require('./intermediarios/autenticacaoUsuario');
const listarCategorias = require('./controladores/categorias');
const usuario = require('./controladores/usuarios');
const produto = require('./controladores/produtos');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);
//remover comentarios
rotas.use(verificarLogin);

rotas.get('/usuario', usuario.detalharPerfilUsuario);
rotas.put('/usuario', usuario.editarPerfilUsuario);

rotas.post('/produto', produto.cadastrarProduto);
rotas.put('/produto/:id', produto.editarDadosProduto);
rotas.get('/produto/:id?',produto.listarProdutos);




module.exports = rotas