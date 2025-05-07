const mongoose=require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("/happnloop");
}

module.exports= connectDB;