const express = require('express');
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
//route1:get all the notes:get "/api/notes/fetchnotes". login required
router.get('/fetchnotes',fetchuser,async (req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error occurd");
    }
})
//route2:add  the notes:post "/api/notes/addnote". login required
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
//route3:update an existing note :put "/api/notes/updatenote/id". login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const {title,description, tag}=req.body;
    try {
        // create newNote object
        const newNote = {};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
        // find the note to be updated and update it
        let note =await Note.findById(req.params.id);
        if(!note){return res.status(404).send("not found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true});
        res.json({note})
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error occurd");
    }
    
})
//route4:delete an existing note :delete "/api/notes/deletenote/id". login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        // find the note to be deleted and delete it
        let note =await Note.findById(req.params.id);
        if(!note){return res.status(404).send("not found")}
        // allow deletion only if owner owns note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"success":"Note has been deleted"});
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error occurd");
    }
    
})
module.exports=router