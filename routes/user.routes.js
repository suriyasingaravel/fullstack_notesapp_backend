const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const {blackListModel} = require("../model/blacklist.model")

const {UserModel} = require("../model/user.model");

const userRouter = express.Router();

userRouter.post("/register", async(req,res)=>{
   const {username, email,pass} = req.body;

    try {

        bcrypt.hash(pass, 5, async(err, hash)=> {
           if(err){
             res.status(200).send({"message": "Not able to generate hash password", "error":err})
           }
           else{
              const user = new UserModel({
                username: username,
                email:email,
                pass: hash
              });

              await user.save();
              res.status(200).send({"msg":"The new user has been registered", "registeredUser":user});
           }
        });

       
    } 
    
    catch (error) {
        res.status(400).send({"error":`There is some ${error}`});
    }
})


userRouter.post("/login", async(req,res)=>{

    const {email,pass} = req.body;

    try {
        const user = await UserModel.findOne({email});

        if(user){
            bcrypt.compare(pass, user.pass,(err, result)=>{
              if(result){
                const token = jwt.sign({username: user.username, userID:user._id}, "vijay");
                // const refreshToken = jwt.sign({name: 'suriya'}, "ajit", { expiresIn: '5m' });
                // localStorage.setItem("token",token)
                res.status(200).send({"msg":`Login Successful!, Hello ${user.username} Welcome!!`, "token": token});
              }
              else{
                res.status(200).send("Wrong Credentials");
              }
            })
           
        }
        else{
            res.status(400).send('No such user found');
        }
    } 
    
    catch (error) {
        res.status(400).send({"errror":`There is some ${error}`});
    }
})


// userRouter.get("/logout", async(req,res)=>{
//     const token = req.headers.authorization?.split(" ")[1];

//     try {
//         const blackListuser = new blackListModel({
//             token: token,
//           });
//           blackListuser.save();
//         res.status(200).send({"msg":"User has been logged out"});
//     }
//      catch (error) {
//         res.status(400).send({"error": `There is something ${error}`});
//     }
// })


module.exports = {userRouter};