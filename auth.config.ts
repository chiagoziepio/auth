import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchemaZod } from "@/Type/Schema/schema";
import { db } from "@/lib/db/db";
import bcrypt from "bcrypt-edge";

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          return null;
        }
        const validateData = loginSchemaZod.safeParse({ email, password });
        if (!validateData.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: validateData.data.email,
          },
        });
        if (!user || !user.password) {
          return null;
        }
        const isPasswordValid = bcrypt.compareSync(
          validateData.data.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
