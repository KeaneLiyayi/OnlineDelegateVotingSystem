import { NextResponse } from "next/server";
import Delegate from "../../../models/Delegate";
import { connectToDB } from "../../../lib/mongodb";

export async function POST(request) {
    await connectToDB()
    try {
        const body = await request.json();
        console.log(body)

        const { fName, regNo, faculty, imageUrl, year } = body;

        const newDelegate = new Delegate({ fName, regNo, faculty, imageUrl, year });
        ;
        await newDelegate.save();
        return NextResponse.json({ message: "Delegate created successfully" }, { status: 201 });

    } catch (e) {
        console.error('Error registering delegate:', e);
        return NextResponse.json({ error: 'Failed to register delegate' }, { status: 500 });

    }
}
export async function GET(request) {
    await connectToDB()
    
    const {searchParams} = new URL(request.url)
    const faculty = searchParams.get("faculty")
    const year = searchParams.get("year")



    try {
        const query = {}
        if(faculty){
            query.faculty = faculty
        }
        if(year){
            const parsedYear = parseInt(year);
            if (!isNaN(parsedYear)) {
                query.year = parsedYear;
            }
        }
        const delegates = await Delegate.find(query);
        return NextResponse.json(delegates, { status: 200 });
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "Error fetching candidates" }, { status: 500 });
    }
}
