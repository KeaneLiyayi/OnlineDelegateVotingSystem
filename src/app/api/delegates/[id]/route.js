import { NextResponse } from "next/server";
import Delegate from "@/models/Delegate";


// GET /api/candidates/:id
export async function GET(_, { params }) {

    const { id } = await params;

    try {
        const candidate = await Delegate.findById(id);

        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        return NextResponse.json(candidate, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching candidate" }, { status: 500 });
    }
}

// DELETE /api/candidates/:id


export async function PUT(request, { params }) {

    const { id } = await params;
    const data = await request.json();

    try {
        const updatedCandidate = await Delegate.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCandidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCandidate, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error updating candidate" }, { status: 500 });
    }
}

// DELETE /api/candidates/:id — Delete candidate
export async function DELETE(_, { params }) {

    const { id } = await  params;

    try {
        const deletedCandidate = await Delegate.findByIdAndDelete(id);

        if (!deletedCandidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Candidate deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting candidate" }, { status: 500 });
    }
}
