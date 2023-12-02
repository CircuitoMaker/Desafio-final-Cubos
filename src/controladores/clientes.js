const pool = require('../conexao');
const joi = require('joi')
const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf , cep , rua , numero, bairro, cidade, estado} = req.body;

    const schemaClientes = joi.object({
        //passando apenas se for passado um nome com mais de 3 letras, pq n existem nome com duas letras acredito
        nome: joi.string().min(3).required().messages({
          "any.required": "O campo nome é obrigatório",
          "string.min": "Campo nome deve ter no mínimo 3 letras",
        }),
        //Email está vontando certo no padrão, só aceito completo,
        // só que ainda esta passando com letras maiusculas
        email: joi.string().email().required().messages({
          "any.required": "O campo e-mail é obrigatório",
          "string.email": "Verifique se o e-mail digitado está correto.",
        }),
        //cpf passando correto somente com 11 digitos, nem menos, nem mais
        cpf: joi.string().min(11).max(11).required().messages({
        "string.min": "Cpf inválido",
        "string.max": "Cpf inválido",
        "any.required": "O campo cpf é obrigatório",
        }),
        //cep só passa com 8 digitos
        cep: joi.string().min(8).max(8).required().messages({
            "any.required": "O campo cep é obrigatório",
            "string.min": "Cep inválido",
            "string.max": "Cep inválido"
        }),
        //está passando com strings de numeros
        rua: joi.string().required().messages({
            "any.required": "O campo rua é obrigatório",
        }),
        //numero eu não coloquei limites de min ou max pq depende do lugar, 
        //mas acho que um limite max de digitos dê pra passar
        numero:joi.string().required().messages({
            "any.required": "O campo numero é obrigatório",
        }),//daqui pra baixo estão passando com strings de numeros em quantidades indefinidas
          bairro: joi.string().required().messages({
            "any.required": "O campo bairro é obrigatório ",
          }),
          cidade: joi.string().min(3).required().messages({
            "any.required": "O campo cidade é obrigatório"
          }),
          estado: joi.string().required().messages({
            "any.required": "O campo cidade é obrigatório",
          }),
         
        })

    

    try {
        //esse await deve ficar no try se não fica sem resposta
        await schemaClientes.validateAsync({nome, email, cpf , cep , rua , numero, bairro, cidade, estado})
       
        const emailUnico = await pool.query('select * from clientes where email = $1', [email]);
        if (emailUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
        };


        const cpfUnico = await pool.query('select * from clientes where cpf = $1', [cpf]);
        if (cpfUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
        }

        const query = `
        insert into clientes (nome,email,cpf,cep,rua,numero,bairro,cidade,estado)
        values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *
    `
        const resultado = await pool.query(query, [nome, email, cpf, cep, rua, numero, bairro, cidade, estado]);
       
        return res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: error.message });
    }


};

const editarCliente = async (req, res) => {

    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {

        const clienteLocalizado = await pool.query('select * from clientes where id =$1', [id]);
        if (clienteLocalizado.rowCount === 0) {
            return res.status(404).json({ erro: 'Cliente não localizado.' })
        }

        if (!nome || !email || !cpf || !cep || !rua || !numero || !bairro || !cidade || !estado) {
            return res.status(400).json({ erro: 'É necessário preencher todos os campos para realizar o cadastro do cliente.' })
        };

        const emailUnico = await pool.query('select * from clientes where email = $1 and id != $2', [email, id]);
        if (emailUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
        };

        const cpfUnico = await pool.query('select * from clientes where cpf = $1 and id != $2', [cpf, id]);
        if (cpfUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
        }



        const query = ` 
        UPDATE clientes 
        SET nome = $1, email = $2, cpf = $3, cep = $4, rua = $5, numero = $6, bairro = $7, cidade = $8, estado = $9    
        WHERE id = $10
        returning *
        `
        const resultado = await pool.query(query, [nome, email, cpf, cep, rua, numero, bairro, cidade, estado, id]);

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }

};



const listarCliente = async (req, res) => {

    try {
        const query = `select * from clientes`;
        const resposta = await pool.query(query);

        return res.status(200).json(resposta.rows);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};


const detalharCliente = async (req, res) => {

    const { id } = req.params;

    try {
        const clienteLocalizado = await pool.query('select * from clientes where id =$1', [id]);
        if (clienteLocalizado.rowCount === 0) {
            return res.status(404).json({ erro: 'Cliente não localizado.' })
        };

        return res.status(200).json(clienteLocalizado.rows[0]);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
}

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarCliente,
    detalharCliente
};