const mongoose= require("mongoose")
const {ObjectId} = require("mongodb");
const Quiz = require("./quiz");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique : true,
    },
    password :{
        type:String,
        default: null
    },
    username :{
        type:String
    },
    role : {
        type: String,
        enum:['user'],
        required:true,
        default: 'user'
    },
    quiz:[{
        type : ObjectId,
        ref: Quiz
    }]
})
const User = mongoose.model("User",UserSchema);
module.exports = User;