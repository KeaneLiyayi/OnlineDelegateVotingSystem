"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-10 p-4">
      <h1 className="text-3xl font-bold text-center">University Delegate Voting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Card */}
        <Link href="/student" className="group">
          <Card className="w-80 h-64 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
            <CardHeader className="flex flex-col items-center space-y-4 pt-6">
              <User className="h-16 w-16 text-blue-600 group-hover:text-blue-700" />
              <CardTitle className="text-2xl">Student Login</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-base text-muted-foreground pb-6">
              Proceed to vote as a student.
            </CardContent>
          </Card>
        </Link>

        {/* Admin Card */}
        <Link href="/admin" className="group">
          <Card className="w-80 h-64 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
            <CardHeader className="flex flex-col items-center space-y-4 pt-6">
              <Shield className="h-16 w-16 text-blue-600 group-hover:text-blue-700" />
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-base text-muted-foreground pb-6">
              Access admin dashboard and manage elections.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
