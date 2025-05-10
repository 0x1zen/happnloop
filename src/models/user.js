const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
        minLength : 2,
        maxLength : 50
    },
    lastName : {
        type : String,
        minLength : 2,
        maxLength : 50
    },
    emailId : {
        type : String,
        lowercase : true,
        required:true,
        unique:true,
        trim:true,
        immutable : true,
        minLength : 5,
        maxLength : 50
    },
    password : {
        type : String,
        required:true,
        minLength : 8,
        maxLength : 25
    },
    age : {
        type : Number,
        min : 18 ,
    },
    gender : {
        type : String,
        validate : {
            validator : (value)=>{
                return ["male","female","other"].includes(value);
            },
            message : props=> `Your input should be "male","female" or "other".Your current input is "${props.value}".`
        }
    },
    photoUrl : {
        type : String,
        default : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    about : {
        type : String,
        default : "Heya! I am a happnloop user.",
        minLength : 20,
        maxLength : 200
    },
    skills : {
        type : [String],
        validate : {
            validator : (value)=>{
                return value.length<=20;
            },
             message: props => `You can add up to 20 skills only. Currently, you have ${props.value.length}.`
        }
    }
},{timestamps:true})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;