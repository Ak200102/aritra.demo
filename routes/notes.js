const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();

router.post('/',(req,res)=>{
    const notes = Notes(req.body);
    notes.save();
    // res.json([])
    res.send(req.body);
})
module.exports=router