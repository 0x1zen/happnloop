const express=require("express");

const app=express();

const PORT=3000;

app.get("/getUserData",(a,b,c)=>{
    // try{
    //     throw new Error("Error");
    // }
    // catch(e){
    //     console.log(e.message);
    //     b.send("Error occured");
    // }
    throw new Error("Hey error occured");
    
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send(err.message);
    }
})

app.listen(PORT,()=>{
    console.log(`Successfully listening on ${PORT}`);
})

