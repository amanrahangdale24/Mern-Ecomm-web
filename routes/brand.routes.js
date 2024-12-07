const express = require('express'); 
const router = express.Router(); 
const {body,validationResult} = require('express-validator'); 
const brandModel = require('../db/models/brandModel');

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
        const foundedBrand = await brandModel.findOne({title:title}); 

        if(foundedBrand){
            return res.status(400).json({
                error:"Brand name already exist"
            })
        }

        await brandModel.create({
            title, 
            image
        })

        res.status(200).json({
            message: "brand added successfully",
            status:true
        })

    } catch (error) {
        res.status(400).json({
            error:"error occured while creating a brand"
        })
    }

})


router.put('/update', async(req,res)=>{
    const brandId = req.query.brandId; 
    
    const {title,image} = req.body; 

        
        const findedBrand = await brandModel.findById(brandId); 
        if(!findedBrand){
            res.status(400).json({
                error: "brand does not exist"
            })
        }

        const isExist = await brandModel.findOne({title: title}); 

        findedBrand.title = isExist && isExist.title === title ? findedBrand.title : title; 
        findedBrand.image = image; 

        await findedBrand.save(); 

        res.status(200).json({
            message: "updated successfully",
            status:true,
            findedBrand
        })
    
})

module.exports = router; 