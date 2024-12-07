const express = require('express'); 
const router = express.Router(); 

const orderModel = require('../db/models/orderModel'); 
const userModel = require('../db/models/userModel'); 
const cartModel = require('../db/models/cartModel'); 
const auth = require('../middleware/auth'); 


router.post('/place', auth, async(req,res)=>{
    const {number, cvc,exp_month, exp_year} = req.body; // i am skipping this 
    const {address} = req.body; 
    const userId = req.user.userId; 
    
        
        // we will place the order of the items stored in the cart so first we will find cart
        const findedCart = await cartModel.find({user:userId}).populate([
            {
                path:"product"
            }
        ])

        if(findedCart.length === 0){
            return res.status(400).json({
                message :"cart is empty"
            })
        }

        const orderTotal = findedCart.reduce((acc,curr)=>{
            return (acc += curr.cartTotal); 
        },0)

        // lets us place the order 
        const newOrder = new orderModel({
            products : findedCart.map((item)=>{
                return {...item._doc}
            }),
            user: userId, 
            orderTotal:orderTotal,
            address: address
        })

        const savedOrder = await newOrder.save(); 
        console.log(savedOrder); 

        // delete this item from the cart 
        await cartModel.deleteMany({user:userId}); 
        await userModel.findByIdAndUpdate(userId, {$push:{orders: savedOrder._id}}); 

        res.status(400).json({
            message: "order placed Successfully", 
            status:true,
            savedOrder
        })

    
})

router.get('/get',auth,async(req,res)=>{
    const userId = req.user.userId; 
    try {
        const findedOrderes = await orderModel.find({user: userId}).sort({_id: -1}); 
        res.status(200).json({
            message:"fetched successfully",
            status:true,
            findedOrderes
        })
    } catch (error) {
        res.status(400).json({
            message:"somthing went wrong"
        })
    }
})

router.put('/updateStatus', auth, async(req,res)=>{
    const {status} = req.body; 
    const orderId = req.query.orderId;
    try {
        const findedOrder = await orderModel.findById(orderId); 
        if(!findedOrder){
            return res.status(400).json({
                error:"order not found"
            })
        }
        if(findedOrder.status == "delivered"){
            return res.status(400).json({
                error: "order status can't change"
            })
        }
        findedOrder.status = status; 
        await findedOrder.save(); 
        res.status(200).json({
            message:"status updated",
            findedOrder
        })
    } catch (error) {
        res.status(400).json({
            error:"something went wrong"
        })
    }
})

router.get('/list', auth,async(req,res)=>{
    const pageNum = req.query.pageNum; 
    const pageLimit = 2; 
    try{
        const list =await orderModel.find().sort({_id:-1}).skip((pageNum-1)*pageLimit).limit(pageLimit);
        res.status(200).json({
            message: "fetched",
            status:true,
            list
        })
    }catch(error){
        res.status(400).json({
            error:"something went wrong"
        })
    }
})

module.exports = router ; 