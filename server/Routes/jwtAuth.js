const express = require("express");
const {check,validationResult} = require("express-validator")
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization")


// SIGN-UP ROUTE

router.post("/signup",[
    check("name","Please provide a valid name")
    .isString(),
    check("email","Please provide a valid email address")
        .isEmail(),
    check("password","Please provide a valid password")
        .isLength({
            min:6,
            max: 20
        })
        
],async (req,res) => {
    try {

        // 1. Destructure the req.body(name,email,password)

        const {name, email, password} = req.body;

        // 2. Check if user exist (if exist then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        // VALIDATED INPUT
        const errors = validationResult(req)
        if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
        }

        // throw error if user already exist
        // 401 "Unauthenticated"
        if(user.rows.length !== 0){
            return res.status(401).json("User already exist");
        }

        // 3. Bcrypt the user password
        
        //saltRound: how much time is needed to calculate a single bcrypt hash 
        //saltRound: cost factor
        const bcryptPassword = await bcrypt.hash(password, 10)

        // 4. Enter the new user inside our database
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
            );


        // 5. Generating jwt token

        const token  = jwtGenerator(newUser.rows[0].user_id);
        // res.cookie('token',tokens.refreshToken,{httpOnly:true});
        // res.cookie("name",token,{
        //     expires:new Date(Date.now() + 2589200000),
        //     httpOnly:true
        // })
        return res.json( { token } );
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")

    }
});

// LOGIN ROUTE

router.post("/login",[
    check("email","Invalid email address")
        .isEmail(),
    check("password","Invalid password")
        .isLength({
            min:6
        })
],async (req,res)=>{
    try {

        // 1. destructure req.body

        const {email, password} = req.body;
        // 2. check if user doesnt exist (if not then we throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[
            email
        ]);

        // check users in table 
        if(user.rows.length === 0){
            return res.status(401).json("Credentials Invalid")
        }
        // 3. check if incoming password as database password

        const validPassword = await bcrypt.compare(password,user.rows[0].user_password) //return boolean

        if(!validPassword){
            return res.status(401).json("Credentials Incorrect")
        }
        // 4. give jwt token

        const token = jwtGenerator(user.rows[0].user_id)

        return res.json({ token });

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
});

// router.get("/verify", authorization, (req, res) => {
//   try {
//     res.json(true);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;