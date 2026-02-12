const Admin = require("../models/admin");
const User = require("../models/user");
const Quizz = require("../models/quizz");
const Problem = require("../models/problem");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Tentative de login avec:", email);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin non trouvé pour cet email");
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("Admin trouvé, vérification du mot de passe...");
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("Mot de passe valide ?", isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { sub: admin._id.toString(), role: "admin" },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN },
    );
    const decoded = jwt.decode(token);

    res.status(200).json({
      message: "Connexion réussie",
      token,
      expiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Ce username existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      createdBy: admin._id,
    });

    await user.save();

    res.status(201).json({
      message: "User créé avec succès",
      user: {
        id: user._id,
        username: user.username,
        totalScore: user.totalScore,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Liste des users",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("createdBy", "email")
      .populate("quizHistory.quizz", "title")
      .populate("problemHistory.problem", "title description");

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    res.status(200).json({ message: "User modifié avec succès", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    res.status(200).json({ message: "User supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.assignQuizzesToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { quizIds } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    user.assignedQuizzes = quizIds;
    await user.save();

    res.status(200).json({
      message: "Quiz assignés avec succès",
      assignedQuizzes: user.assignedQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? "activé" : "désactivé"} avec succès`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createQuizz = async (req, res) => {
  try {
    const { title, description, questions, duration } = req.body;

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const quizz = new Quizz({
      title,
      description,
      questions,
      duration,
      createdBy: admin._id,
    });

    await quizz.save();

    res.status(201).json({
      message: "Quiz créé avec succès",
      quizz,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quizz.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Liste des quiz",
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getQuizzById = async (req, res) => {
  try {
    const quizz = await Quizz.findById(req.params.id).populate(
      "createdBy",
      "email",
    );

    if (!quizz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    res.status(200).json({ quizz });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateQuizz = async (req, res) => {
  try {
    const { title, description, questions, duration } = req.body;

    const quizz = await Quizz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, duration },
      { new: true, runValidators: true },
    );

    if (!quizz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    res.status(200).json({ message: "Quiz modifié avec succès", quizz });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteQuizz = async (req, res) => {
  try {
    const quizz = await Quizz.findByIdAndDelete(req.params.id);

    if (!quizz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    res.status(200).json({ message: "Quiz supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.toggleQuizzStatus = async (req, res) => {
  try {
    const quizz = await Quizz.findById(req.params.id);

    if (!quizz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    quizz.isActive = !quizz.isActive;
    await quizz.save();

    res.status(200).json({
      message: `Quiz ${quizz.isActive ? "activé" : "désactivé"} avec succès`,
      quizz: {
        id: quizz._id,
        title: quizz.title,
        isActive: quizz.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalQuizzes = await Quizz.countDocuments();
    const activeQuizzes = await Quizz.countDocuments({ isActive: true });

    const users = await User.find();
    const averageScore =
      users.length > 0
        ? users.reduce((sum, user) => sum + user.totalScore, 0) / users.length
        : 0;

    const topUsers = await User.find()
      .select("username totalScore")
      .sort({ totalScore: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalUsers,
        activeUsers,
        totalQuizzes,
        activeQuizzes,
        averageScore: Math.round(averageScore),
      },
      topUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const { title, description, score } = req.body;

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const problem = new Problem({
      title,
      description,
      score,
      createdBy: admin._id,
    });

    await problem.save();

    res.status(201).json({
      message: "Problème créé avec succès",
      problem: {
        id: problem._id,
        title: problem.title,
        description: problem.description,
        score: problem.score,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Liste des problèmes",
      count: problems.length,
      problems,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "createdBy",
      "email",
    );

    if (!problem) {
      return res.status(404).json({ message: "Problème non trouvé" });
    }

    res.status(200).json({ problem });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { title, description, score } = req.body;

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, description, score },
      { new: true, runValidators: true },
    );

    if (!problem) {
      return res.status(404).json({ message: "Problème non trouvé" });
    }

    res.status(200).json({ message: "Problème modifié avec succès", problem });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problème non trouvé" });
    }

    res.status(200).json({ message: "Problème supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.assignProblemsToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { problemIds } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    user.assignedProblems = problemIds;
    await user.save();

    res.status(200).json({
      message: "Problèmes assignés avec succès",
      assignedProblems: user.assignedProblems,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
