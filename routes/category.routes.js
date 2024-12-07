const express = require('express'); 
const router = express.Router(); 
const {body,validationResult} = require('express-validator'); 
const categoryModel = require('../db/models/categoryModel');

router.post('/add',
    body('title').trim().isLength({min:3})
    ,async(req,res)=>{

    const errors = validationResult(req.body); 

    if(!errors.isEmpty()){
        return res.status(400).json({
            error: "invalid title entry"
        })
    }
    const {title, image} = req.body; 

    try {
        const foundedCategory = await categoryModel.findOne({title:title}); 

        if(foundedCategory){
            return res.status(400).json({
                error:"category name already exist"
            })
        }

        await categoryModel.create({
            title, 
            image
        })

        res.status(200).json({
            message: "category added successfully",
            status:true
        })

    } catch (error) {
        res.status(400).json({
            error:"error occured while creating a category"
        })
    }

})

router.put('/update', async(req,res)=>{
    const categoryId = req.query.categoryId; 
    
    const {title,image} = req.body; 

        
        const findedcategory = await categoryModel.findById(categoryId); 
        if(!findedcategory){
            res.status(400).json({
                error: "category does not exist"
            })
        }

        const isExist = await categoryModel.findOne({title: title}); 

        findedcategory.title = isExist && isExist.title === title ? findedcategory.title : title; 
        findedcategory.image = image; 

        await findedcategory.save(); 

        res.status(200).json({
            message: "updated successfully",
            status:true,
            findedcategory
        })
    
})


module.exports = router; 