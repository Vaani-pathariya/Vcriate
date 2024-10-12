const userModel = require("../models/user")
const quizModel = require("../models/quiz")
const { ObjectId } = require("mongodb");
const createQuiz = async(req,res)=>{ // Function to create a new Quiz
    try{
        const {title,description}= req.body;
        const {userId}=req.user;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const newQuiz= new quizModel({
            title,
            description,
            createdBy: new  ObjectId(userId)
        })
        const finalQuiz = await newQuiz.save();
        if (!user.createdQuiz){
            user.createdQuiz=[];
        }
        user.createdQuiz.unshift(finalQuiz._id);
        await user.save();
        res.status(200).json({
            message :"Quiz created successfully",
            data:{
                title : finalQuiz.title,
                description: finalQuiz.description ,
                id : finalQuiz._id
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const changeDeadline = async (req,res)=>{ // Function to change deadline of the quiz
    try{
        const {deadline}= req.body; // the date should be in iso format 
        const {userId}= req.user;
        const quizId=req.params.id
        if(!Date.parse(deadline)){
            return res.status(400).json({message:"Invalid date format"})
        }
        const user = await userModel.findById(userId);
        if (!user){
            return res.status(404).json({message:"User not found"});
        }
        const quiz = await quizModel.findById(quizId);
        if(!quiz){
            return res.status(404).json({message:"Quiz not found"});
        }
        if (!user.createdQuiz.includes(quizId)){
            return res.status(403).json({
                message:"You don't have permission"
            })
        }
        quiz.deadline=new Date(deadline)
        const finalQuiz= await quiz.save();
        res.status(200).json({
            message:"Deadline updated successfully",
            data:{
                id: quizId,
                deadline: finalQuiz.deadline
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const inviteStudents = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const getAllQuiz= async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const getQuizDetails =async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const deleteQuiz=async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const createQuestion = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const deleteQuestion = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const getQuestion= async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const updateQuestion = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
module.exports={
    createQuiz,
    getAllQuiz,
    getQuizDetails,
    deleteQuiz,
    createQuestion,
    deleteQuestion,
    getQuestion,
    updateQuestion,
    changeDeadline,
    inviteStudents
}