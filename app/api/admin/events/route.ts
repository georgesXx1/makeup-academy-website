import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { readEvents, writeEvents, type AcademyEvent } from "@/lib/events";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ events: await readEvents() });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not load events.") }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { events?: AcademyEvent[] };

    if (!Array.isArray(body.events)) {
      return NextResponse.json({ message: "Events must be provided." }, { status: 400 });
    }

    return NextResponse.json({ events: await writeEvents(body.events) });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not save events.") }, { status: 500 });
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
