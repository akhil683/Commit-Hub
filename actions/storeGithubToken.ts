"use server"

import crypto from 'crypto';
import { db } from '@/lib/db/db';
import { accountsTable } from "@/lib/db/schema"
import { eq } from 'drizzle-orm';
import { ENCRYPTION_KEY } from '@/config/env';

const SECRET_KEY = ENCRYPTION_KEY;

//encypt token function
function encrypt(text: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'utf-8'), Buffer.alloc(16, 0));
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export const storeGithubToken = async (formData: FormData, userId: string) => {
  const githubToken = formData.get('githubToken')?.toString();

  if (!githubToken) {
    return { success: false, error: 'GitHub token is required' };
  }

  // Encrypt the GitHub token to security reasons
  const encryptedToken = encrypt(githubToken);

  // Save the encrypted token to the database
  try {
    await db
      .update(accountsTable)
      .set({ private_access_token: encryptedToken })
      .where(eq(accountsTable.userId, userId))

    return { success: true, message: 'GitHub token stored successfully' };
  } catch (error) {
    return { success: false, error: 'Failed to store token' };
  }
};
