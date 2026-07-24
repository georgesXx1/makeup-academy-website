import { WeeklySchedule } from "@/components/WeeklySchedule";
import { readSchedule } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const weeklySchedule = await readSchedule();

  return (
    <main>
      <WeeklySchedule items={weeklySchedule} />
    </main>
  );
}
