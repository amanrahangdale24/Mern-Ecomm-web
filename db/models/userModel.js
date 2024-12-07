const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    orders:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }
},{timestamps:true})

module.exports = mongoose.model("users", userSchema) ;