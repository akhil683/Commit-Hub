
import NextAuth from "next-auth";

export interface SessionData {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  accessToken: string;
}
declare module "next-auth" {
  interface Session {
    accessToken: string
  }

  interface JWT {
    accessToken?: string
  }
}
