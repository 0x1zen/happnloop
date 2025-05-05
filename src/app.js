const express=require("express");

const app=express();

const PORT=3000;

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
app.use("/",(req,res)=>{
    res.send("hello from / route");
})

app.listen(PORT,()=>{
    console.log(`Successfully listening on ${PORT}`);
})

