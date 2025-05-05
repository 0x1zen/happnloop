const express=require("express");

const app=express();

const PORT=3000;

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

