import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string };

  if (body.password !== getAdminPassword()) {
    return NextResponse.json({ ok: false, message: "Invalid password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
