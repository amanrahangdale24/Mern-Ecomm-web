const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    sale_price:{
        type:Number,
        required:true
    },
    purchase_price:{
        type:Number,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    image:[{
        type:String
    }],
    is_active:{
        type:String
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"reviews"
    }]
}, {timestamps:true});

module.exports = mongoose.model('products', productSchema); 