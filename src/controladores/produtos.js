const pool = require('../conexao')

const cadastrarProduto = async(req,res)=>{
const {descricao,quantidade_estoque,valor,categoria_id}=req.body

if(!descricao || !quantidade_estoque || !valor || !categoria_id){
return res.status(400).json({erro:'Para cadastrar um produto, todos os campos devem ser informados.'})
}
 try {
     const produtoExiste = await pool.query('select * from produtos where descricao = $1',[descricao])
    if(produtoExiste.rowCount > 0){
        return res.status(400).json({erro:'Esse produto já foi cadastrado'})
    }

    const categoriaExiste = await pool.query('select * from categorias where id = $1',[categoria_id])
    if(categoriaExiste.rowCount < 1){
        return res.status(400).json({erro:'Esta categoria não existe'})
    }

const query = `
    insert into produtos(descricao,quantidade_estoque,valor,categoria_id)
    values($1,$2,$3,$4) returning *
    `
    const {rows}= await pool.query(query,[descricao,quantidade_estoque,valor,categoria_id])

    const{descricao: _, ...produto} = rows[0]

    return res.status(201).json(produto)

} catch (error) {
    console.log(error)
    return res.status(500).json({erro:'Erro interno do servidor'})
}
}




module.exports = {
    cadastrarProduto
}


// Validar os campos obrigatórios:
//     -   descricao
//     -   quantidade_estoque
//     -   valor
//     -   categoria_id
// -   A categoria informada na qual o produto será vinculado deverá existir.