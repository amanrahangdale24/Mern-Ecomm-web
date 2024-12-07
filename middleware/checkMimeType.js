
const fs = require('fs');

const checkMimeType = (req,res,next)=>{
    try{
        if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/jpeg' ){
            res.status(400).json({
                error: "file type must be jpg/jpeg/png",
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

module.exports = checkMimeType; 