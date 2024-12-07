const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const productModel = require('../db/models/productsModel')
const categoryModel = require('../db/models/categoryModel')
const brandModel = require('../db/models/brandModel');
const auth = require('../middleware/auth'); 

router.post('/add',
    body('title').trim().isLength({ min: 3 }),
    body('sale_price').trim().isNumeric(),
    body('purchase_price').trim().isNumeric(),
    body('details').trim().isLength({ min: 3 }),
    auth
    , async (req, res) => {
        const {
            title,
            sale_price,
            purchase_price,
            details,
            stock,
            category,
            brand,
            image,
            is_active
        } = req.body;


        try {
            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: "invalid entries"
                })
            }

            const foundedProduct = await productModel.findOne({ title: title });
            if (foundedProduct) {
                return res.status(400).json({
                    error: "this product already exist"
                })
            }

            const newProduct = await productModel.create({
                title,
                sale_price,
                purchase_price,
                details,
                stock,
                category,
                brand,
                image,
                is_active
            })

            await categoryModel.findByIdAndUpdate(category, { $push: { products: newProduct._id } });
            await brandModel.findByIdAndUpdate(brand, { $push: { products: newProduct._id } });

            res.status(200).json({
                message: "product added successfully"
            })
        } catch (error) {
            res.status(400).json({
                error: "error occured while adding product"
            })
        }

    })

router.get('/get', async (req, res) => {
    const pageNum = req.query.page; 
    const pageLimit = 2 ;
    try{
        const list = await productModel.find().populate([
            {
                path: "category",
                select: "-products -__v"
            },
            {
                path: "brand",
                select: "-products -__v"
            },{
                path: "reviews", 
                select: "-product -__v",
                populate:{
                    path:"user",
                    select:"name"
                }
            }
        ]).skip((pageNum-1)*2).limit(pageLimit).sort({_id: -1})
        
        res.status(200).json({
            message: "data fetched",
            status: true,
            list,
            count: list.length
        })
    }catch(error){
        res.status(400).json({
            error: "error occured"
        })
    }
    
})


router.get('/getSingle', async (req, res) => {
    const productId = req.query.productId; 
    try {
        const foundedProduct = await productModel.findById(productId).populate([
            {
                path: "category",
                select: "-products -__v"
            },
            {
                path: "brand",
                select: "-products -__v"
            }
        ])

        res.status(200).json({
            message: "data fetched",
            status: true,
            foundedProduct
        })
    } catch (error) {
        res.status(400).json({ message: "error occured while getting list of products" })
    }
})


router.delete('/delete', async(req,res)=>{
    const productId = req.query.productId; 
    try {
        await productModel.findByIdAndDelete(productId); 

        // remove this product from the category and brandModel also 

        await categoryModel.findOneAndUpdate(
            {products : productId}, 
            {$pull : {products: productId}}
        )
        await brandModel.findOneAndUpdate(
            {products : productId}, 
            {$pull : {products: productId}}
        )

        res.status(200).json({
            message: "deleted successfully",
            status: true
        })
    } catch (error) {
        res.status(400).json("error occured while deleting the product")
    }
})


router.get('/getByCat' ,async(req,res)=>{
    const category = req.query.categoryId ; 
    try{
        const list = await productModel.find({category: category}).populate([
            {
                path: "category",
                select: "-products -__v"
            },
            {
                path: "brand",
                select: "-products -__v"
            }
        ]) 
        res.status(200).json({
            message: "data fetched",
            status: true,
            list
        })
    }catch(error){
        res.status(400).json({ message: "error occured while getting list of products" })
    }
})


router.get('/getByBrand' ,async(req,res)=>{
    const brand = req.query.brandId ; 
    try{
        const list = await productModel.find({brand: brand}).populate([
            {
                path: "category",
                select: "-products -__v"
            },
            {
                path: "brand",
                select: "-products -__v"
            }
        ]) 
        res.status(200).json({
            message: "data fetched",
            status: true,
            list
        })
    }catch(error){
        res.status(400).json({ message: "error occured while getting list of products" })
    }
})


router.put('/update', async(req,res)=>{
    const productId = req.query.productId; 
    const {title, sale_price, purchase_price, details, stock, category, brand, image} = req.body; 

    
        const findedProduct = await productModel.findById(productId); 
        if(!findedProduct){
            return res.status(400).json({
                error: "Product does not exist"
            })
        }
        const isExist = await brandModel.findOne({title:title}); 
    
        findedProduct.title = isExist && isExist.title === title ? findedProduct.title : title
        findedProduct.sale_price = sale_price
        findedProduct.purchase_price = purchase_price
        findedProduct.details = details
        findedProduct.stock = stock
        findedProduct.category = category
        findedProduct.brand = brand
        findedProduct.image = image

        await findedProduct.save(); 

        await brandModel.findOneAndUpdate({products:productId}, {$pull:{products: productId}});  // delete the last old data of the product 
        await brandModel.findByIdAndUpdate(brand, {$push:{products: productId}});  // with same product id our new data is selected

        await categoryModel.findOneAndUpdate({products:productId}, {$pull:{products: productId}});  // delete the last old data of the product 
        await categoryModel.findByIdAndUpdate(category, {$push:{products: productId}});  // with same product id our new data is selected

        res.status(200).json({
            message: "updated successfully",
            status:true,
            findedProduct
        })
    
})




module.exports = router;