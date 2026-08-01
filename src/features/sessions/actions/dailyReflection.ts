"use server"

import { db } from "@/service/db/client"
import { dailyReflections } from "@/service/db/schema"
import type { NewDailyReflection, DailyReflection } from "@/service/db/types"
import { desc, eq, and } from "drizzle-orm"
import { getAuthUserId } from "@/features/auth/actions/getAuthUserId"
import { ok, err, type Result } from "@/shared/results"
import { type AppError, databaseError, notFoundError } from "@/shared/errors"

export type CreateDailyReflectionInput = Omit<NewDailyReflection, "id" | "userId" | "createdAt" | "updatedAt">

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getDailyReflections(): Promise<Result<DailyReflection[], AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    return ok(await db.select().from(dailyReflections).where(eq(dailyReflections.userId, userId)).orderBy(desc(dailyReflections.date)))
  } catch {
    return err(databaseError("DailyReflectionの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getLatestDailyReflection(): Promise<Result<DailyReflection, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const result = await db
      .select()
      .from(dailyReflections)
      .where(eq(dailyReflections.userId, userId))
      .orderBy(desc(dailyReflections.date))
      .limit(1)
    if (!result[0]) {
      return err(notFoundError("DailyReflection"))
    }
    return ok(result[0])
  } catch {
    return err(databaseError("DailyReflectionの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function createDailyReflection(item: CreateDailyReflectionInput): Promise<Result<DailyReflection, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db.insert(dailyReflections).values({ ...item, userId }).returning()
    return ok(data)
  } catch {
    return err(databaseError("DailyReflectionの作成に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function updateDailyReflection(id: string, content: string): Promise<Result<DailyReflection, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db
      .update(dailyReflections)
      .set({ content, updatedAt: new Date() })
      .where(
        and(
          eq(dailyReflections.id, id),
          eq(dailyReflections.userId, userId)
        )
      )
      .returning()
    if (!data) {
      return err(notFoundError("DailyReflection"))
    }
    return ok(data)
  } catch {
    return err(databaseError("DailyReflectionの更新に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function deleteDailyReflection(id: string): Promise<Result<void, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db
      .delete(dailyReflections)
      .where(
        and(
          eq(dailyReflections.id, id),
          eq(dailyReflections.userId, userId)
        )
      )
      .returning()
    if (!data) {
      return err(notFoundError("DailyReflection"))
    }
    return ok(undefined)
  } catch {
    return err(databaseError("DailyReflectionの削除に失敗しました"))
  }
}