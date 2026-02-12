const User = require("../models/user");
const Quizz = require("../models/quizz");
const Problem = require("../models/problem");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or password incorrect" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated by an administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username or password incorrect" });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), role: "user" },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN },
    );
    const decoded = jwt.decode(token);

    res.status(200).json({
      message: "Login successful",
      token,
      expiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      user: {
        id: user._id,
        username: user.username,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getDashboardQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "assignedQuizzes",
      match: { isActive: true },
      select: "-questions.correctAnswer",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Assigned quizzes",
      count: user.assignedQuizzes.length,
      quizzes: user.assignedQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.submitQuizAnswers = async (req, res) => {
  try {
    const { userId, quizzId, answers } = req.body;

    const user = await User.findById(userId);
    const quizz = await Quizz.findById(quizzId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!quizz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const alreadyDone = user.quizHistory.some(
      (h) => h.quizz.toString() === quizzId,
    );
    if (alreadyDone) {
      return res
        .status(400)
        .json({ message: "You have already taken this quiz" });
    }

    let totalScore = 0;
    const results = [];

    answers.forEach((answer) => {
      const question = quizz.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        totalScore += question.points;
      }

      results.push({
        questionIndex: answer.questionIndex,
        question: question.question,
        propositions: question.propositions,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      });
    });

    user.totalScore += totalScore;

    user.quizHistory.push({
      quizz: quizzId,
      score: totalScore,
      answers: results,
      completedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: "Quiz soumis avec succès",
      totalScore,
      newTotalScore: user.totalScore,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("username totalScore quizHistory")
      .populate("quizHistory.quizz", "title description");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      totalScore: user.totalScore,
      quizHistory: user.quizHistory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDashboardProblems = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "assignedProblems",
      match: { isActive: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Assigned problems",
      count: user.assignedProblems.length,
      problems: user.assignedProblems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.submitProblemAnswer = async (req, res) => {
  try {
    const { userId, problemId, userAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ message: "User answer required" });
    }

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const alreadySubmitted = user.problemHistory.some(
      (h) => h.problem.toString() === problemId,
    );
    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ message: "You have already answered this problem" });
    }

    const isCorrect = null;
    const scoreEarned = 0;

    user.problemHistory.push({
      problem: problemId,
      userAnswer,
      isCorrect,
      scoreEarned,
      submittedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: "Response submitted successfully",
      isCorrect,
      scoreEarned,
      newTotalScore: user.totalScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProblemHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("username totalScore problemHistory")
      .populate("problemHistory.problem", "title description score");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      totalScore: user.totalScore,
      problemHistory: user.problemHistory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
