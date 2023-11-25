const bcrypt = require('bcrypt');
const pool = require('../conexao');
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT');
const senhaJWT = require('../senhaJWT');
const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }
  try {
    const emailExiste = await pool.query('select * from usuarios where email = $1', [email]);
    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ erro: 'Email informado já existe'});
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
    insert into usuarios(nome,email,senha)
    values($1,$2,$3) returning *
`

    const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

    const { senha: _, ...usuario } = rows[0];
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

const login = async(req,res)=>{
    const {email,senha}=req.body
    if(!email){
        return res.status(400).json({erro:'O e-mail não foi informado'})
    }
    if(!senha){
        return res.status(400).json({erro:'A senha não foi informada'})
    }
    try {
        const {rows,rowCount}= await pool.query('select * from usuarios where email = $1', [email])
        if(rowCount == 0){
            return res.status(400).json({erro: 'E-mail ou senha inválidos'})
        }
        const {senha: senhaUsuario, ...usuario} = rows[0]

        const senhaCorreta = bcrypt.compare(senha,senhaUsuario)
        if(!senhaCorreta){
            return res.status(400).json({erro:'E-mail ou senha inválidos'})
        }
        const token = await jwt.sign({id: usuario.id}, senhaJWT,{expiresIn:'8h'})
        return res.json(
            usuario,
            token
        )
    } catch (error) {
        return res.status(500).json({erro:'Erro interno do servidor'})
    }

}


module.exports = {
  cadastrarUsuario,
  login
};
