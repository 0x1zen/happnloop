const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
        minLength : 4,
        maxLength : 50
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        lowercase : true,
        required:true,
        unique:true,
        trim:true
    },
    password : {
        type : String,
        required:true
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String
    },
    photoUrl : {
        type : String,
        default : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    about : {
        type : String,
        default : "Heya! I am a happnloop user."
    },
    skills : {
        type : [String]
    }
})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;