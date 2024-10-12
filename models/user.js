const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user"],
    required: true,
    default: "user",
  },
  assignedQuiz: [
    {
      type: ObjectId,
      ref: "Quiz",
    },
  ],
  createdQuiz: [
    {
      type: ObjectId,
      ref: "Quiz",
    },
  ],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
