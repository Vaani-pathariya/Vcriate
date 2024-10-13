const userModel = require("../models/user")
const quizModel = require("../models/quiz")
const attemptModel = require("../models/attempt")
const {ObjectId}= require("mongodb")
const createAttempt=async(req,res)=>{ // Function to create a new Attempt
    try{
        const quizId= req.params.quizid;
        const {userId}= req.user;
        const user = await userModel.findById(userId);
        if (!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        const quiz = await quizModel.findById(quizId);
        if (!quiz){
            return res.status(404).json({
                message:"Quiz not found"
            })
        }
        const attempt= await attemptModel.findOne({quiz:new ObjectId(quizId),attemptBy:new  ObjectId(userId)})
        if (attempt){
            return res.status(403).json({
                message:"You have already attempted the quiz"
            })
        }
        if (quiz.deadline<Date.now()){
            return res.status(403).json({
                message:"The deadline of the quiz has passed"
            })
        }
        const allowed = quiz.invitedStudents&& quiz.invitedStudents.some(includes =>includes.student.toString()==userId )
        if(!allowed){
            return res.status(403).json({
                message:"You are not invited for the quiz"
            })
        }
        const newAttempt = new attemptModel({
            quiz: quiz._id,
            attemptBy: user._id,
        })
        const finalAttempt=  await newAttempt.save();
        res.status(200).json({
            message :"Attempt has been created",
            id: finalAttempt._id
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
const addAttemptedQuestion=async(req,res)=>{

}
const getAllAttempted= async(req,res)=>{

}
const getAttemptedQues= async (req,res)=>{

}
const editAttemptedQues = async(req,res)=>{

}
const deleteAttemptedQues= async(req,res)=>{

}
const getScore = async(req,res)=>{

}
module.exports={
    createAttempt,
    addAttemptedQuestion,
    getAllAttempted,
    getAttemptedQues,
    editAttemptedQues,
    deleteAttemptedQues,
    getScore
}