const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuiz,
  getQuizDetails,
  deleteQuiz,
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
  changeDeadline,
  inviteStudents,
} = require("../controllers/quiz");
const { authenticateToken } = require("../middlewares");
router.use(authenticateToken);
router.route("/quiz").post(createQuiz).get(getAllQuiz);
router.route("/quiz/:id").get(getQuizDetails).delete(deleteQuiz);
router.route("/question").post(createQuestion);
router
  .route("/question/:id")
  .delete(deleteQuestion)
  .get(getQuestion)
  .patch(updateQuestion);
router.route("/change-deadline/:id").post(changeDeadline)
router.route("/invite-students/:id").post(inviteStudents)
module.exports = router;
