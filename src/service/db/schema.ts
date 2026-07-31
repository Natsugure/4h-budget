import { integer, pgTable, uuid, text, timestamp, check, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { SessionMethod, SessionSource } from "./types"

export const users = pgTable("users", {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  check("clerk_user_id_format", sql`${table.clerkUserId} ~ '^user_[A-Za-z0-9]{1,64}$'`)
])

export const categories = pgTable("categories", {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").$type<string>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  check("name_length", sql`char_length(${table.name}) <= 255`),
  check("description_length", sql`${table.description} IS NULL OR char_length(${table.description}) <= 10000`),
  check("color_format", sql`${table.color} ~ '^#[0-9A-Fa-f]{6}$'`)
])

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`uuidv7()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  memo: text("memo"),
  method: text("method").$type<SessionMethod>(),
  source: text("source").$type<SessionSource>(),
  taskLabel: text("task_label"),
  estimatedMinutes: integer("estimated_minutes"),
  satisfactionTask: integer("satisfaction_task"),
  satisfactionContribution: integer("satisfaction_contribution"),
  satisfactionTime: integer("satisfaction_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  check("memo_length", sql`${table.memo} IS NULL OR char_length(${table.memo}) <= 10000`),
  check("start_time_before_end_time", sql`${table.startTime} < ${table.endTime}`),
  check("end_time_after_start_time", sql`${table.endTime} > ${table.startTime}`),
  check(
    "estimated_minutes_range",
    sql`${table.estimatedMinutes} IS NULL OR (
      ${table.estimatedMinutes} > 0 AND ${table.estimatedMinutes} <= 1440
    )`
  ),
  check("satisfaction_task_range", sql`${table.satisfactionTask} IS NULL OR (
    ${table.satisfactionTask} >= 1 AND ${table.satisfactionTask} <= 7
  )`),
  check("satisfaction_contribution_range", sql`${table.satisfactionContribution} IS NULL OR (
    ${table.satisfactionContribution} >= 1 AND ${table.satisfactionContribution} <= 7
  )`),
  check("satisfaction_time_range", sql`${table.satisfactionTime} IS NULL OR (
    ${table.satisfactionTime} >= 1 AND ${table.satisfactionTime} <= 7
  )`),
])

export const dailyReflections = pgTable("daily_reflections", {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  check("content_length", sql`${table.content} IS NULL OR char_length(${table.content}) <= 20000`)
])