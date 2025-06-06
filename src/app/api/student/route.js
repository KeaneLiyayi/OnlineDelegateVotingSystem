import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";

import User from "../../../models/User";

export async function GET(request) {
    await connectToDB();
  
    try {
      const { searchParams } = new URL(request.url);
      const studentId = searchParams.get("studentId");
  
      if (!studentId) {
        return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
      }
  
      const user = await User.findById(studentId);
  
      return NextResponse.json(user.hasVoted, { status: 200 });
    } catch (e) {
      console.error("Error fetching user:", e);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  }
  