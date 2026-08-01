import { users } from "@/service/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { db } from "@/service/db/client"
import  { authError, type AuthError } from "@/shared/errors"
import { ok, err, type Result } from "@/shared/results"

export async function getAuthUserId(): Promise<Result<string, AuthError>> {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    return err(authError("Clerkセッションが存在しません"))
  }
  
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1)
  
  if (!user) {
    return err(authError("DBにusersレコードが見つかりません"))
  }
  
  return ok(user.id)
}