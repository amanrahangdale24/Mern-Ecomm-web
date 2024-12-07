const { check } = require('express-validator');
const fs = require('fs');

const checkImgSize = (req,res,next)=>{
    try{
        if(req.file.size > 1024*1024*1){
            res.status(400).json({
                error: "file size must be lesser than 1mb",
            })
            throw(error)
        }
        next();
    }
    catch(error){
        fs.unlink(req.file.path, (error)=>{
            if(error){
                console.log(error); 
            }
        })
    }
}

module.exports = checkImgSize; 