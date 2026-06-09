import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { readContent, writeContent, type SiteContent } from "@/lib/content";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ content: await readContent() });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not load site content.") }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContent>;

    if (!Array.isArray(body.courses) || !Array.isArray(body.team) || !body.contact) {
      return NextResponse.json({ message: "Courses, team, and contact info must be provided." }, { status: 400 });
    }

    const content = await writeContent({
      courses: body.courses,
      team: body.team,
      contact: body.contact,
    });

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not save site content.") }, { status: 500 });
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
