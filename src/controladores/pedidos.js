const pool = require('../conexao');

const cadastrarPedidos = async (req, res) => {
    const { cliente_id, pedido_produtos, observacao } = req.body;
  
    try {
      const clienteExiste = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
      if (clienteExiste.rowCount === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

  let valor_total = 0;
      
  for (const pedido of pedido_produtos) {
        const { produto_id, quantidade_produto } = pedido;
  
        // Verifica se o produto existe
        //const produtoExiste = await pool.query('SELECT id, quantidade_estoque FROM produtos WHERE id = $1', [produto_id]);
        const produtoExiste = await pool.query('SELECT * FROM produtos WHERE id = $1', [produto_id]);
        if (produtoExiste.rowCount === 0) {
          return res.status(400).json({ erro: `Produto com ID ${produto_id} não encontrado` });
        }
        // verifica se tem a qtdade no estoque
        const estoqueDisponivel = produtoExiste.rows[0].quantidade_estoque;
        if (quantidade_produto > estoqueDisponivel) {
          return res.status(400).json({ erro: `Produto com ID ${produto_id} tem quantidade insuficiente em estoque` });
        }
   
        //incrementa o valor total com o valor do prodito VEZES a quantidade de produtos no pedido
        valor_total += produtoExiste.rows[0].valor * quantidade_produto;
      }
  
      // Se todos os produtos estiverem validados, cadastrar o pedido no banco
        // inseri o pedido na tabela de Perdidos
        const insertPedidoQuery = 'INSERT INTO pedidos (cliente_id, observacao, valor_total) VALUES ($1, $2, $3) RETURNING id';
        const valoresPedido = [cliente_id, observacao, valor_total]; 
        const resultadoInsercaoPedido = await pool.query(insertPedidoQuery, valoresPedido);
        const pedidoId = resultadoInsercaoPedido.rows[0].id;
  
        // Inserir os produtos associados ao pedido na tabela 'produtos_pedidos'
        for (const pedido of pedido_produtos) {
          const { produto_id, quantidade_produto } = pedido;
          
         const produtoValorQuery = 'SELECT valor FROM produtos WHERE id = $1';
         const produtoValorResult = await pool.query(produtoValorQuery, [produto_id]);
         const valorDoProduto = produtoValorResult.rows[0].valor;
         
         const insertProdutosPedidoQuery = 'INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade_produto,valor_produto) VALUES ($1, $2, $3, $4)';
         const valoresProdutosPedido = [pedidoId, produto_id, quantidade_produto,valorDoProduto];
  
         await pool.query(insertProdutosPedidoQuery, valoresProdutosPedido);
        }

      return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso' });
  
      } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor' });
      }
 };
  
    


const listarPedidos = async (req, res)=>{
    const {cliente_id} = req.query;

    //SE for passado algum parametro...
if(cliente_id && cliente_id > 0){
    try {
        const clienteExiste = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
        if (clienteExiste.rowCount === 0) {
          return res.status(400).json({ erro: 'Cliente não encontrado' });
        }

    const pedidosExistem = await pool.query('SELECT * FROM pedidos WHERE cliente_id = $1', [cliente_id]);
    if (pedidosExistem.rowCount === 0) {
        return res.status(400).json({ erro: 'nao existem pedidos'});
      }

      return res.status(201).json(pedidosExistem.rows);

        }catch{
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
}

//SE nao for passado nenhum parametro... busca todas as transaçoes
try{
const pedidoscadastrados = await pool.query('SELECT * FROM pedidos');
if (pedidoscadastrados.rowCount === 0) {
    return res.status(400).json({ erro: 'nao existem pedidos cadastrados'});
  }
  return res.status(201).json(pedidoscadastrados.rows);
}catch{
    return res.status(500).json({ erro: 'Erro interno do servidor' });
}




};


module.exports = {
cadastrarPedidos,
listarPedidos
}