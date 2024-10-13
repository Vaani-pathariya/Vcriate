const express = require("express");
const {
  createAttempt,
  addAttemptedQuestion,
  getAllAttempted,
  getAttemptedQues,
  editAttemptedQues,
  deleteAttemptedQues,
  getScore,
} = require("../controllers/attempt");
const { authenticateToken } = require("../middlewares");
const router = express.Router();
router.use(authenticateToken);
router.route("/attempt/:quizid").post(createAttempt);
router.route("/attempt/:quizid/:id").post(addAttemptedQuestion).get(getAllAttempted);
router
  .route("/attempt/:quizid/:id/:ques")
  .get(getAttemptedQues)
  .patch(editAttemptedQues)
  .delete(deleteAttemptedQues);
router.route("/score/:quizid/:id").get(getScore);
module.exports = router;
