const Joi = require('Joi')
module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().min(5).max(2000).required(),
        image: Joi.string().required(),
        number: Joi.number().min(9).max(9).required()
    })
})