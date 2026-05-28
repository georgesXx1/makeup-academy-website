import { NextRequest, NextResponse } from "next/server";
import { deleteCertificate } from "@/lib/certificates";
import { isAdminRequest } from "@/lib/adminAuth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { code } = await params;
  const deleted = await deleteCertificate(decodeURIComponent(code));

  if (!deleted) {
    return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
