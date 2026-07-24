import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { readSchedule, writeSchedule, type WeeklyScheduleItem } from "@/lib/events";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ schedule: await readSchedule() });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not load schedule.") }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { schedule?: WeeklyScheduleItem[] };

    if (!Array.isArray(body.schedule)) {
      return NextResponse.json({ message: "Schedule must be provided." }, { status: 400 });
    }

    return NextResponse.json({ schedule: await writeSchedule(body.schedule) });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error, "Could not save schedule.") }, { status: 500 });
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
