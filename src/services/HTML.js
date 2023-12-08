function geraPaginaHTML(pedido) {
    const { id, valor_total, observacao, cliente_id } = pedido.pedido;
    const produtos = pedido.pedido_produtos;

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
                }
                .container-roxo {
                    background-color: #e5ccff;
                    padding: 10px;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <h1>Detalhes do Pedido</h1>
            <p><strong>ID do Pedido:</strong> ${id}</p>
            <p><strong>Valor Total:</strong> ${valor_total}</p>
            <p><strong>Observação:</strong> ${observacao ? observacao : 'Nenhuma observação'}</p>
            <p><strong>ID do Cliente:</strong> ${cliente_id}</p>
            <h2>Produtos</h2>
    `;

    // Adiciona os produtos à lista HTML com contêineres coloridos
    produtos.forEach((produto, index) => {
        // Alterna entre contêineres verde e roxo com base no índice
        const containerClass = index % 2 === 0 ? 'container-verde' : 'container-roxo';

        html += `
            <div class="${containerClass}">
                <p><strong>ID do Produto:</strong> ${produto.produto_id}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade_produto}</p>
                <p><strong>Valor do Produto:</strong> ${produto.valor_produto ? produto.valor_produto : 'Valor não especificado'}</p>
            </div>`;
    });

    // Fecha as tags HTML
    html += `
        </body>
        </html>`;

    return html;
}


// Chamada da função para criar a página HTML
//const paginaHTML = gerarPaginaHTML(pedidoExemplo);

module.exports = geraPaginaHTML
