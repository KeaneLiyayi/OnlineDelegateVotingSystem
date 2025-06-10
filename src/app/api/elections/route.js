import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Election from "../../../models/Election";
import Delegate from "../../../models/Delegate";

export async function POST(request) {
  await connectToDB();

  try {
    const body = await request.json();
    const { name, start, end, faculty, year, delegates } = body;

    // Automatically calculate status
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    let status = "upcoming";
    if (now >= startDate && now <= endDate) status = "ongoing";
    else if (now > endDate) status = "ended";

    const newElection = await Election.create({
      name,
      status,
      start: startDate,
      end: endDate,
      faculty,
      year,
      delegates,
    });

    return NextResponse.json(newElection, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed to create election" }, { status: 500 });
  }
}

export async function GET(request) {
  await connectToDB();
  const { searchParams } = new URL(request.url);
  const faculty = searchParams.get("faculty");
  const year = searchParams.get("year");

  try {
    const query = {};
    if (faculty) query.faculty = faculty;
    if (year) query.year = year;

    const elections = await Election.find(query).populate("delegates");
    return NextResponse.json(elections, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Error fetching elections" }, { status: 500 });
  }
}
