const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
    questionText:{
        type:String,
        required: true 
    },
    options:[
        {
            type:String,
            required:true 
        }
    ],
    correctOption :{
        type:Number,
        required:true 
    },
    marks :{
        type:Number,
        required: true,
    }
})
const Question = mongoose.model("Question",QuestionSchema)
module.exports= Question;