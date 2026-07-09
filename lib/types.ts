/**
 * Generic discriminated union type for server action results.
 * Ensures TypeScript can narrow `data` correctly after checking `success`.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
