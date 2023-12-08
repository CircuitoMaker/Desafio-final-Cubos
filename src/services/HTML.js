function geraPaginaHTML(pedido) {
    const { id, valor_total, observacao, cliente_id } = pedido.pedido;
    const produtos = pedido.pedido_produtos;

    let quantidadeTotal = 0;
    let valorTotalComQuantidade = 0;

    // Criação da estrutura HTML com estilos embutidos
    let html = `
        <html>
        <head>
            <title>Detalhes do Pedido ${id}</title>
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
                    border-radius: 5px;
                    text-align: center;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Detalhes do Pedido</h1>
            <p><strong>ID do Pedido:</strong> ${id}</p>
            <p><strong>Valor Total:</strong> ${formatarParaReal(valor_total)}</p>
            <p><strong>Observação:</strong> ${observacao ? observacao : 'Nenhuma observação'}</p>
            <p><strong>ID do Cliente:</strong> ${cliente_id}</p>
            <h2>Produtos</h2>
    `;

    // Adiciona os produtos à lista HTML com contêineres coloridos
    produtos.forEach((produto, index) => {
        // Alterna entre contêineres verde e roxo com base no índice
        const containerClass = index % 2 === 0 ? 'container-verde' : 'container-roxo';

        const valorDoProduto = produto.valor_produto ? produto.valor_produto : 0;
        const quantidadeDoProduto = produto.quantidade_produto ? produto.quantidade_produto : 0;

        const valorComQuantidade = valorDoProduto * quantidadeDoProduto;
        valorTotalComQuantidade += valorComQuantidade;
        quantidadeTotal += quantidadeDoProduto;

        html += `
            <div class="${containerClass}">
                <p><strong>ID do Produto:</strong> ${produto.produto_id}</p>
                <p><strong>Quantidade:</strong> ${quantidadeDoProduto}</p>
                <p><strong>Valor do Produto:</strong> ${formatarParaReal(valorDoProduto)} ${quantidadeDoProduto > 1 ? `x ${formatarParaReal(valorComQuantidade)}` : ''}</p>
            </div>`;
    });

    // Contêiner para o valor total
    html += `
            <div class="valor">
                <p><strong>Quantidade Total de Itens:</strong> ${quantidadeTotal}</p>
                <p><strong>Valor Total:</strong> ${formatarParaReal(valorTotalComQuantidade)}</p>
            </div>
        </body>
        </html>`;

    return html;
}

// Função para formatar o valor para o formato de moeda brasileira (Real)
function formatarParaReal(valor) {
    valor = valor / 1000; // Dividindo por 1000 para fins de visualização apenas
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = geraPaginaHTML;
