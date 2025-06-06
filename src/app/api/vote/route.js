import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Vote from "../../../models/Vote";
import User from "../../../models/User";
import Delegate from "../../../models/Delegate";
export async function POST(request) {
    await connectToDB();
    const body = await request.json();
    
    try{
        const {electionId, delegateId, studentId} = body;

        
        const updatedUser = await User.findByIdAndUpdate(studentId, {hasVoted: true}, {new: true});

        const newVote = new Vote({election: electionId, delegate: delegateId, user: studentId});
        await newVote.save();
        const newDelegate = await Delegate.findByIdAndUpdate(delegateId, { $inc: { votes: 1 } }, {new: true});
        console.log(newDelegate)

        return NextResponse.json({ message: "Vote cast successfully", updatedUser, newDelegate }, { status: 201 });
    }catch(e){
        console.error('Error casting vote:', e);
        return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
    }
}

