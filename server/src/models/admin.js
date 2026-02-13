const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  },
);

adminSchema.pre("save", async function () {
  if (!this.isNew) return;
  const count = await this.constructor.countDocuments();
  if (count > 0) {
    throw new Error("Only one admin is allowed.");
  }
});
module.exports = mongoose.model("Admin", adminSchema);
