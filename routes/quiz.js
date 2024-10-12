const express = require("express")
const router = express.Router();
const { createQuiz }= require("../controllers/quiz")
router.get("/create_quiz",createQuiz);
module.exports=router