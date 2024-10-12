const express = require("express")
const router = express.Router();
const { createQuiz }= require("../controllers/quiz");
const { authenticateToken } = require("../middlewares");
router.use(authenticateToken)
router.route("/quiz").post().get()
router.route("/quiz/:id").get().delete()
router.route("/question").post()
router.route("/question/:id").delete().get().patch()
module.exports=router