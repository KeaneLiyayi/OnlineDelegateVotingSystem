"use client";

import { Card, CardContent } from "@/components/ui/card";
import {  Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Hourglass } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; 
 
interface Delegate {
  _id: string;
  fName: string;
  department: string;
  imageUrl: string;
  votes: number;
}

interface Election {
  _id: string;
  title: string;
  delegates: Delegate[];
  totalVotes: number;
}

export default function ResultsPage() {
  const params = useParams()
  const id =  params.id;
  const [result, setResult] = useState<Election | null>(null);
  const [loading,setLoading] = useState<boolean>(true)
  const { data: session } = useSession();
  
    useEffect(()=>{
        const fetchElection = async () => {
            const res = await fetch(`/api/elections/${id}`);
            const data = await res.json();
            if(data.results){
                setResult(data)
            }
            console.log(data)
            setLoading(false)
          };
          if (session?.user) {
            fetchElection();
          }
    },[session,id])


  

  const sortedDelegates = result
  ? [...result.delegates].sort((a, b) => b.votes - a.votes)
  : [];

  const winner = sortedDelegates[0];
// at the top

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Skeleton className="h-8 w-2/3 mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-lg rounded-2xl animate-pulse">
              <CardContent className="p-4 flex flex-col items-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
 if (!result) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Hourglass className="w-12 h-12 text-yellow-500 mb-4 animate-pulse" />
      <h2 className="text-xl font-semibold mb-2">Results Pending</h2>
      <p className="text-gray-500 max-w-md">
        The results for this election haven't been published yet. Please check back later.
      </p>
    </div>
  );
}
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{result?.title} - Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDelegates.map((delegate) => (
          <Card
            key={delegate._id}
            className={`shadow-lg rounded-2xl border-2 ${
              delegate._id === winner._id ? "border-yellow-500" : "border-gray-200"
            }`}
          >
            <CardContent className="p-4 text-center flex flex-col items-center">
              <Image
                src={delegate.imageUrl}
                alt={delegate.fName}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover mb-3 border"
              />
              <h2 className="text-xl font-semibold">{delegate.fName}</h2>
              <p className="text-gray-600 text-sm">{delegate.department}</p>
              <p className="text-lg font-medium mt-2">
                {delegate.votes} vote{delegate.votes !== 1 && "s"}
              </p>
              {delegate._id === winner._id && (
                <div className="mt-2 flex items-center gap-2 text-yellow-600 font-medium">
                  <Trophy className="w-4 h-4" />
                  Winner
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Total Votes Cast: <span className="font-semibold">{result?.totalVotes}</span>
      </p>
    </div>
  );
}
