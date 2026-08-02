"use server"

import { db } from "@/service/db/client"
import { sessions } from "@/service/db/schema"
import type { Session, NewSession } from "@/service/db/types"
import { ok, err, type Result } from "@/shared/results"
import { type AppError, databaseError, notFoundError } from "@/shared/errors"
import { desc, eq, and, isNull } from "drizzle-orm"
import { getAuthUserId } from "@/features/auth/actions/getAuthUserId"

export type StartSessionInput = Pick<NewSession, "categoryId" | "startTime" | "estimatedMinutes" | "taskLabel" | "source">
export type SessionUpdateInput = Partial<Omit<NewSession, "id" | "userId" | "createdAt" | "updatedAt">>
export type SessionSatisfactionInput = Pick<NewSession, "satisfactionTask" | "satisfactionContribution" | "satisfactionTime">

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getAllSessions(): Promise<Result<Session[], AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const data = await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.startTime))
    return ok(data)
  } catch {
    return err(databaseError("Sessionの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getSessionsByDate(date: Date): Promise<Result<Session[], AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const data = await db.select().from(sessions).where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.startTime, date)
      )
    ).orderBy(desc(sessions.startTime))
    return ok(data)
  } catch {
    return err(databaseError("Sessionの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getLatestSession(): Promise<Result<Session, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startTime))
      .limit(1)

    if (!data) {
      return err(notFoundError("Session"))
    }
    return ok(data)
  } catch {
    return err(databaseError("Sessionの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function startSession(item: StartSessionInput): Promise<Result<void, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    await db.insert(sessions).values({ ...item, userId })
    return ok(undefined)
  } catch {
    return err(databaseError("Sessionの作成に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function endSession(id: string, endTime: Date): Promise<Result<Session, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [result] = await db
      .update(sessions)
      .set({ endTime, updatedAt: new Date() })
      .where(
        and(
          eq(sessions.id, id),
          eq(sessions.userId, userId),
          isNull(sessions.endTime)
        )
      )
      .returning()

    if (!result) {
      return err(notFoundError("Session"))
    }

    return ok(result)
    
  } catch {
    return err(databaseError("Sessionの終了に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function setSessionSatisfaction(id: string, satisfaction: SessionSatisfactionInput) {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [result] = await db
      .update(sessions)
      .set({ ...satisfaction, updatedAt: new Date() })
      .where(
        and(
          eq(sessions.id, id),
          eq(sessions.userId, userId)
        )
      )
      .returning()

    if (!result) {
      return err(notFoundError("Session"))
    }

    return ok(result)
  } catch {
    return err(databaseError("Sessionの評価設定に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function updateSession(id: string, item: SessionUpdateInput) {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [result] = await db
      .update(sessions)
      .set({ ...item, updatedAt: new Date() })
      .where(
        and(
          eq(sessions.id, id),
          eq(sessions.userId, userId)
        )
      )
      .returning()

    if (!result) {
      return err(notFoundError("Session"))
    }

    return ok(result)
  } catch {
    return err(databaseError("Sessionの更新に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function deleteSession(id: string): Promise<Result<void, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [result] = await db
      .delete(sessions)
      .where(
        and(
          eq(sessions.id, id),
          eq(sessions.userId, userId)
        )
      )
      .returning()

    if (!result) {
      return err(notFoundError("Session"))
    }

    return ok(undefined)
  } catch {
    return err(databaseError("Sessionの削除に失敗しました"))
  }
}
