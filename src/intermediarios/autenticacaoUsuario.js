const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJWT');
const pool = require('../conexao.js');

const verificarLogin = async (req, res, next) => {
    const { autorizacao } = req.headers;


    if (!autorizacao) {
        res.status(401).json({ mensagem: 'Não autorizado.' });
    }

    const token = autorizacao.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt);

        const usuario = await pool.query('select * from usuarios where id = $1', [id]);

        if (!usuario) {
            res.status(401).json({ mensagem: 'Não autorizado.' });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }
};

module.exports = verificarLogin;