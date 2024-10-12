const userModel = require("../models/user")
const quizModel = require("../models/quiz")
const questionModel = require("../models/question")
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
const inviteStudents = async(req,res)=>{ // route to invite students 
    try{
        const {email}= req.body;
        const {userId}= req.user;
        const quizId= req.params.id;
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
        if (!user.createdQuiz.includes(quizId)){
            return res.status(403).json({
                message:"User does not have permission"
            })
        }
        const studentId = await userModel.findOne({email});
        if(!studentId){
            return res.status(500).json({
                message:"Student not found"
            })
        }
        if (!quiz.invitedStudents){
            quiz.invitedStudents=[];
        }
        const alreadyInvited = quiz.invitedStudents.some(invitation=>invitation.student.toString()==studentId._id.toString())
        if (alreadyInvited){
            return res.status(400).json({
                message:"Student already invited",
            })
        }
        quiz.invitedStudents.unshift({
            student: studentId._id,
            status: "not_attempted"
        });
        if (!studentId.assignedQuiz){
            studentId.assignedQuiz=[]
        }
        studentId.assignedQuiz.unshift(quiz._id);
        await quiz.save();
        await studentId.save();
        res.status(200).json({
            message :"Student Invited successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const getAllQuiz= async(req,res)=>{ // Route to get all quizes of the user
    try{
        const {userId}= req.user;
        const user = await userModel.findById(userId);
        if (!user){
            return res.status(404).json({
                message:"User Not found"
            })
        }
        res.status(200).json({
            message:"Quiz data fetched successfully",
            data:{
                assignedQuiz: user.assignedQuiz,
                createdQuiz: user.createdQuiz
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const getQuizDetails =async(req,res)=>{ // Function to get quiz details 
    try{
        const {userId}= req.user;
        const quizId = req.params.id;
        const user = await userModel.findById(userId);
        if (!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        const quiz= await quizModel.findById(quizId);
        if (!quiz){
            return res.status(404).json({
                message:"Quiz not found"
            })
        }
        if (!user.createdQuiz.includes(quizId)){
            return res.status(403).json({
                message:"User does not have access"
            })
        }
        res.status(200).json({
            message:"Quiz details fetched successfully",
            data:quiz
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const deleteQuiz = async (req, res) => { // delete quiz route 
    try {
        const { userId } = req.user;
        const quizId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const quiz = await quizModel.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (!user.createdQuiz.includes(quizId)) {
            return res.status(403).json({
                message: "User does not have access"
            });
        }

        user.createdQuiz = user.createdQuiz.filter(id => id.toString() !== quizId);
        await user.save(); 


        for (const student of quiz.invitedStudents) {
            const st = await userModel.findById(student.student);
            if (st) {
                st.assignedQuiz = st.assignedQuiz.filter(id => id.toString() !== quizId);
                await st.save(); 
            }
        }

        await quizModel.findByIdAndDelete(quizId);


        res.status(200).json({
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const createQuestion = async(req,res)=>{ // creating question
    try{
        const {questionText,options,correctOption,marks}=req.body;
        const quizId=req.params.quizid
        const {userId}=req.user;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const quiz = await quizModel.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (!user.createdQuiz.includes(quizId)) {
            return res.status(403).json({
                message: "User does not have access"
            });
        }
        const newQuestion = new questionModel({
            questionText,options,correctOption,marks
        })
        const savedQuestion = await newQuestion.save();
        quiz.questions.push(savedQuestion._id);
        await quiz.save();
        res.status(200).json({
            message:"Question created successfully",
            question: savedQuestion
        })
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