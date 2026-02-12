const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/login", userController.login);

router.use(requireAuth);
router.use(requireRole("user"));
router.get("/:userId/dashboard/quizzes", userController.getDashboardQuizzes);
router.post("/quizzes/submit", userController.submitQuizAnswers);
router.get("/:userId/history", userController.getQuizHistory);

router.get("/:userId/dashboard/problems", userController.getDashboardProblems);
router.post("/problems/submit", userController.submitProblemAnswer);
router.get("/:userId/problem-history", userController.getProblemHistory);

module.exports = router;
