
const enviar = require('../services/nodemailer')


const enviarEmail = async (req, res) => {
    const (to) = //puxar e-mail do usuário logado
        enviar(to, subject, body);

    try {




    } catch (error) {
        return res.status(500).json('Erro interno do servidor.');
    }


};


module.exports = enviarEmail;