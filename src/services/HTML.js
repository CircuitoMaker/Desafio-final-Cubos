const pool = require('../conexao');

async function geraPaginaHTML(pedido) {
    const { cliente_id, observacao, pedido_produtos } = pedido;

    let nome = "";
    let cpf = "";
    let cep = "";
    let rua = "";
    let numero = "";
    let bairro = "";
    let cidade = "";
    let estado = "";

    try {
        const cliente = await pool.query("SELECT * FROM clientes WHERE id = $1", [cliente_id]);
        if (cliente.rowCount > 0) {
            const clienteData = cliente.rows[0];
            nome = clienteData.nome ?? 'Nome não disponível';
            cpf = clienteData.cpf ?? 'CPF não disponível';
            cep = clienteData.cep ?? 'CEP não disponível';
            rua = clienteData.rua ?? 'Rua não disponível';
            numero = clienteData.numero ?? 'Número não disponível';
            bairro = clienteData.bairro ?? 'Bairro não disponível';
            cidade = clienteData.cidade ?? 'Cidade não disponível';
            estado = clienteData.estado ?? 'Estado não disponível';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
    }

    let quantidadeTotal = 0;
    let valorTotalComQuantidade = 0;

    let html = `
    <html>
    <head>
        <title>Detalhes do Pedido</title>
        <style>
            .container-verde {
                background-color: #c2f0c2;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 10px;
            }
            .container-roxo {
                background-color: #e5ccff;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 10px;
            }
            .valor {
                background-color: #f0f0f0;
                padding: 5px;
                margin-bottom: 10px;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Sombreado leve */
            }
        </style>
    </head>
    <body>
        <h2>Produtos</h2>
        <div class="valor">
            <h1>Detalhes do Pedido</h1>
        </div>       
`;

let containerClass = 'container-roxo'; 

for (const produto of pedido.pedido_produtos) {
    containerClass = containerClass === 'container-verde' ? 'container-roxo' : 'container-verde';

        let nomeProduto = '';
        let valor = 0;
        try {
            const resultado = await pool.query("SELECT * FROM produtos WHERE id = $1", [produto.produto_id]);
            if (resultado.rowCount > 0) {
                nomeProduto = resultado.rows[0].descricao;
                valor =  resultado.rows[0].valor;
                 }
        } catch (error) {
            console.error('Erro ao buscar descrição do produto:', error);
        }

        const valorDoProduto = valor ? valor : 0;
        const quantidadeDoProduto = produto.quantidade_produto ? produto.quantidade_produto : 0;
        const valorComQuantidade = valorDoProduto * quantidadeDoProduto;
        valorTotalComQuantidade += valorComQuantidade;
        quantidadeTotal += quantidadeDoProduto;

        html += `
        <div class="${containerClass}">
            <p><strong>Nome do Produto:</strong> ${nomeProduto}</p>
            <p><strong>Quantidade:</strong> ${quantidadeDoProduto}</p>
            <p><strong>Valor do Produto:</strong> ${formatarParaReal(valorDoProduto)}</p>
        </div>`;
}

html += `
        <div class="valor">
            <p><strong>Quantidade Total de Itens:</strong> ${quantidadeTotal}</p>
            <p><strong>Valor Total:</strong> ${formatarParaReal(valorTotalComQuantidade)}</p>
        </div>
    </body>
    </html>`;

return html;
}

function formatarParaReal(valor) {
    valor = valor / 1000;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = geraPaginaHTML;
