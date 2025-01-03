import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET } from "./config/env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: AUTH_GITHUB_ID,
      clientSecret: AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'repo user'
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET || "",
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/user-profile`
    }
  }
})
