const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    assignedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizz",
      },
    ],
    assignedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    quizHistory: [
      {
        quizz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quizz",
        },
        score: {
          type: Number,
        },
        answers: [
          {
            questionIndex: { type: Number },
            question: { type: String },
            propositions: [{ type: String }],
            selectedAnswer: { type: Number },
            correctAnswer: { type: Number },
            isCorrect: { type: Boolean },
            pointsEarned: { type: Number, default: 0 },
          },
        ],
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    problemHistory: [
      {
        problem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
        },
        userAnswer: {
          type: String,
        },
        isCorrect: {
          type: Boolean,
        },
        scoreEarned: {
          type: Number,
          default: 0,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
