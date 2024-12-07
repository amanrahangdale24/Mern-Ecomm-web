
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    image:[{
        type:String
    }]
}, {timestamps: true})


module.exports = mongoose.model('reviews', reviewSchema);