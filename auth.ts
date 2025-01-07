import NextAuth, { NextAuthConfig, type Session } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET } from "./config/env"
import { db } from "./lib/db/db"
import { accountsTable, sessions, usersTable, verificationTokens } from "./lib/db/schema"
import { eq } from "drizzle-orm"

export const authOptions =
  {
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
        // session: we access using useSession()
        // user: user object from userTable in db

        //Access the account of current user 
        const userDB = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, user.id))
          .limit(1)

        //if multiple account for one user,
        //then access the access_token of first account
        if (userDB.length > 0 && userDB[0].id) {
          session.user.id = userDB[0].id
          session.user.image = userDB[0].image
          session.user.total_commits = userDB[0].total_commits
        }

        return session
      },

      //redirect to /user-profile after sign-in
      async redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) {
          return url;
        }
        return `${baseUrl}/user-profile`;
      },
    },
  } satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
