const mongoose = require('mongoose'); 

const orderSchema = new mongoose.Schema({
    products:[
        {type: Object}
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    } ,
    orderTotal:{
        type: Number
    },
    status:{
        type: String,
        default:"processing"
    },
    address: {
        type: Object
    }
},{timestamps: true})

const orderModel = mongoose.model("orders", orderSchema)

module.exports = orderModel; 