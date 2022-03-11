const Joi  = require('joi')
module.exports.productSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(1000).required(),
        image: Joi.string().required(),
        number: Joi.number().min(100000000).max(999999999).required()
}).required()