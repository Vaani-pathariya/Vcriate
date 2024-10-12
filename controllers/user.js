const userModel = require("../models/user")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")
const signup= async(req,res)=>{
    try{
        const {email,username,password}= req.body;
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email is already registered"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new userModel({
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();
        res.status(200).json({message:"Signup successful"})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
const login = async (req,res)=>{
    try{
        const {email,password}= req.body;
        const existingUser= await userModel.findOne({email});
        if(!existingUser){
            return res.status(401).json({message:"Invalid email or password"})
        }
        const isPasswordValid = await bcrypt.compare(password,existingUser.password);
        if (!isPasswordValid){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token = jwt.sign({userId:existingUser._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        res.status(200).json({message:"Login successful", token: token});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
module.exports={
    signup,
    login
}