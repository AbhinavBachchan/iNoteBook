const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
//1. Route to fetch all notes login required
router.get("/fetchnotes",fetchuser,async(req,res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes);
})
//2. Route to add new notes login required
router.post("/addnotes",fetchuser,[
    //validations
    body("title","This field should not be empty").exists(),
    body("description","Must be graeter than 3 words").isLength({min:3})
],async (req,res)=>{
    try {
    const result = validationResult(req);
    const {title,description,tag} = req.body;
    // if no error in validation then create note and save and send
    if(result.isEmpty()){
           const note = new Notes({title,description,tag,user:req.user.id});
           const savednote = await note.save();
           res.json(savednote);
        }else{
            res.status(400).json({errors:result.array()});
        } 
        //if any unexpected error occurs
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
//3. Route to update existing notes login required
router.put("/updatenotes/:id",fetchuser,async(req,res)=>{
    //getting title and all from req.body
   const {title,description,tag} = req.body;
   try{
    //creating a new note object for storing the updated title and all from the rquest body
   const newNote = {};
   if(title) newNote.title=title;
   if(description) newNote.description=description;
   if(tag) newNote.tag=tag;
   //checking whether the note exists
   let note = await Notes.findById(req.params.id);
   if(!note) return res.status(404).send("Not Found");
   //checking if the user corresponds to the associated note
   //comparing the notes user id with the id that is in req using fetchuser middleware
   if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
   }
   //updating the note by setting the old note to new
   note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
   res.json(note);}
   catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
//4. Route to delete existing note login required
router.delete("/deletenote/:id",fetchuser,async(req,res)=>{
    try{
        //checking whether the note exists
        let note = await Notes.findById(req.params.id);
        if(!note) return res.status(404).send("not found");
        //checking if the user corresponds to the associated note
        //comparing the notes user id with the id that is in req using fetchuser middleware
        if(note.user.toString()!==req.user.id) return res.status(401).send("Not allowed");
        //deleting the note using id provided in the url
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
module.exports = router;