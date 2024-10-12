const createAttempt=async(req,res)=>{
    try{

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