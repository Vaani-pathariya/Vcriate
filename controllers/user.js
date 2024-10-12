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
module.exports={
    signup
}