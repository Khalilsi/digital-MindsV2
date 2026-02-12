const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/login", adminController.login);

router.use(requireAuth);
router.use(requireRole("admin"));

router.post("/users", adminController.createUser);
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.patch("/users/:id/toggle-status", adminController.toggleUserStatus);
router.post(
  "/users/:userId/assign-quizzes",
  adminController.assignQuizzesToUser,
);

router.post("/quizzes", adminController.createQuizz);
router.get("/quizzes", adminController.getAllQuizzes);
router.get("/quizzes/:id", adminController.getQuizzById);
router.put("/quizzes/:id", adminController.updateQuizz);
router.delete("/quizzes/:id", adminController.deleteQuizz);
router.patch("/quizzes/:id/toggle-status", adminController.toggleQuizzStatus);

router.post("/problems", adminController.createProblem);
router.get("/problems", adminController.getAllProblems);
router.get("/problems/:id", adminController.getProblemById);
router.put("/problems/:id", adminController.updateProblem);
router.delete("/problems/:id", adminController.deleteProblem);
router.post(
  "/users/:userId/assign-problems",
  adminController.assignProblemsToUser,
);

router.get("/dashboard/stats", adminController.getDashboardStats);

module.exports = router;
