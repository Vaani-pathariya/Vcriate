const express = require("express");
const { createAttempt } = require("../controllers/attempt");
const router = express.Router();
router.route("/attempt").post().get();
router.route("/attempt/:id").post();
router.route("/attempt/:id/:ques").get().patch().delete()
router.route("/score/:id").get();
module.exports=router