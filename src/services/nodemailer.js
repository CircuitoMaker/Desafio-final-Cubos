const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({

    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }



});

const enviar = (to, subject, body) => {

    transporter.enviarEmail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text: body

    })
};

moodule.exports = enviar 