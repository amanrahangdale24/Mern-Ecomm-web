const express = require('express');
const router = express.Router();
const galleryModel = require('../db/models/galleryModel') 
const fileUpload = require('../middleware/fileUpload')
const serverPath = require('../middleware/serverPath')
const checkImgSize = require('../middleware/checkImageSize')
const checkMimeType = require('../middleware/checkMimeType')
router.post('/upload',fileUpload(),checkImgSize,checkMimeType,serverPath,async(req,res)=>{
    try {
        const newImage = galleryModel({
            image: req.file.path // in the db also i could add image path with complete url by doing req.domain + req.file.path 
        })
        const savedImage = await newImage.save(); 
        
        res.status(200).json({
            message : "image uploaded successfully",
            status:true,
            image : req.domain+savedImage.image
        })

    } catch (error) {
        res.status(500).json({
            error: 'Error occurred while uploading the image',
        });
    }
})

module.exports = router; 