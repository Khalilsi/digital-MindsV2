require("dotenv").config({ path: "./utils/.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const adminRoute = require("./src/routes/adminRoute");
const userRoute = require("./src/routes/userRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Connexion à MongoDB
connectDB();

// Routes
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API Copro Backend fonctionne !" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
