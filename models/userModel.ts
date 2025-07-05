import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter your password"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  forgetPasswordToken: String,
  forgetPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
