const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName.trim() || !lastName.trim()) {
    throw new Error("Invalid firstName or lastName");
  }
  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Invalid emailId");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Invalid emailId");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid Password");
  }
};

const validateProfileEditData = (req) => {
  const data = req.body;
  const allowedUpdates = [
    "about",
    "skills",
    "firstName",
    "lastName",
    "photoUrl",
  ];
  const isAllowed = Object.keys(data).every((key) =>
    allowedUpdates.includes(key)
  );
  if(isAllowed){
    if(data.photoUrl){
        if(!validator.isURL(data.photoUrl)){
            throw new Error("Invalid Photo URL");
        }
    }
    if(data.about){
        if(data.about.length>200){
            throw new Error("About Length Exceeded");
        }
    }
    if(data.skills){
        if(data.skills.length>20){
            throw new Error("Skills Length Exceeded");
        }
    }
    if(data.firstName){
        if(data.firstName.length<2 || data.firstName.length>50){
            throw new Error("firstName Length Exceeded");
        }
    }
    if(data.lastName){
        if(data.lastName.length<2 || data.lastName.length>50){
            throw new Error("lastName Length Exceeded");
        }
    }
  }
  return isAllowed;
};
module.exports = { validateSignUpData, validateLoginData ,validateProfileEditData };
