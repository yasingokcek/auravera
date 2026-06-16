import { cookies } from "next/headers";

/** Admin oturum cookie'sini doğrular. */
export function isAdminAuthed(): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return cookies().get("av_admin")?.value === expected;
}

/** API route'ları için (NextRequest cookie'sinden). */
export function isAdminRequest(req: { cookies: { get: (n: string) => { value: string } | undefined } }): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return req.cookies.get("av_admin")?.value === expected;
}
