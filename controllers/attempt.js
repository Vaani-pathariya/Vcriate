const userModel = require("../models/user")
const quizModel = require("../models/quiz")
const attemptModel = require("../models/attempt")
const questionModel = require("../models/question")
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
const addAttemptedQuestion=async(req,res)=>{ // Function to add question 
    try{
        const quizId= req.params.quizid;
        const {userId}= req.user;
        const attemptId= req.params.id
        const quesId= req.params.ques
        const {selectedOption}=req.body
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
        if (quiz.deadline<Date.now()){
            return res.status(403).json({
                message:"The deadline of the quiz has passed"
            })
        }
        const ques= await questionModel.findById(quesId)
        if (!ques){
            return res.status(404).json({
                message:"Question not found"
            })
        }
        const attempt = await attemptModel.findById(attemptId)
        if (!attempt){
            return res.status(404).json({
                message:"Attempt not found"
            })
        }
        const alreadyQues= attempt.answers && attempt.answers.some(id=>id.question.toString()==quesId)
        if(alreadyQues){
            return res.status(403).json({
                message:"You have already attempted the question"
            })
        }
        const correct = selectedOption==ques.correctOption
        attempt.answers.push({
            question: ques._id,
            selectedOption,
            isCorrect:correct
        })
        if(correct){
            attempt.score = attempt.score+ ques.marks
        }
        await attempt.save();
        res.status(200).json({
            message:"Question response saved successfully"
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
const getAllAttempted= async(req,res)=>{ // get all attempted 
    try{
        const quizId= req.params.quizid;
        const {userId}= req.user;
        const attemptId= req.params.id
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
        if (quiz.createdBy.toString()!=user._id.toString()){
            return res.status(403).json({
                message:"Action not allowed"
            })
        }
        const attempt = await attemptModel.findById(attemptId)
        if (!attempt){
            return res.status(404).json({
                message:"Attempt not found"
            })
        }
        res.status(200).json({
            message:"Action successful",
            data: attempt,
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
const getAttemptedQues = async (req, res) => { // Route to get an attempted question's response 
    try {
        const quizId = req.params.quizid;
        const { userId } = req.user;
        const attemptId = req.params.id;
        const quesId = req.params.ques;
        
     
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const quiz = await quizModel.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        
        const question = await questionModel.findById(quesId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }


        const attempt = await attemptModel.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }


        const attemptedQues = attempt.answers.find(ans => ans.question.toString() === quesId);
        if (!attemptedQues) {
            return res.status(404).json({ message: "Question not attempted" });
        }

        res.status(200).json({
            message: "Question retrieved successfully",
            attemptedQuestion: attemptedQues
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const editAttemptedQues = async(req,res)=>{
    try{
        
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
const deleteAttemptedQues= async(req,res)=>{
    try{
        
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
const getScore = async(req,res)=>{ //Get total score 
    try{
        const quizId= req.params.quizid;
        const {userId}= req.user;
        const attemptId= req.params.id
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
        const attempt = await attemptModel.findById(attemptId)
        if (!attempt){
            return res.status(404).json({
                message:"Attempt not found"
            })
        }
        if(attempt.attemptBy.toString()!=userId){
            return res.status(404).json({
                message:"Action not allowed"
            })
        }
        res.status(200).json({
            message:"Success",
            score : attempt.score
        })
    }catch (error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
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