import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema({
  username: {
    type: "String",
    requred: [true, "Please provide the username"],
    unique: true,
  },
  email: {
    type: "String",
    requred: [true, "Please provide the username"],
    unique: true,
  },
  password: {
    type: "String",
    requred: [true, "Please provide the username"],
    unique: true,
  },
  isVerfied: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgetPasswordToken: String,
  forgetPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
