import { NextResponse } from "next/server";
import Election from "../../../../models/Election";
import { connectToDB } from "../../../../lib/mongodb";
import Delegate from "../../../../models/Delegate";


export async function GET(_, { params }) {
    const { id } = await params;
    
    try {
        const election = await Election.findById(id).populate("delegates");

        if (!election) {
            return NextResponse.json({ error: "Election not found" }, { status: 404 });
        }

        return NextResponse.json(election, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function DELETE(_, { params }) {
    const { id } = await params;
    await connectToDB()
    try {
        const election = await Election.findByIdAndDelete(id);

        if (!election) {
            return NextResponse.json({ error}, { status: 404 });
        }

        return NextResponse.json({ message: "Election deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    await connectToDB()
    try {
        const body = await request.json();
        const { name, start, end, faculty, year, delegates } = body;

        const election = await Election.findByIdAndUpdate(id, {
            name,
            start,
            end,
            faculty,
            year,
            delegates,
        });

        if (!election) {
            return NextResponse.json({ error: "Election not found" }, { status: 404 });
        }

        return NextResponse.json(election, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Error updating election" }, { status: 500 });
    }
}