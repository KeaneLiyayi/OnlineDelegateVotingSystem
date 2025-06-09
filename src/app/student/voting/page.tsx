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

  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch(`/api/elections?faculty=${user.faculty}&year=${user.year}`);
        const data = await res.json();

        if (data && data._id) {
          setElection(data);
        } else {
          console.error("No election returned or invalid format:", data);
        }
      } catch (error) {
        console.error("Error fetching election:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchElection();
    }
  }, [session?.user]);

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

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card className="animate-pulse">
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
      </div>
    );
  }

  if (!election) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">No Election Found</h2>
            <p className="text-gray-600">There is currently no election available for your faculty and year.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { status: electionStatus, text: statusText } = getElectionStatus(election.start, election.end);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Election</h1>
      <Card key={election._id}>
        <CardHeader>
          <CardTitle>{election.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {format(new Date(election.start), "MMM dd, yyyy HH:mm")} -{" "}
            {format(new Date(election.end), "MMM dd, yyyy HH:mm")}
          </p>
          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                electionStatus === "ongoing"
                  ? "bg-green-100 text-green-800"
                  : electionStatus === "upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {statusText}
            </span>
            <Button
              onClick={handleVote}
              disabled={electionStatus !== "ongoing"}
              className={`${electionStatus !== "ongoing" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {electionStatus === "ongoing" ? "Vote Now" : statusText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
