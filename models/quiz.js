const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      type: ObjectId,
      ref: "Question", 

    },
  ],
  createdBy: {
    type: ObjectId,
    ref: "User", 
  },
  invitedStudents: [
    {
      student: { 
        type: ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["completed", "not_attempted"],
        default: "not_attempted",
      },
    },
  ],
  totalMarks: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline:{
    type: Date,
    required: true
  }
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
