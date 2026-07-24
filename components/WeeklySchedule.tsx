"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import type { ScheduleTarget, WeeklyScheduleItem } from "@/lib/events";

type WeeklyScheduleProps = {
  items: WeeklyScheduleItem[];
  compact?: boolean;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklySchedule({ items, compact = false }: WeeklyScheduleProps) {
  const [weekStart, setWeekStart] = useState(() => getCurrentWeekStart());
  const weekDates = useMemo(() => days.map((_, dayIndex) => addDays(weekStart, dayIndex)), [weekStart]);
  const visibleItems = items.filter((item) => isDateInWeek(item.date, weekStart));
  const weekRange = `${formatDate(weekStart)} - ${formatDate(addDays(weekStart, 6))}`;

  return (
    <section className={compact ? "" : "px-5 py-16 lg:px-8"}>
      <div className={compact ? "" : "mx-auto max-w-7xl"}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-[#b97866]">
              <CalendarDays size={17} />
              Weekly schedule
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-[#151313] md:text-5xl">This week at EB Academy</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#6c5851]">Browse classes and events by week. Click any session to open its course or event page.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWeekStart((current) => addDays(current, -7))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b97866]/20 bg-white text-[#151313] transition hover:-translate-y-0.5 hover:border-[#b97866]/50"
              aria-label="Previous week"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-48 rounded-full border border-[#b97866]/18 bg-[#fbf7f1] px-5 py-3 text-center text-sm font-semibold text-[#151313]">
              {weekRange}
            </div>
            <button
              type="button"
              onClick={() => setWeekStart((current) => addDays(current, 7))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b97866]/20 bg-white text-[#151313] transition hover:-translate-y-0.5 hover:border-[#b97866]/50"
              aria-label="Next week"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-7">
          {days.map((day, dayIndex) => {
            const date = weekDates[dayIndex];
            const dateKey = toDateInputValue(date);
            const dayItems = visibleItems
              .filter((item) => item.date === dateKey)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day} className="min-h-40 rounded-[1.25rem] border border-[#b97866]/14 bg-white/70 p-4 shadow-lg shadow-[#b97866]/6">
                <div className="flex items-baseline justify-between gap-3 border-b border-[#b97866]/12 pb-3">
                  <p className="font-display text-2xl font-semibold text-[#151313]">{day}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8f695e]">{formatDayNumber(date)}</p>
                </div>

                <div className="mt-4 grid gap-3">
                  {dayItems.map((item) => (
                    <Link
                      key={item.id}
                      href={getScheduleHref(item.target)}
                      className="group block rounded-[1rem] border border-[#b97866]/16 bg-[#fbf7f1] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#b97866]/45 hover:bg-white hover:shadow-xl hover:shadow-[#b97866]/10"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#b97866]">
                        <Clock size={14} />
                        {toDisplayTime(item.startTime)} - {toDisplayTime(item.endTime)}
                      </span>
                      <span className="mt-2 block font-semibold leading-5 text-[#151313]">{item.target.title}</span>
                      <span className="mt-2 block text-sm leading-5 text-[#6c5851]">{item.note}</span>
                      <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#51433f]">
                        <MapPin size={14} className="text-[#b97866]" />
                        {item.room}
                      </span>
                    </Link>
                  ))}
                  {dayItems.length === 0 && (
                    <div className="rounded-[1rem] border border-dashed border-[#b97866]/22 px-4 py-5 text-sm leading-6 text-[#8f695e]">
                      No placeholder sessions for {dayNames[dayIndex].toLowerCase()}.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getCurrentWeekStart() {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date;
}

function addDays(date: Date, daysToAdd: number) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + daysToAdd);
  return nextDate;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function formatDayNumber(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
}

function isDateInWeek(value: string, weekStart: Date) {
  const date = parseDateInputValue(value);
  if (!date) return false;

  const weekEnd = addDays(weekStart, 6);
  return date >= weekStart && date <= weekEnd;
}

function parseDateInputValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDisplayTime(value: string) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hourValue, minuteValue, 0, 0);
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
}

function getScheduleHref(target: ScheduleTarget) {
  return target.type === "course" ? `/courses/${target.slug}` : `/events/${target.slug}`;
}
