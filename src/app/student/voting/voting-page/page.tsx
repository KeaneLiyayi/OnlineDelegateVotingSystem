"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Delegate {
  _id: string;
  fName: string;
  department: string;
  imageUrl: string;
}

interface Election {
  _id: string;
  name: string;
  delegates: Delegate[];
}

export default function VotingPage() {
  const { data: session, update } = useSession();
  const user = session?.user as { faculty?: string; year?: string; id?: string };
  const [election, setElection] = useState<Election | null>(null);
  const router = useRouter();
  const [hasVoted, setHasVoted] = useState(false);
  console.log(session)
  

  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch(`/api/elections?faculty=${user.faculty}&year=${user.year}`);
      const data = await res.json();
      const now = new Date();
      const electionData = data[0];
      const start = new Date(electionData.start);
      const end = new Date(electionData.end);
  
      // Only allow if election is ongoing
      if (now < start || now > end) {
        setElection(null);
        router.push("/student/voting/voting-closed");
      } else {
        setElection(electionData);
      }
    };
    const checkVotingStatus = async () => {
      const res = await fetch(`/api/student?studentId=${user.id}`);
      const data = await res.json();
      console.log(data)
      setHasVoted(data)    }
    checkVotingStatus();
    
  
    if (session?.user) {
      fetchElection();
    }
  }, [session?.user, router]);

  
  
  console.log(election)

  const handleVote = async (delegateId: string) => {
    try {
      const res = await fetch(`/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId: election?._id,
          delegateId,
          studentId: user.id,
        }),
      });

      const result = await res.json();
      console.log(result)
      
        const updatedSession = await update({ user: { ...user, hasVoted: true } });
        console.log("Updated Session:", updatedSession?.user); // Log the updated session
      
      
      console.log(user)
      console.log("Vote submitted:", result);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Skeleton className="h-8 w-64 mb-6 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-xl rounded-2xl animate-pulse">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{election.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
        {election.delegates.map((delegate) => (
          <Card key={delegate._id} className="rounded-2xl shadow-lg transition-transform hover:scale-[1.01]">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <img
              src={delegate.imageUrl}
              alt={delegate.fName}
              className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4 object-cover"
            />
            <h2 className="text-lg font-medium">{delegate.fName}</h2>
            <p className="text-sm text-gray-500 mb-4">{delegate.department}</p>
            <Button
              onClick={() => handleVote(delegate._id)}
              disabled={hasVoted}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <BadgeCheck className="w-4 h-4" />
              {hasVoted ? "Already Voted" : "Vote"}
            </Button>
          </CardContent>
        </Card>
        
        ))}
      </div>
      <div className="text-center mt-8">
      <div className="text-center mt-10">
  <Button
    onClick={() => router.push(`/student/voting/results/${election._id}`)}
    className="bg-black hover:bg-black/80 px-6 py-2 rounded-xl"
  >
    View Results
  </Button>
</div>

  </div>
    </div>
  );
}
