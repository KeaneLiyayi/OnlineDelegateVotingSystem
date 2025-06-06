import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    regNo: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    faculty: String,
    year: Number,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    password: { type: String },
    hasVoted: { type: Boolean, default: false },
    otp: { type: String },
otpExpiry: { type: Date },
otpVerified: { type: Boolean, default: false }
      
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
