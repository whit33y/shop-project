const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(passportLocal)
module.exports = mongoose.model('User', userSchema)