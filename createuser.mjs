import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js"; // Adjust path as needed
dotenv.config();

import { connectToDB } from "./src/lib/mongodb.js"
// Create user function (no password hashing)

await connectToDB()
async function createUser({ regNo, email, password, role, faculty, year, otpVerified, otp, otpExpires, hasVoted }) {
    const newUser = new User({
        regNo,
        email,
        password,
        role,
        faculty,
        year,
        otpVerified,
        otp,
        otpExpires,
        hasVoted,
    });

    try {
        await newUser.save();
        console.log(`✅ ${role} created successfully.`);
    } catch (err) {
        console.error("❌ Error creating user:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

// Example usage
await createUser({

    email: "keaneclement04@gmail.com", // null if student
    password: "password123",
    role: "admin" ,              // or "admin"
    
    otpVerified: false,
    otp: null,
    otpExpires: null,
    hasVoted: false,

});
