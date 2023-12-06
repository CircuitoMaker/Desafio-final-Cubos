
const joi = require('joi')

const schemaPedidos = joi.object({
    cliente_id: joi.string().regex(/^[0-9]{8}$/).trim().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.pattern.base":"O id deve conter apenas numeros"
    }),
   observacao: joi.string(),
    produto_id:joi.string().regex(/^[0-9]{8}$/).trim().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.pattern.base":"O id deve conter apenas numeros"
    })

})

module.exports={
    schemaPedidos
}