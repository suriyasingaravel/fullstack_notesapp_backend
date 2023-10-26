const express = require("express");
const {connection} = require("./db");
const {userRouter} = require("./routes/user.routes");
const {noteRouter} = require("./routes/note.routes");
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());
app.use("/users", userRouter);
app.use("/notes", noteRouter);


app.get("/", (req,res)=>{
    res.send({"msg": "Hello from Suriya"})
});

app.listen(3000, async()=>{
   try {
    await connection;
    console.log("Server running at 3000");
    console.log("DB connected to server");
   } 
   catch (error) {
    console.log(error);
   }
   
})