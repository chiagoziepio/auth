import { DefaultSession } from "next-auth";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      /** Indicates if the sign-in was via OAuth */
      isOauth: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Indicates if the sign-in was via OAuth */
    isOauth: boolean;
  }
}
