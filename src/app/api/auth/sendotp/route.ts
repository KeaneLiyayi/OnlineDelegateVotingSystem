// pages/api/auth/send-otp.ts
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/mailer"; 
import { NextResponse } from "next/server";

export  async function POST(req: Request) {
  
  const body = await req.json();
  const {email} = body

  try {
    await connectToDB();

    const user = await User.findOne({email});

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpVerified = false;
    await user.save();

    await sendOTPEmail(user.email, otp); // ✅ use your mailer function

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
