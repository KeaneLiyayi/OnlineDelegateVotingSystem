"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";




interface Election {
  _id: string;
  name: string;
  start: string;
  end: string;
  faculty?: string;
  year?: string;
}

export default function BeforeVotingPage() {
  const { data: session, status } = useSession();
  const user = session?.user as { faculty?: string; year?: string };
const router = useRouter();
const [elections, setElections] = useState<Election[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchElections = async () => {
    if (!session?.user) return;

    try {
      const res = await fetch(`/api/elections?faculty=${user.faculty}&year=${user.year}`);
      const data = await res.json();
      setElections(data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (session?.user) {
    fetchElections();
  }
}, [session?.user]);


// Wait for session to load
if (status === "loading") {
  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Loading Session...</h2>
          <p className="text-gray-600">Please wait while we verify your session...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// If session is loaded but no user
if (!user.faculty || !user.year) {
  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You must be logged in with a valid faculty and year to access elections.</p>
        </CardContent>
      </Card>
    </div>
  );
}


  
  const handleVote = () => {
    router.push(`/student/voting/voting-page`);
  };

  const getElectionStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return { status: "upcoming", text: "Upcoming" };
    if (now > endDate) return { status: "ended", text: "Ended" };
    return { status: "ongoing", text: "Voting Now" };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Elections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => {
          const { status, text } = getElectionStatus(election.start, election.end);
          
          return (
            <Card key={election._id}>
              <CardHeader>
                <CardTitle>{election.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {format(new Date(election.start), "MMM dd, yyyy HH:mm")} - 
                  {format(new Date(election.end), "MMM dd, yyyy HH:mm")}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    status === "ongoing" ? "bg-green-100 text-green-800" :
                    status === "upcoming" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {text}
                  </span>
                  <Button
                    onClick={() => handleVote()}
                    disabled={status !== "ongoing"}
                    className={`${status !== "ongoing" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {status === "ongoing" ? "Vote Now" :
                     status === "upcoming" ? "Upcoming" :
                     "Ended"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
