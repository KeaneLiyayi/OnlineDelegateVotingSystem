"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Delegate = {
  _id: string;
  fName: string;
  faculty: string;
  year: number;
  department: string;
};

export default function DelegatePage() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [filteredDelegates, setFilteredDelegates] = useState<Delegate[]>([]);
  const [faculty, setFaculty] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDelegates = async () => {
      try {
        const response = await fetch("/api/delegates");
        const data = await response.json();
        setDelegates(data);
      } catch (err) {
        console.error("Error fetching delegates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDelegates();
  }, []);

  useEffect(() => {
    let result = delegates;
    if (faculty) result = result.filter((d) => d.faculty === faculty);
    if (year) result = result.filter((d) => d.year === Number(year));
    setFilteredDelegates(result);
  }, [faculty, year, delegates]);
  

  const resetFilters = () => {
    setFaculty("");
    setYear("");
    setFilteredDelegates(delegates);
  };
  

  const handleEditDelegate = (delegate: Delegate) => {
    router.push(`/admin/dashboard/delegates/editDelegate/${delegate._id}`);
  };

  const handleDeleteDelegate = async (id: string) => {
    try {
      const res = await fetch(`/api/delegates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDelegates((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      console.error("Error deleting delegate:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Delegates</h1>
        <div className="flex gap-2">
          <Link href="/admin/dashboard/delegates/delegateRegistration">
            <Button>Add Delegate</Button>
          </Link>
          
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>

        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter by Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="computing">Computing & Tech</SelectItem>
            <SelectItem value="media">Media & Communication</SelectItem>
            <SelectItem value="business">Business & Economics</SelectItem>
            <SelectItem value="science">Science & Tech</SelectItem>
            <SelectItem value="socialscience">Social Science</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
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

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDelegates.map((delegate) => (
              <TableRow key={delegate._id}>
                <TableCell>{delegate.fName}</TableCell>
                <TableCell>{delegate.faculty}</TableCell>
                <TableCell>{delegate.year}</TableCell>
                <TableCell>{delegate.department}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditDelegate(delegate)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDelegate(delegate._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
