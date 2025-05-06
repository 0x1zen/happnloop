const mongoose=require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("URL");
}

module.exports= connectDB;