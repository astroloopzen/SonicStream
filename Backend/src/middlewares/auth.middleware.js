const jwt = require("jsonwebtoken");



async function authArtist(req, res, next){
    const token = req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                message : "Unauthorized....!"
            })
        };
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
            if(decoded.role !== "artist"){
                return res.status(403).json({
                    message : "You don't have the access to create an album....!"
                });
            }
            req.user = decoded; //new property created in the middleware which can be used in the music controller.
            next();
        }
        catch(err){
            console.log("ERROR:", err);
            return res.status(401).json({
                message : err.message
            })
    }

}

async function authenticate(req, res, next){
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message : "Unauthorized....!"
        })
    };
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    //  Both users AND artists can view the content
    if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to view this content."
            });
        }
        req.user = decoded; //new property created in the middleware which can be used in the music controller.
        next();
    }
    catch(err){
        console.log("ERROR:", err);
        return res.status(401).json({
            message : err.message
        })
    }
}

async function optionalAuthenticate(req, res, next){
    const token = req.cookies.token;
    
    if(!token){
        return next();
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
    }
    catch(err){
        // Do nothing on error, just continue as guest
    }
    next();
}

module.exports = { authArtist , authenticate, optionalAuthenticate };
