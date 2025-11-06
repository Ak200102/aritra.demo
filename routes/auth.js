const express = require ('express');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const user = require('../models/user');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'aritra$boy'


//rout1: create a User using : post "/api/auth/createuser".no login required
router.post('/createuser',[
    body('name','Enter a valid Name').isLength({min: 5}),
    body('email','Enter a valid email').isEmail(),
    body('password').isLength({min:5})
    
],async (req,res)=>{
    // console.log(req.body);
    // if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // check whether user with same user exist
    try {
        let newUser = await User.findOne({email:req.body.email});
    if(newUser){
        return res.status(400).json({error:"sorry user with same email already exist"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password , salt);
    // create a new User
    newUser= await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data ={
        user:{
            id: newUser.id
        }
    }
    const authToken=jwt.sign(data, JWT_SECRET);
    res.json({authToken});
    // catch error
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurd")
    }
});
//rout2: Authenticate a User using : post "/api/auth/login".no login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
    
],async (req,res)=>{
    // if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
            return res.status(400).json({error:'please try to log in with correct credentials'});
        }
        const passCompare = await bcrypt.compare(password,user.password);
        if(!passCompare){
            return res.status(400).json({error:'please try to log in with correct credentials'});
        }
        const data = {
            user:{
                id: user.id
            }    
        }
        const authToken=jwt.sign(data, JWT_SECRET);
        res.json({authToken});
    } catch (error) {
       console.log(error);
        res.status(500).send("Internal server error occurd"); 
    }
});
//rout2:Get loggedin  Userdetail using : post "/api/auth/getuser".login required
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
    let userId=req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.log(error);
        res.status(500).send("Internal server error occurd"); 
}
})

module.exports = router