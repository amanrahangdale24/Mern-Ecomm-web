const express = require('express'); 
const router = express.Router(); 
const cartModel = require('../db/models/cartModel'); 
const productModel = require('../db/models/productsModel'); 
const auth = require('../middleware/auth')
// just to check the gateway
const stripePayment = require('../utils/stripePayment'); 

router.post('/add',auth,async(req,res)=>{
    const productId = req.query.productId; 
    const userId = req.user.userId; 
    const result = await stripePayment(4242424242424242,444,12,25,1000); 
    console.log(result); 
    try{
        const findedCart = await cartModel.findOne({product:productId , user:userId}); 
        const findedProduct = await productModel.findById(productId); 
        // if the product is already addded in the cart 
        if(findedCart){
            findedCart.quantity++; 
            findedCart.cartTotal += findedProduct.sale_price
            await findedCart.save(); 
        }else{
            const newCart = new cartModel({
                 user: userId,
                 product:productId,
                 cartTotal:findedProduct.sale_price, 
                 quantity:1
            })

            await newCart.save(); 
        }
        res.status(200).json({
            message:"item added to cart",
            status:true,
        })
    }catch(error){
        res.status(200).json({
            error:"error occured"
        })
    }
})


router.get('/get',auth,async(req,res)=>{
    const userId = req.user.userId;
    try {
        const findedCart = await cartModel.find({user: userId}).populate({
            path:"product",
            select:"title sale_price image"
        })
        const grandTotal = await findedCart.reduce((acc,curr)=>{
            return (acc+=curr.cartTotal); 
        },0)
        res.status(200).json({
            message:"data fetched",
            status:true,
            findedCart,
            grandTotal
        })
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
})

router.put('/update', auth,async(req,res)=>{
    const productId = req.query.productId;
    const userId = req.user.userId; 
    try {
        const findedCart = await cartModel.findOne({product:productId , user:userId}).populate({
            path: "product"
        })
        console.log(findedCart);
        if(findedCart.quantity >1){
            findedCart.quantity--;
            findedCart.cartTotal = findedCart.cartTotal - findedCart.product.sale_price; 
            await findedCart.save(); 
        }else{
            await cartModel.findOneAndDelete({user:userId, product:productId}); 
        }
        res.status(200).json({
            message: "the cart has been updated"
        })
    } catch (error) {
        res.status(400).json({
            error:"something went wrong"
        })
    }
    
})

router.delete('/delete',async(req,res)=>{
    const cartId = req.query.cartId; 
    try {
        await cartModel.findByIdAndDelete(cartId); 
        res.status(200).json({
            message: "the cart has been deleted"
        })
    } catch (error) {
        res.status(400).json({
            error:"something went wrong"
        })
    }
})
module.exports = router; 