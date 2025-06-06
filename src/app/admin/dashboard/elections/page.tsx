"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getElectionStatus } from "@/lib/utils";
import ElectionEditButton from "@/components/EditButtonWithTooltip";

export default function Elections() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [elections, setElections] = useState<any[]>([]);
  const [filteredElections, setFilteredElections] = useState<any[]>([]);
  const [endDate,setEndDate] = useState<string | null>(null)
  
  // Fetch all elections on the first load
  useEffect(() => {
    const fetchElections = async () => {
      const response = await fetch("/api/elections");
      const data = await response.json();
      setElections(data);
      setFilteredElections(data); // Initially, all elections will be shown
    };

    fetchElections();
  }, []);

  // Apply client-side filtering when faculty or year is selected
  useEffect(() => {
    let result = elections;
  
    if (faculty) {
      result = result.filter(election => election.faculty === faculty);
    }
  
    if (year) {
      // convert year string to number for comparison
      const yearNumber = Number(year);
      result = result.filter(election => election.year === yearNumber);
    }
  
    setFilteredElections(result);
  }, [faculty, year, elections]);
  

  const handleEdit = (electionId: string) => {
    router.push(`/admin/dashboard/elections/${electionId}`);
  };
  const resetFilters = () => {
    setFaculty("");
    setYear("");
    setFilteredElections(elections);
  };
  
  const handlePublish = async (electionId: string)=>{
    try {
      const res = await fetch(`/api/elections/${electionId}`,
         { method: "PUT",
          headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ results: true }), });
      const data = await res.json();
      console.log("Published Election:", data);
    } catch (err) {
      console.error("Error publishing election:", err);
    }
  }

  const handleDelete = async (electionId: string)=>{
    try {
      const res = await fetch(`/api/elections/${electionId}`, { method: "DELETE" });
      const data = await res.json();
      console.log("Deleted Election:", data);
    } catch (err) {
      console.error("Error deleting election:", err);
    }
  }
  return (
    <div className="md:p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Elections</h1>
        <Button  onClick={()=>router.push("/admin/dashboard/elections/createElection")}  >Create New Election</Button>
      </div>

      <div className="flex flex-wrap md:gap-4 gap-2">
      <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Select value={faculty} onValueChange={(value) => setFaculty(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="computing">Computing and Technology</SelectItem>
            <SelectItem value="media">Media and Communication</SelectItem>
            <SelectItem value="business">Business and Economics</SelectItem>
            <SelectItem value="science">Science and Technology</SelectItem>
            <SelectItem value="socialscience">Social Science and Technology</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(value) => setYear(value)}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Filter by Year" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">1st Year</SelectItem>
    <SelectItem value="2">2nd Year</SelectItem>
    <SelectItem value="3">3rd Year</SelectItem>
    <SelectItem value="4">4th Year</SelectItem>
    <SelectItem value="5">5th Year</SelectItem>
  </SelectContent>
</Select>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Elections</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Start</th>
                <th className="py-2 px-3">End</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredElections.map((election) => (
                <tr key={election._id} className="border-t">
                  <td className="py-3 px-3">{election.name}</td>
                  <td className="py-3 px-3">
                  <Badge variant="default">{getElectionStatus(election.start, election.end)}</Badge>

                  </td>
                  <td className="py-3 px-3">{new Date(election.start).toLocaleString()}</td>
                  <td className="py-3 px-3">{new Date(election.end).toLocaleString()}</td>
                  <td className="py-3 px-3 flex flex-wrap gap-2">
                    <ElectionEditButton election={election} />
                    <Button onClick={() => handleDelete(election._id)} size="sm" variant="outline">Delete </Button>
                    <Button size="sm" onClick={()=>router.push(`elections/livevotes/${election._id}`)} variant="secondary">View Votes</Button>
                    <Button
  className="w-full"
  onClick={() => handlePublish(election._id)}
  disabled={new Date() < new Date(election.end) || election.results === true}
  size="sm"
>
  {election.results === true ? "Published" : "Publish Results"}
</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
