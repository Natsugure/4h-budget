"use server"

import { db } from "@/service/db/client"
import { and, eq, isNull } from "drizzle-orm"
import { categories } from "@/service/db/schema"
import type { NewCategory, Category } from "@/service/db/types"
import { ok, err, type Result } from "@/shared/results"
import { type AppError, databaseError, notFoundError } from "@/shared/errors"
import { getAuthUserId } from "@/features/auth/actions/getAuthUserId"

type NewCategoryInput = Omit<NewCategory, "userId">
type CategoryUpdateInput = Partial<Omit<NewCategory, "id" | "userId" | "createdAt" | "updatedAt" | "deletedAt">>

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function getCategories(): Promise<Result<Category[], AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const data = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          isNull(categories.deletedAt)
        )
      )
    return ok(data)
  } catch {
    return err(databaseError("Categoryの取得に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function createCategory(item: NewCategoryInput): Promise<Result<Category, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db.insert(categories).values({ ...item, userId }).returning()
    return ok(data)
  } catch {
    return err(databaseError("Categoryの作成に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function updateCategory(id: string, item: CategoryUpdateInput): Promise<Result<Category, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db
      .update(categories)
      .set({ ...item, updatedAt: new Date() })
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, userId)
        )
      )
      .returning()
    if (!data) {
      return err(notFoundError("Category"))
    }
    return ok(data)
  } catch {
    return err(databaseError("Categoryの更新に失敗しました"))
  }
}

// eslint-disable-next-line @clerk/next/require-auth-protection -- 認証は getAuthUserId() の Result<T, AuthError> で行っている
export async function deleteCategory(id: string): Promise<Result<void, AppError>> {
  const authResult = await getAuthUserId()
  if (!authResult.ok) {
    return err(authResult.error)
  }
  const userId = authResult.data
  
  try {
    const [data] = await db
      .update(categories)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning()
    if (!data) {
      return err(notFoundError("Category"))
    }
    return ok(undefined)
  } catch {
    return err(databaseError("Categoryの削除に失敗しました"))
  }
}