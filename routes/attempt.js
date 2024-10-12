const express = require("express");
const { createAttempt } = require("../controllers/attempt");
const { authenticateToken } = require("../middlewares");
const router = express.Router();
router.use(authenticateToken)
router.route("/attempt").post().get();
router.route("/attempt/:id").post();
router.route("/attempt/:id/:ques").get().patch().delete()
router.route("/score/:id").get();
module.exports=router