"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db/db"
import { accountsTable } from "@/lib/db/schema"
import { decrypt } from "@/lib/utils"
import { Octokit } from "@octokit/rest"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { UserType } from "@/types"

export const getUserData = async () => {

  const session = await auth()
  const userId = session?.user.id

  const account = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId as string))

  if (!account) {
    return NextResponse.json(
      { message: 'Un-Authorized, account not found !' },
      { status: 400 }
    );
  }
  const decryptedToken = decrypt(account[0].private_access_token as string)

  // Create an instance of Octokit with the provided access token
  const octokit = new Octokit({
    auth: decryptedToken
  });
  const userData = await octokit.users.getAuthenticated();
  const user = userData.data
  if (user) {
    return user as UserType
  } else {
    return null
  }
}
