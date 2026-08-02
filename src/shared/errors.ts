export type AppError = AuthError | ValidationError | DatabaseError | NotFoundError

export type AuthError = { kind: "AuthError"; message: string }
export type ValidationError = { kind: "ValidationError"; fieldErrors: Record<string, string[]>; }
export type DatabaseError = { kind: "DatabaseError"; message: string }
export type NotFoundError = { kind: "NotFoundError"; resource: string }

export function authError(message: string): AuthError {
  return { kind: "AuthError", message }
}

export function validationError(fieldErrors: Record<string, string[]>): ValidationError {
  return { kind: "ValidationError", fieldErrors }
}

export function databaseError(message: string): DatabaseError {
  return { kind: "DatabaseError", message }
}

export function notFoundError(resource: string): NotFoundError {
  return { kind: "NotFoundError", resource }
}