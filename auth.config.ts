import type { NextAuthConfig } from 'next-auth';

// Lightweight config for middleware (no Node.js-only dependencies)
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // providers are added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ['/dashboard', '/assessment'];
      const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register' || nextUrl.pathname === '/')) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      if (!isLoggedIn && nextUrl.pathname === '/') {
        return Response.redirect(new URL('/login', nextUrl.origin));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
