const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    image: String,
    number: Number
})

module.exports = mongoose.model('Product', productSchema)