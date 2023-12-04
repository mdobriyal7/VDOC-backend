const mongoose = require("mongoose")


const bigin = new mongoose.Schema({
    scopeCode : {
        type: String,
        default : "code"
    }
})
module.exports = mongoose.model("Bigin", bigin)