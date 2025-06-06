export { middleware as default } from './middleware/requireOtp';

export const config = {
  matcher: ['/admi/dashboard/:path*', '/student/votin/:path*'],
};