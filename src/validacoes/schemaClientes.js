const joi = require('joi');

const schemaClientes = joi.object({
    nome: joi.string().min(3).required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.min": "Campo nome deve ter no mínimo 3 letras",
    }),
    email: joi.string().email().trim().required().messages({
      "any.required": "O campo e-mail é obrigatório",
      "string.email": "Verifique se o e-mail digitado está correto.",
    }),
    cpf: joi.string().min(11).max(11).trim().regex(/^[0-9]{11}$/).required().messages({
    "string.min": "Cpf inválido",
    "string.max": "Cpf inválido",
    "any.required": "O campo cpf é obrigatório",
    "string.pattern.base":"O CPF deve conter apenas numeros",
    }),
    cep: joi.string().min(8).max(8).regex(/^[0-9]{8}$/).trim().required().messages({
        "any.required": "O campo cep é obrigatório",
        "string.min": "Cep inválido",
        "string.max": "Cep inválido",
        "string.pattern.base":"O CEP deve conter apenas numeros",
    }),
    rua: joi.string().required().messages({
        "any.required": "O campo rua é obrigatório",
    }),
    numero:joi.string().max(10).trim().required().messages({
        "any.required": "O campo numero é obrigatório",
    }),
    bairro: joi.string().required().messages({
        "any.required": "O campo bairro é obrigatório ",
      }),
    cidade: joi.string().min(3).required().messages({
        "any.required": "O campo cidade é obrigatório",
      }),
    estado: joi.string().min(2).max(2).trim().required().messages({
        "any.required": "O campo cidade é obrigatório",
        "string.min": "Estado inválido",
        "string.max": "Estado inválido",
      }),
    })

    module.exports = schemaClientes