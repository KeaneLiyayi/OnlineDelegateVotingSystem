import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!token.otpVerified) {
    return NextResponse.redirect(new URL('/student/verifyotp', req.url));
  }

  return NextResponse.next();
}
