const pool = require('../conexao');



const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    if (!nome || !email || !cpf) {
        return res.status(400).json({ erro: 'É necessário preencher todos os campos para realizar o cadastro do cliente.' })
    };

    try {
        const emailUnico = await pool.query('select * from clientes where email = $1', [email]);
        if (emailUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail informado já está cadastrado.' });
        };

        const cpfUnico = await pool.query('select * from clientes where cpf = $1', [cpf]);
        if (cpfUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'CPF informado já está cadastrado.' });
        }



        const query = `
        insert into clientes (nome,email,cpf)
        values($1,$2,$3) returning *
    `
        const resultado = await pool.query(query, [nome, email, cpf]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }


};


module.exports = {
    cadastrarCliente,
    editarCliente,
    listarCliente,
    detalharCliente

};