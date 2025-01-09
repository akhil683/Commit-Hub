import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      total_commits: number | null;
      subscription: string | null
    };
  }

  interface JWT {
    accessToken?: string
  }
}
