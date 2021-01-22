const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    superUser: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: 'Не определена'
    },
    fingerPrint: {
        type: String,
        default: ""
    }
})

module.exports = model('User', schema)