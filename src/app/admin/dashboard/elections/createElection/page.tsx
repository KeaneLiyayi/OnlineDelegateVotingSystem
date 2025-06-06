"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function createElection() {
    const router = useRouter();
    type Delegate = {
        _id: string;
        fName: string;
        regNo: string;
        faculty: string;
        year: number;
        department: string;
    };
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [faculty, setFaculty] = useState('');
    const [year, setYear] = useState<number | null>(null);
    const [electionName, setElectionName] = useState('');
    const [status, setStatus] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    
    

    useEffect(() => {
      const fetchDelegates = async () => {
        const res = await fetch(`/api/delegates?faculty=${faculty}&year=${year}`);
        const data = await res.json();
        setDelegates(data);
      };
    
      if (faculty && year !== null) {
        fetchDelegates();
      }
    }, [faculty, year]);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch("/api/elections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: electionName,
                status: status,
                start: start,
                end: end,
                faculty: faculty,
                year: year,
                delegates: delegates.map((delegate) => delegate._id),
            }),
        });
        const data = await res.json();
        if(res.ok){
            toast.success("Election created successfully");
            router.push("/admin/dashboard/elections");
        }
    }
        


    
    return (
        <div className="md:p-6 max-w-2xl mx-auto space-y-6">
  <h1 className="text-2xl font-bold">Create New Election</h1>

  <Card>
    <CardHeader>
      <CardTitle>Election Details</CardTitle>
    </CardHeader>
    <form onSubmit={handleSubmit}>
    <CardContent className="space-y-4 md:grid md:grid-cols-2 md:gap-4">

      
      <div className="space-y-1">
        <label className="text-sm font-medium">Election Name</label>
        <Input placeholder="e.g. Student Council 2025" onChange={(e) => setElectionName(e.target.value)} />
      </div>

    
      <div className="space-y-1">
        <label className="text-sm font-medium">Start Date & Time</label>
        <Input type="datetime-local" onChange={(e) => setStart(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">End Date & Time</label>
        <Input type="datetime-local" onChange={(e) => setEnd(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Target Faculty</label>
        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="computing">Computing and Technology </SelectItem>
            <SelectItem value="media">Media and Communication</SelectItem>
            <SelectItem value="business">Business and Economics</SelectItem>
            <SelectItem value="science">Science and Technology</SelectItem>
            <SelectItem value="socialscience">Social Science and Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Target Year</label>
        <Select value={year?.toString() || ''} onValueChange={(value) => setYear(Number(value))}>

          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year" />
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
            
      <div className="space-y-2 col-span-2">
  <h2 className="text-lg font-semibold">Qualified Delegates</h2>

  {delegates.length === 0 ? (
    <p className="text-sm text-muted-foreground">No qualified delegates found for this faculty and year.</p>
  ) : (
    <div className="max-h-64 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
      {delegates.map((delegate) => (
        <Card key={delegate._id}>
          <CardContent className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium">{delegate.fName}</p>
              <p className="text-sm text-muted-foreground">{delegate.regNo}</p>
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {delegate.department}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</div>



      {/* Submit Button */}
      <div className="pt-4 col-span-2">
        <Button type="submit" className="w-full">Create Election</Button>
      </div>

    </CardContent>
    </form>
  </Card>
</div>


    )
}