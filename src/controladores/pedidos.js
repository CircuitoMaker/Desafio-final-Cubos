const pool = require('../conexao')

const cadastrarPedidos = async (req,res)=>{
const {cliente_id,pedido_produtos}=req.body
console.log(pedido_produtos)
    if(!cliente_id||!pedido_produtos){
        return res.status(400).json({erro:'Todos os campos são obrigatórios'})
    }
try {
    const clienteExiste = await pool.query('select id from clientes where id = $1',[cliente_id])
if(clienteExiste.rowCount <1){
    return res.status(400).json({erro:'Cliente não cadastrado'})
}
// const produtoExiste = await pool.query('select id from produtos where id = $1',[produto_id])
// if(produtoExiste.rowCount <1){
//     return res.status(400).json({erro:'Produto não cadastrado'})
// }
// const quantidadeEstoque = await pool('select * from produtos where quantidade_estoque and produto_id = $1,$2',[quantidade_produto,produto_id])
// if(quantidadeEstoque.rowCount <1){
// return res.status(400).json({erro:'Não temos essa quantidade em estoque'})
// }

// const query = 'insert into pedidos(cliente_id,produto_id,quantidade_produto) values($1,$2,$3) returning *'

// const {rows} = await pool.query(query,[cliente_id,produto_id,quantidade_produto])

//     if(rows.length >1){
//         const pedido = rows[0]
//         return res.json(pedido)
//     }
} catch (error) {
    return res.status(500).json({erro:'Erro interno do servidor'})
}
}

module.exports = {
cadastrarPedidos
}