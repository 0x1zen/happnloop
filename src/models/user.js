const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        lastName: {
            type: String,
            trim: true,
            minLength: 2,
            maxLength: 50,
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
            immutable: true,
            minLength: 5,
            maxLength: 50,
            validate: {
                validator: (value) => {
                    return validator.isEmail(value);
                },
                message: (props) => `Invalid EmailID :"${props.value}".`,
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator(value) {
                    return validator.isStrongPassword(value);
                },
                message: (props) => `Weak Password ${props.value}`,
            },
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => {
                    // Mongoose automatically converts the string value into Date
                    // Object.
                    const today = Date.now(); // returns milliseconds since 1970
                    const ageDiffMs = today - value; //gives difference in milliseconds
                    const ageDate = new Date(ageDiffMs); //calculates age from year 1970
                    // so basically 1970 + xxxxxx milli-seconds
                    const age = Math.abs(ageDate.getUTCFullYear() - 1970); //subtracting age with 1970
                    // basically getting age in years
                    return age >= 18;
                },
                message: (props) => `Your age is less than 18`,
            },
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: (props) => `Invalid Gender Entered ${props.value}`,
            },
            // validate: {
            //     validator: (value) => {
            //         return ["male", "female", "other"].includes(value);
            //     },
            //     message: (props) =>
            //         `Your input should be "male","female" or "other".Your current input is "${props.value}".`,
            // },
        },
        photoUrl: {
            type: String,
            default:
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
            validate: {
                validator(value) {
                    return validator.isURL(value);
                },
                message: (props) => `Invalid Photo URL ${props.value}`,
            },
        },
        about: {
            type: String,
            default: "Heya! I am a happnloop user.",
            minLength: 20,
            maxLength: 200,
        },
        skills: {
            type: [String],
            validate: {
                validator: (value) => {
                    return value.length <= 20;
                },
                message: (props) =>
                    `You can add up to 20 skills only. Currently, you have ${props.value.length}.`,
            },
        },
    },
    { timestamps: true },
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id.toString() },
        "DEV@Happnloop$2",
        { expiresIn: "1d" },
    );
    return token;
};
userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
