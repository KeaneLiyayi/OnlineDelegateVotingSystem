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
import Image from "next/image"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    let hasError = false

    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }))
      toast.error("Email is required")
      hasError = true
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }))
      toast.error("Password is required")
      hasError = true
    }
    if (hasError) return

    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/admin/verifyOtp",
      identifier: email,
      password,
    })
    setLoading(false)

    if (res?.ok) {
      toast.success("Logged in! Redirecting...")
      window.location.href = res.url || "/admin/verifyOtp"
    } else {
      toast.error("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-2xl px-4">
        <CardHeader>
          <Image
            src="/logo.png"
            alt="UniVote Logo"
            width={150}
            height={150}
            className="mb-2 mx-auto"
            priority
          />
          <CardTitle className="text-xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
