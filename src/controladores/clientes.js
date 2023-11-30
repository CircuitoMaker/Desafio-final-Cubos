const pool = require('../conexao');



const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    if (!nome || !email || !cpf) {
        return res.status(400).json({ erro: 'É necessário preencher todos os campos para realizar o cadastro do cliente.' })
    };

    try {
        const emailUnico = await pool.query('select * from clientes where email = $1', [email]);
        if (emailUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
        };

        const cpfUnico = await pool.query('select * from clientes where cpf = $1', [cpf]);
        if (cpfUnico.rowCount > 0) {
            return res.status(400).json({ erro: 'E-mail e CPF não podem ter sido cadastrados anteriormente.' });
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

const editarCliente = async (req, res) => {

    const { id } = req.params;
    const { nome, email, cpf } = req.body;


    try {

        const clienteLocalizado = await pool.query('select * from clientes where id =$1', [id]);
        if (clienteLocalizado.rowCount === 0) {
            return res.status(404).json({ erro: 'Cliente não localizado.' })
        }

        if (!nome || !email || !cpf) {
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
        SET nome = $1, email = $2, cpf = $3
        WHERE id = $4
        returning *
        `
        const resultado = await pool.query(query, [nome, email, cpf, id]);

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