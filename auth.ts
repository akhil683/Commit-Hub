import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET } from "./config/env"
import { db } from "./lib/db/db"
import { accountsTable, sessions, usersTable, verificationTokens } from "./lib/db/schema"
import { eq } from "drizzle-orm"

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
          //Write permission for repo, for auto-commits
          scope: 'repo user'
        }
      }
    })
  ],
  secret: AUTH_SECRET,

  // Store session in database
  session: {
    strategy: "database"
  },

  callbacks: {
    //Add github access_token to session object 
    // so that we can access access_tokken using useSession()
    async session({ session, user }) {
      const account = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.userId, user.id))
        .limit(1)
      //if multiple account for one user,
      //then access the access_token of first account
      if (account.length > 0 && account[0].access_token) {
        session.accessToken = account[0].access_token
      }

      console.log("session with access_token", session)
      return session
    },

    //redirect to /user-profile after sign-in
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", url, "Base URL:", baseUrl);
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/user-profile`;
    },
  },
})
