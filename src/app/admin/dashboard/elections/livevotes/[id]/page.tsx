"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";


const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
type Delegate = {
    _id: string;
    fName: string;
    regNo: string;
    faculty: string;
    year: number;
    department: string;
    imageUrl: string;
    votes: number;
};

export default function LiveResultsPage() {
    const params = useParams()
    const {id} = params
    const [delegates,setDelegates] = useState<Delegate[]>([])
    const [loading,setLoading] = useState(true)
    const [endDate,setEndDate] = useState<string | null>(null)
    const [isElectionOver,setIsElectionOver] = useState(false);

useEffect(() => {
  if (!endDate) return;

  const interval = setInterval(() => {
    const now = new Date();
    const end = new Date(endDate);
    setIsElectionOver(now > end);
  }, 1000); // check every second

  return () => clearInterval(interval);
}, [endDate]);

    useEffect(()=>{
        const fetchDelegates = async () => {
            const res = await fetch(`/api/elections/${id}`);
            const dataResult = await res.json();
            setDelegates(dataResult.delegates as Delegate[])
            console.log(dataResult)
            setEndDate(dataResult.end);
            setLoading(false)
            
        }
        fetchDelegates()
    },[id])
    
    const handlePublish = async () => {
        try {
            const res = await fetch(`/api/elections/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ results: true }),
            });
            const data = await res.json();
            console.log("Published Election:", data);
        } catch (err) {
            console.error("Error publishing election:", err);
        }
    }

    if(loading){
        return(
            <div>Loading...</div>
        )
    }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">
        Faculty of Engineering Elections
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Live results updating every few seconds...
      </p>
      <div className="flex justify-end mb-4">
  <Button
    onClick={handlePublish}
    disabled={!isElectionOver}
    className="w-fit"
  >
    {isElectionOver ? "Publish Results" : "Election Ongoing"}
  </Button>
</div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Vote Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={delegates as Delegate[] }
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="votes"
                  nameKey="fName"
                  label={({ fName, percent }) =>
                    `${fName}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {delegates.map((entry: Delegate, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {delegates.map((delegate: Delegate, idx: number) => (
          <Card key={idx} className="rounded-2xl shadow">
            <CardContent className="flex items-center space-x-4 p-4">
              <Image
                src={delegate.imageUrl || "/placeholder.png"}
                alt={delegate.fName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{delegate.fName}</p>
                <p className="text-sm text-gray-500">Votes: {delegate.votes}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
