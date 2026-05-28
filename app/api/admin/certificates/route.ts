import { NextRequest, NextResponse } from "next/server";
import { addCertificate, addCertificates, readCertificates } from "@/lib/certificates";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ certificates: await readCertificates() });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    studentName?: string;
    studentNames?: string[];
    courseName?: string;
    issueDate?: string;
    code?: string;
  };

  const names = body.studentNames?.length
    ? body.studentNames.map((name) => name.trim()).filter(Boolean)
    : body.studentName
      ? [body.studentName.trim()]
      : [];

  if (names.length === 0 || !body.courseName || !body.issueDate) {
    return NextResponse.json({ message: "Participant name, course name, and issue date are required." }, { status: 400 });
  }

  try {
    if (names.length === 1) {
      const certificate = await addCertificate({
        studentName: names[0],
        courseName: body.courseName.trim(),
        issueDate: body.issueDate,
        code: body.code ?? "",
      });

      return NextResponse.json({ certificate, certificates: [certificate] }, { status: 201 });
    }

    const certificates = await addCertificates(
      names.map((studentName) => ({
        studentName,
        courseName: body.courseName!.trim(),
        issueDate: body.issueDate!,
      })),
    );

    return NextResponse.json({ certificates }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not add certificate." }, { status: 409 });
  }
}
