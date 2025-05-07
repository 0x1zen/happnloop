const express = require("express");
const connectDB = require("./config/database");
const User=require("./models/user");
const app = express();

const PORT = 3000;

// API's

// middlware to parse data to json

app.use(express.json());

// Sign up API

app.post("/signup",async(req,res)=>{
  try{ 
    const user=new User(req.body); 
    const newUser=await user.save();
      res.status(200).send("User Created Successfully");
  }catch(err){
    res.status(500).send("Error Occured " + err.message);
  }
  
})

// Find By ID And Delete

app.get("/delete",async(req,res)=>{
  const userId=req.body.userId;
  try{
    const result=await User.findByIdAndDelete({_id : userId});
    console.log(result);
    if(result){
      res.status(200).send("User Deleted Successfully");
    }
    else{
      res.status(404).send("User Not Found");
    }
  }catch(err){
    console.error("Error Occured "+err.message);
  }
})

// Update User Info by user id
app.patch("/update",async(req,res)=>{
  const userInfoUpdate = req.body;
  try{
    const result = 
    await User.findByIdAndUpdate({_id:userInfoUpdate.userId},userInfoUpdate.data);
  if(result){
    res.status(200).send("User Data Updated Successfully");
  }
  else{
    res.status(404).send("User Not Found");
  }
  }catch(err){
    console.error("Error Occured "+err.message);
  }
  
})

// Feed API - Get all the users from the database
app.get("/feed",async(req,res)=>{
  try{
    const allUsers=await User.find({});
    res.status(200).send(allUsers);
  }catch(err){
    console.error("Error Occured " + err.message);
  }
})

// Find A User By His Email Id - GET

app.get("/user",async(req,res)=>{
  const userEmail = await req.body.emailId;
  try{
    const userData=await User.find({emailId : userEmail});
    if(userData.length>0){
      res.status(200).send(userData);
    }
    else{
      res.status(404).send("No user Found With This Email Id");
    }
    
  }catch(err){
    console.error("Error Occured " + err.message);
  }
})

// Database connectivity and listener
connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Successfully listening on ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Error connecting the database");
  });
