const serverPath = (req,res,next)=>{
    const protocol = req.protocol; 
    const hostname = req.get('host'); 
    const domain = `${protocol}://${hostname}/`; 

    req.domain = domain; 
    next(); 
}

module.exports = serverPath; 