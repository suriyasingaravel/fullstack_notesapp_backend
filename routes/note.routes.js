const express = require("express");
const {NoteModel} = require("../model/note.model");
const {auth} = require("../middleware/auth.middleware");


const noteRouter = express.Router();

noteRouter.use(auth)


//Post Note
noteRouter.post("/create", async(req,res)=>{

     try {
        const note = new NoteModel(req.body);
        await note.save();
        res.send({"msg": "New noted added to database", "note": note})
     }
     
     catch (error) {
        res.send({"msg":error});
     }
})

//Get Notes
noteRouter.get("/", async(req,res)=>{
    try {
        const notes = await NoteModel.find({username:req.body.username});
        res.send({"notes":notes})
    } 
    
    catch (error) {
        res.send({"msg":error});
    }
     
})


//Patch note
noteRouter.patch("/update/:noteID", async (req, res) => {
    const { noteID } = req.params;
    const note = await NoteModel.findOne({ "_id": noteID });
    try {
        if (req.body.userID === note.userID) {
            await NoteModel.findByIdAndUpdate({ "_id": noteID }, req.body);
            res.status(200).send({ "msg": `Note ID:${note.userID}  has been updated` });
        } 
        else {
            res.status(401).send({ "msg": "You are not Authorized" });
        }
    }
     catch (error) {
        res.status(400).send({ "error": `There is something wrong: ${error}` });
    }
});


//delete note
noteRouter.delete("/delete/:noteID", async (req, res) => {
    const { noteID } = req.params;

    try {
        const note = await NoteModel.findOne({ "_id": noteID });
        if (req.body.userID === note.userID) {
            await NoteModel.findByIdAndDelete({ "_id": noteID });
            res.status(200).send({ "msg": `Note ID:${note.userID}  has been deleted` });
        } 
        else {
            res.status(401).send({ "msg": "Not Authorized" });
        }
    }
     catch (error) {
        res.status(400).send({ "error": `There is something wrong: ${error}` });
    }
});


module.exports = {noteRouter}
