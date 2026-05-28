import { NextRequest, NextResponse } from "next/server";
import { findCertificate } from "@/lib/certificates";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ verified: false, message: "Certificate code is required." }, { status: 400 });
  }

  const certificate = await findCertificate(code);

  if (!certificate) {
    return NextResponse.json({ verified: false, message: "Certificate could not be verified." }, { status: 404 });
  }

  return NextResponse.json({ verified: true, certificate });
}
