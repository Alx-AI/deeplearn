import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db/neon';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = (credentials?.username as string)?.toLowerCase().trim();
        const password = credentials?.password as string;
        if (!username || !password) return null;

        const rows = await sql`SELECT id, username, password_hash FROM users WHERE username = ${username}`;
        const user = rows[0];
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password_hash as string);
        if (!valid) return null;

        return { id: user.id as string, name: user.username as string };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      if (!isLoggedIn) {
        return Response.redirect(new URL('/signin', request.nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name ?? '';
      }
      return session;
    },
  },
});
