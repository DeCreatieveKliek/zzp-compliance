import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Wachtwoord', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          companyName: user.companyName,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    authorized: authConfig.callbacks!.authorized,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = (user as { type?: string }).type;
        token.companyName = (user as { companyName?: string | null }).companyName;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { type?: string }).type = token.type as string;
        (session.user as { companyName?: string | null }).companyName =
          token.companyName as string | null;
      }
      return session;
    },
  },
});
