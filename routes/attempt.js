const express = require("express");
const { createAttempt } = require("../controllers/attempt");
const router = express.Router();
router.get("/create_attempt",createAttempt);
module.exports=router