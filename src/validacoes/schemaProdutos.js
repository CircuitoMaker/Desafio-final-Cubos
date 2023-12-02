const joi = require('joi');

const schemaProdutos = joi.object({
    descricao: joi.string().required().messages({
      "any.required": "O campo descrição é obrigatório",
    }),
    quantidade_estoque: joi.number().required().messages({
      "any.required": "O campo de quantidade estoque é obrigatório",
      "number.base": "Esse campo deve ser preenchido com números",
    }),
    valor: joi.number().min(2).required().messages({
      "any.required": "O campo valor é obrigatório",
      "number.base": "Esse campo deve ser preenchido com números",
      "number.min": "Valor digitado deve ser em centavos(ex:R$ 10,00 = 1000)",
    }),
    categoria_id: joi.number().required().messages({
      "any.required": "O campo categoria é obrigatório",
      "number.base": "Esse campo deve ser preenchido com números",
    }),
  });
  
module.exports = schemaProdutos