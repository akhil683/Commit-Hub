import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'repo user public_repo'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      //Add access token to the token object during sign-in
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      //Add session token to the session object
      session.accessToken = token?.accessToken as string || "akhil";
      console.log(session)
      return session;
    },
  },
});

export const { GET, POST } = handlers
