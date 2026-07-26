import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { users, categories, sessions, dailyReflections } from "../schema"

export type SessionMethod = "manual" | "auto"
export type SessionSource = "web" | "mobile" | "desktop" | "crx" | "other"

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Category = InferSelectModel<typeof categories>
export type NewCategory = InferInsertModel<typeof categories>

export type Session = InferSelectModel<typeof sessions>
export type NewSession = InferInsertModel<typeof sessions>

export type DailyReflection = InferSelectModel<typeof dailyReflections>
export type NewDailyReflection = InferInsertModel<typeof dailyReflections>