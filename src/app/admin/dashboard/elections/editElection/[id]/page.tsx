"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Delegate = {
    _id: string;
    fName: string;
    regNo: string;
    faculty: string;
    year: number;
    department: string;
};




export default function EditElectionForm() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    faculty: "",
    year: "",
    status: "",
    start: "",
    end: "",
    delegates: [] as string[],
  });

  const [delegateList, setDelegateList] = useState<Delegate[]>([]);

  // Fetch election data
  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch(`/api/elections/${id}`);
      const data = await res.json();
      setForm({
        name: data.name || "",
        faculty: data.faculty || "",
        year: data.year?.toString() || "",
        status: data.status || "",
        start: data.start ? new Date(data.start).toISOString().slice(0, 16) : "",
  end: data.end ? new Date(data.end).toISOString().slice(0, 16) : "",
  
        delegates: data.delegates || [],
      });
    };
    fetchElection();
    
  }, [id]);

  // Fetch updated delegate list
  useEffect(() => {
    if (form.faculty && form.year) {
      const fetchDelegates = async () => {
        const res = await fetch(`/api/delegates?faculty=${form.faculty}&year=${form.year}`);
        const data = await res.json();
        setDelegateList(data);
        setForm((prev) => ({
          ...prev,
          delegates: data.map((delegate: Delegate) => delegate._id),
        }));
      };
      fetchDelegates();
    }
  }, [form.faculty, form.year]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/elections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: Number(form.year),
      }),
    });
    
    if(res.ok){
        toast.success("Election updated successfully");
        router.push("/admin/dashboard/elections");
    }
    
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Election</h1>

      <Card>
        <CardHeader>
          <CardTitle>Election Details</CardTitle>
        </CardHeader>   
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Election Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Student Council 2025"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Start Date & Time</label>
              <Input
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">End Date & Time</label>
              <Input
                type="datetime-local"
                name="end"
                value={form.end}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Target Faculty</label>
              <Select value={form.faculty} onValueChange={(val) => handleSelectChange("faculty", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Faculty" />
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
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Target Year</label>
              <Select value={form.year} onValueChange={(val) => handleSelectChange("year", val)}>
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
              {delegateList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No qualified delegates found.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
                  {delegateList.map((delegate: Delegate) => (
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

            <div className="pt-4 col-span-2">
              <Button type="submit" className="w-full">
                Update Election
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
