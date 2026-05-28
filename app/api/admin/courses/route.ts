import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { readCourses, writeCourses, type CourseDetail } from "@/lib/courses";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ courses: await readCourses() });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { courses?: CourseDetail[] };

  if (!Array.isArray(body.courses)) {
    return NextResponse.json({ message: "Courses must be provided." }, { status: 400 });
  }

  return NextResponse.json({ courses: await writeCourses(body.courses) });
}
