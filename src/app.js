const express=require("express");

const app=express();

const {adminAuth,userAuth}= require("./middleware/auth.js")

const PORT=3000;

// admin routes



app.use("/admin",adminAuth);

app.get("/admin/getAllData",(req,res)=>{
    res.status(200).send("All Data");
})

app.get("/user/login",(req,res)=>{
    res.send("user logged in");
})

app.use("/user",userAuth);

app.get("/user",(req,res)=>{
    res.send("User Data");
})

app.post("/user",(req,res)=>{
    res.send("status 200");
})
app.patch("/user",(req,res)=>{
    res.send("Patched User Data");
})
app.put("/user",(req,res)=>{
    res.send("updated user data");
})
app.delete("/user",(req,res)=>{
    res.send("deleted user data");
})

app.use("/test",(req,res)=>{
    res.send("hello from test route");
})

app.use("/hello",(req,res)=>{
    res.send("hello from hello route");

})
// Dynamic ROutes
app.get("/abc/:userId/:userName",(req,res)=>{
    console.log(req.params);
})


// Concept Of Middlewares

app.get("/data",(req,res,next)=>{
    console.log("First Handler");
    next();
    res.send("First Response");
},(req,res,next)=>{
    console.log("Second Handler");
    next();
    res.send("Second Response");
},(req,res)=>{
    console.log("THird Response");
    res.send("Hey!Gotcha.")
})

// Advanced Routing Techniques

app.use("/",(req,res)=>{
    res.send("hello from / route");
})

app.listen(PORT,()=>{
    console.log(`Successfully listening on ${PORT}`);
})

