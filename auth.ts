import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET } from "./config/env"
import { db } from "./lib/db/db"
import { accountsTable, sessions, usersTable, verificationTokens } from "./lib/db/schema"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
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
  secret: AUTH_SECRET,
  session: {
    strategy: "database"
  },
  callbacks: {
    // async jwt({ token, account }) {
    //   if (account) {
    //     token.accessToken = account.access_token
    //   }
    //   return token
    // },
    // async session({ session, token }) {
    //   session.accessToken = token.accessToken as string
    //   return session
    // },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/user-profile`
    }
  }
})
