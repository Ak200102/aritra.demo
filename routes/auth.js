const express = require ('express');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'aritra$boy'


// create a User using : post "/api/author/createuser".no login required
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
        User:{
            id: user.id
        }
    }
    const authToken=jwt.sign(data, JWT_SECRET);
    console.log(authToken);
    res.json({authToken});
    // catch error
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurd")
    }
    
    // .catch(err=>{console.log(err)
    //     res.json({error: "please enter a unique value"})
    // })
    
    
});
module.exports = router