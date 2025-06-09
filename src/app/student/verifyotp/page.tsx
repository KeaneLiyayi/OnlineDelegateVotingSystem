'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [otpSent, setOtpSent] = useState(false);
  const email = session?.user?.email;
  console.log(email)

  useEffect(() => {
    if(otpSent){
        return alert("OTP sent successfully")
    }
    
    if (!email) return;
    
    const sendOtp = async () => {
      const res = await fetch('/api/auth/sendotp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        alert('Failed to send OTP');
      }else{
        setOtpSent(true)
      }
    };
    sendOtp();
    
  }, [session, ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/student/voting');
    } else {
      alert('Invalid or expired OTP');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 space-y-4">
      <h1 className="text-xl font-bold">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
}