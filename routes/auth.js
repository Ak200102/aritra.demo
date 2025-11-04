const express = require ('express');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post('/',[
    body('name').isLength({min: 5}),
    body('email').isEmail(),
    body('password').isLength({min:5})
    
],(req,res)=>{
    // console.log(req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
        const user = User(req.body);
        user.save();
        res.send(req.body);
    }
    
});
module.exports = router