const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");

const AttemptSchema = new mongoose.Schema({
    quiz:{
        type : ObjectId,
        ref: "Quiz",
    },
    attemptBy:{
        type: ObjectId,
        ref: "User"
    },
    answers : [{
        question : {
            type : ObjectId,
            ref: "Question"
        },
        selectedOption :{
            type: Number,
            required: true 
        },
        isCorrect : {
            type : Boolean,
            required: true,
        }
    }],
    score :{
        type : Number,
        default: 0,
    },
    attemptedAt:{
        type : Date ,
        default: Date.now,
    }
})

const Attempt = mongoose.model("Attempt",AttemptSchema);
module.exports = Attempt