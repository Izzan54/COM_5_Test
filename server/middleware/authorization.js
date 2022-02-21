const jwt = require("jsonwebtoken");
require("dotenv").config()

// to check if token that given to user is valid
module.exports = async (req,res,next) =>{
    try {
        const jwtToken = req.header("token");

        if(!jwtToken){
            return res.status(403).json("Not Authorize")
        }

        // verify: boolean (true,false)
        const payload = jwt.verify(jwtToken,process.env.jwtSecret);
        // console.log(payload);
        req.user = payload.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorize")
    }
}