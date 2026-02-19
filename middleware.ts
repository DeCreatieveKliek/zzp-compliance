import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Use the lightweight config (no Node.js-only dependencies) for Edge Runtime
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
