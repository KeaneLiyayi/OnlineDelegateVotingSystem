import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export  async function POST(request: Request) {
    const body = await request.json();
    const {email, otp} = body

    try {
        await connectToDB();

        const user = await User.findOne({email});

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (user.otp !== otp) return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

        if (user.otpExpires < new Date()) return NextResponse.json({ message: "OTP expired" }, { status: 400 });

        user.otp = null;
        user.otpExpires = null;
        user.otpVerified = true;
        await user.save();

        return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
    
}
