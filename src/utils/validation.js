const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName.trim() || !lastName.trim()){
        throw new Error("Invalid firstName or lastName");
    }
    if(!validator.isEmail(emailId.trim())){
        throw new Error("Invalid emailId");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Weak Password");
    }
}

const validateLoginData = (req)=>{
    const {emailId,password} = req.body;
    if(!validator.isEmail(emailId.trim())){
        throw new Error("Invalid emailId");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Invalid Password");
    }
}

module.exports = {validateSignUpData,validateLoginData};