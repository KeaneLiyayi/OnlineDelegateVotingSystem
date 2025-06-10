"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const { data: session } = useSession()
  const email = session?.user?.email
  const router = useRouter()

  useEffect(() => {
    if (!email) return

    const sendOtp = async () => {
      const res = await fetch("/api/auth/sendotp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        toast.success("OTP sent to your email")
        setOtpSent(true)
      } else {
        toast.error("Failed to send OTP")
      }
    }

    if (!otpSent) sendOtp()
  }, [email, otpSent])

  function maskEmail(email: string): string {
    const [name, domain] = email.split("@")
    const maskedName = name[0] + "*".repeat(Math.max(1, name.length - 2)) + name.slice(-1)
    return `${maskedName}@${domain}`
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/auth/verifyotp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    })

    setLoading(false)

    if (res.ok) {
      toast.success("OTP verified!")
      router.push("/student/voting")
    } else {
      toast.error("Invalid or expired OTP")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-xl bg-white px-6 py-10 shadow-lg dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Verify OTP</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter the OTP sent to <span className="font-medium">{email ? maskEmail(email) : "your email"}</span>

          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="otp" className="text-zinc-950 dark:text-white">
              OTP
            </Label>
            <Input
              id="otp"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Didn&apos;t receive the OTP? Refresh the page to resend.
        </p>
      </div>
    </div>
  )
}
