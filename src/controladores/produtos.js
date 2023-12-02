const pool = require("../conexao");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  try {
  
    const produtoExiste = await pool.query(
      "select * from produtos where descricao = $1",
      [descricao]
    );
    if (produtoExiste.rowCount > 0) {
      return res.status(400).json({ erro: "Esse produto já foi cadastrado" });
    }

    const categoriaExiste = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );
    if (categoriaExiste.rowCount < 1) {
      return res.status(400).json({ erro: "Esta categoria não existe" });
    }

    const query = `
    insert into produtos(descricao,quantidade_estoque,valor,categoria_id)
    values($1,$2,$3,$4) returning *
    `;
    const { rows } = await pool.query(query, [
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    ]);

    if (rows.length > 0) {
      const produto = rows[0];
      return res.status(201).json(produto);
    }
  } catch (error) {
   
    return res.status(400).json({ erro: error.message });
  }
};

const editarDadosProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  try {
    const produtoExiste = await pool.query(
      "select * from produtos where id = $1",
      [id]
    );
    if (produtoExiste.rowCount < 1) {
      return res.status(400).json({ erro: "Produto não encontrado!" });
    }

    const categoriaExiste = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );
    if (categoriaExiste.rowCount < 1) {
      return res.status(400).json({ erro: "Esta categoria não existe" });
    }

    const query = `
UPDATE produtos
SET descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4
WHERE id = $5; 
`;
    const { rows, rowCount } = await pool.query(query, [
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      id,
    ]);

    if (rowCount > 0) {
      return res.status(201).json("Produto Atualizado");
    }
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

const listarProdutos = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    if (categoria_id) {
      const produtoExiste = await pool.query(
        "select * from produtos where categoria_id = $1",
        [categoria_id]
      );
      if (produtoExiste.rowCount < 1) {
        return res
          .status(400)
          .json({ erro: "Sem produtos cadastrados nesta categoria!" });
      }
      const produtoEncontrado = produtoExiste.rows;
      return res.status(201).json(produtoEncontrado);
    }

    const listaProdutos = await pool.query("select * from produtos");
    const lista = listaProdutos.rows;
    return res.status(201).json(lista);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const produtoExiste = await pool.query(
        "select * from produtos where id = $1",
        [id]
      );
      if (produtoExiste.rowCount < 1) {
        return res.status(400).json({ erro: "Produto não encontrado!" });
      }
      const produtoEncontrado = produtoExiste.rows[0];
      return res.status(201).json(produtoEncontrado);
    }
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
    DELETE FROM produtos
    WHERE id = $1;
`;
    const { rowCount } = await pool.query(query, [id]);

    if (rowCount > 0) {
      return res.status(200).json({ erro: "Produto excluído com sucesso!" });
    } else {
      return res
        .status(404)
        .json({ erro: "Produto não encontrado para exclusão" });
    }
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarProduto,
  editarDadosProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
};
