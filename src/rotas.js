const express = require('express');
const verificarLogin = require('./intermediarios/autenticacaoUsuario');
const listarCategorias = require('./controladores/categorias');
const usuario = require('./controladores/usuarios');
const produto = require('./controladores/produtos');
const cliente = require('./controladores/clientes');

const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao');
const schemaClientes = require('./validacoes/schemaClientes');
const schemaUsuarios = require('./validacoes/schemaUsuarios');
const schemaProdutos = require('./validacoes/schemaProdutos')

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario',validarCorpoRequisicao(schemaUsuarios),usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);

rotas.use(verificarLogin);

rotas.get('/usuario', usuario.detalharPerfilUsuario);
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuarios),usuario.editarPerfilUsuario);

rotas.post('/produto', validarCorpoRequisicao(schemaProdutos),produto.cadastrarProduto);
rotas.put('/produto/:id', validarCorpoRequisicao(schemaProdutos),produto.editarDadosProduto);
rotas.get('/produto', produto.listarProdutos);
rotas.get('/produto/:id', produto.detalharProduto);
rotas.delete('/produto/:id', produto.excluirProduto);

rotas.post('/cliente',validarCorpoRequisicao(schemaClientes),cliente.cadastrarCliente);
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaClientes),cliente.editarCliente);
rotas.get('/cliente', cliente.listarCliente);
rotas.get('/cliente/:id', cliente.detalharCliente);

module.exports = rotas