"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

export default function Login() {
  const [regNo, setRegNo] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!regNo.trim()) {
      toast.error("Registration number is required")
      return
    }
    if (!password) {
      toast.error("Password is required")
      return
    }

    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/student/verifyotp",
      identifier: regNo,
      password,
    })

    if (res?.ok) {
      toast.success("Logged in! Redirecting...")
      window.location.href = res.url || "/student/verifyotp"
    } else {
      toast.error("Invalid registration number or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border border-indigo-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="regNo">Registration No</Label>
              <Input
                id="regNo"
                placeholder="Enter your registration number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-indigo-600" />
                <span>Remember me</span>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
