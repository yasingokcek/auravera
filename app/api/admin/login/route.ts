import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  const origin = req.nextUrl.origin;

  if (!expected) {
    return NextResponse.redirect(`${origin}/admin?err=config`, { status: 303 });
  }
  if (password !== expected) {
    return NextResponse.redirect(`${origin}/admin?err=1`, { status: 303 });
  }

  const res = NextResponse.redirect(`${origin}/admin`, { status: 303 });
  res.cookies.set("av_admin", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 saat
  });
  return res;
}
