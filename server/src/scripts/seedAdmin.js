const mongoose = require("mongoose");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./utils/.env" });

// Configuration de la connexion
const MONGODB_URI = process.env.MONGO_URI;

console.log("🔗 Tentative de connexion à MongoDB avec URI:", MONGODB_URI);
// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    return seedAdmin();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion:", err);
    process.exit(1);
  });

async function seedAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({
      email: "khalil@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️  L'admin existe déjà dans la base de données");
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash("DigitalMinds3", 10);

    // Créer l'admin
    const admin = new Admin({
      email: "khalil@gmail.com",
      password: hashedPassword,
    });

    await admin.save();

    console.log("✅ Admin créé avec succès!");
    console.log("📧 Email:", admin.email);
    console.log("🆔 ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
    process.exit(1);
  }
}

// || "mongodb://localhost:27017/copro-backend"
