import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
  const token = await getToken({ req: req as Request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

 
  if (!token.otpVerified) {
    return NextResponse.redirect(new URL('/student/verifyotp', req.url));
  }

  return NextResponse.next();
}
