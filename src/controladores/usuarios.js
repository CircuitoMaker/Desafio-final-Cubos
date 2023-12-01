const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaJWT = require("../senhaJWT");
const joi = require("joi");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  const schemaUsuario = joi.object({
    nome: joi.string().min(3).required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.min": "Campo nome deve ter no mínimo 3 letras",
    }),
    email: joi.string().email().required().messages({
      "any.required": "O campo e-mail é obrigatório",
      "string.email": "Verifique se o e-mail digitado está correto.",
    }),
    senha: joi.string().min(5).required().messages({
      "string.min": "A senha deve ter no mínimo 5 caracteres.",
      "any.required": "O campo senha é obrigatório",
    }),
  });

  try {
    await schemaUsuario.validateAsync({ nome, email, senha });

    const emailExiste = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );
    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ erro: "Email informado já existe" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
    insert into usuarios(nome,email,senha)
    values($1,$2,$3) returning *
`;

    const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

    const { senha: _, ...usuario } = rows[0];
    return res.status(201).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "O e-mail não foi informado" });
  }
  if (!senha) {
    return res.status(400).json({ erro: "A senha não foi informada" });
  }
  try {
    const usuario = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (usuario.rowCount < 1) {
      return res.status(400).json({ erro: "E-mail ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaValida) {
      return res.status(400).json({ erro: "E-mail ou senha inválidos" });
    }

    delete usuario.rows[0].senha;
    const userSemSenha = usuario.rows[0];
    const token = jwt.sign(userSemSenha, senhaJWT);
    const resposta = { usuario: userSemSenha, token: token };

    return res.json(resposta);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

const editarPerfilUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos são necessários" });
  }

  try {
    const userId = req.usuario.rows[0].id;
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [userId]
    );

    if (usuarioExistente.rowCount < 1) {
      return res.status(400).json({ erro: "Usuario não encontrado!" });
    }

    const emailExistente = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND id <> $2",
      [email, userId]
    );

    if (emailExistente.rowCount > 0) {
      return res.status(400).json({ erro: "Email não encontrado!" });
    }

    const usuarioAtualizado = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email",
      [nome, email, userId]
    );

    if (usuarioAtualizado.rowCount > 0) {
      const usuarioEditado = usuarioAtualizado.rows[0];
      return res.json(usuarioEditado);
    } else {
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const detalharPerfilUsuario = async (req, res) => {
  const user = req.usuario.rows[0];
  delete user.senha;
  return res.status(200).json(user);
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharPerfilUsuario,
  editarPerfilUsuario,
};
