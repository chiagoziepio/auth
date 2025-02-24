import { db } from "@/lib/db/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60,
  },
  ...authConfig,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        const existingUser = await db.user.findUnique({
          where: {
            id: user?.id,
          },
        });
        if (!existingUser || !existingUser.emailVerified) {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Determine if the sign-in was via OAuth
        token.isOauth = account.provider !== "credentials";
      }

      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.isOauth = token.isOauth ?? false;
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? "";
      }
      return session;
    },
  },
});
