
import { connectToDB } from "../../../../../lib/mongodb";


import { NextResponse } from "next/server";
import Election from "../../../../../models/Election";
import User from "../../../../../models/User";
import { sendResultsEmail } from "../../../../../lib/mailer";

export async function PUT(request, { params }) {
    
    const { id } = await params;
    await connectToDB()
    try {
        const body = await request.json();
        const { results } = body;

        const election = await Election .findByIdAndUpdate(id, {
            results,
        }, { new: true });

        const recipients = await User.find({faculty: election.faculty, year: election.year}).select("email").lean();

        if (!election) {
            return NextResponse.json({ error: "Election not found" }, { status: 404 });
        }
        const recipientsEmails = recipients.map(user => user.email);
        console.log(recipientsEmails)

        await sendResultsEmail(recipientsEmails, election.name);

        return NextResponse.json(election, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Error updating election" }, { status: 500 });
    }
}