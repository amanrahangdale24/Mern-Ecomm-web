const express = require('express'); 
const router = express.Router(); 
const reviewModel = require('../db/models/reviewModel');
const productModel = require('../db/models/productsModel'); 
const { validationResult, body } = require('express-validator');
const auth = require('../middleware/auth'); 

router.post('/add',auth, 
    body('rating').trim().isNumeric(),
    body('message').trim().isLength({min:3}),
    async(req,res)=>{
    const {rating,message,image} = req.body; 
    const product= req.query.productId; 

    try {
        const error = validationResult(req); 
        if(!error.isEmpty()){
            res.status(400).json({
                error: "invalid entries"
            })
        }
        const newReview = await reviewModel.create({
            rating,
            message,
            image,
            product,
            user:req.user.userId
        })
        await productModel.findByIdAndUpdate(product, {$push:{reviews : newReview._id}})
        res.status(200).json({
            message:"Review added",
            status:true,
            newReview
        })
    } catch (error) {
        res.status(400).json({
            error: "error occured"
        })
    }
})

module.exports = router; 