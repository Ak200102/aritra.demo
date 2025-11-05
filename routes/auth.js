const express = require ('express');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const user = require('../models/user');

router.post('/',[
    body('name','Enter a valid Name').isLength({min: 5}),
    body('email','Enter a valid email').isEmail(),
    body('password').isLength({min:5})
    
], (req,res)=>{
    // console.log(req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }).then(user => res.json(user))
    .catch(err=>{console.log(err)
        res.json({error: "please enter a unique value"})
    })
    
    
});
module.exports = router