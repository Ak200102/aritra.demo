const express = require('express');
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
//route1:get all the notes:get "/api/auth/fetchnotes". login required
router.get('/fetchnotes',fetchuser,async (req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error occurd");
    }
})
//route2:add  the notes:post "/api/auth/addnote". login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min: 3}),
    body('description','Enter a valid email').isLength({min:5})
],async (req,res)=>{
    try {
        const{title,description,tag}=req.body
    // if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const savednote = await note.save();
    res.json(savednote)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error occurd");
    };
})
module.exports=router