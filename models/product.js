const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    telNum: Number
})

module.exports = mongoose.model('Product', productSchema)