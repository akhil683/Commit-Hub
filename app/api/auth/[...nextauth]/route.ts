import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET as string || "",
      authorization: {
        params: {
          scope: 'repo user'
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
      session.accessToken = token?.accessToken as string;
      console.log(session)
      return session;
    },
  },
});

export const { GET, POST } = handlers
