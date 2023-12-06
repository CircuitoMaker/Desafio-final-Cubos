const pool = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf , cep , rua , numero, bairro, cidade, estado} = req.body;
    
    try {
        
        const emailUnico = await pool.query('select * from clientes where email = $1', [email.toLowerCase()]);
       
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
        const resultado = await pool.query(query, [nome, email.toLowerCase(), cpf, cep, rua, numero, bairro, cidade, estado]);
       
        return res.status(201).json(resultado.rows[0]);

    } catch (error) {
       
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