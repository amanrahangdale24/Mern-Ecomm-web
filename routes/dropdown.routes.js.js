const express = require('express'); 
const router = express.Router(); 
const categoryModel = require('../db/models/categoryModel')
const brandModel = require('../db/models/brandModel'); 


router.get('/category', async(req,res)=>{
    try {
        const list = await categoryModel.find().select('title image').sort({_id: -1}); 
        res.status(200).json({
            message: "data fetched",
            status:true,
            list
        })
    } catch (error) {
        res.status(400).json({
            error : "Error occured"
        })
    }
})

router.get('/brand', async(req,res)=>{
    try {
        const list = await brandModel.find().select('title image').sort({_id: -1}); 
        res.status(200).json({
            message: "data fetched",
            status:true,
            list
        })
    } catch (error) {
        res.status(400).json({
            error : "Error occured"
        })
    }
})


module.exports = router; 