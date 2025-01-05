"use server"

import { z } from 'zod'
import { db } from '@/lib/db/db'
import { waitlist } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  email: z.string().email("Please enter a valid email address")
})

export async function joinWaitlist(formData: FormData) {

  const validateField = schema.safeParse({
    email: formData.get('email')
  })
  if (!validateField.success) {
    return {
      error: validateField.error.issues[0].message
    }
  }

  try {
    const email = validateField.data.email

    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email))

    if (existingEmail.length > 0) {
      return {
        error: 'This email is already on the waitlist'
      }
    }

    //Insert new email
    await db.insert(waitlist).values({ email })

    return {
      success: true,
      message: "Successfully joined the waitlist"
    }

  } catch (error) {
    return {
      error: "Something went wrong. Please try again."
    }
  }
}
