const validator = require("validator");

const validateLoginData = (req)=>{
    const {emailId,password} = req.body;
    if(!validator.isEmail(emailId.trim())){
        throw new Error("Invalid emailId");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Invalid Password");
    }
}

module.exports = {validateLoginData};