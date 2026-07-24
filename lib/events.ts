import { readJsonFile, writeJsonFile } from "@/lib/jsonStorage";

export type AcademyEvent = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  price: string;
  imageUrl: string;
};

export type ScheduleTarget = {
  type: "course" | "event";
  slug: string;
  title: string;
};

export type WeeklyScheduleItem = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  target: ScheduleTarget;
};

const eventsFile = "events.json";
const scheduleFile = "schedule.json";

export const defaultAcademyEvents: AcademyEvent[] = [
  {
    title: "Glow Night Masterclass",
    slug: "glow-night-masterclass",
    category: "Masterclass",
    shortDescription: "A placeholder evening event focused on luminous skin, soft glam, and camera-ready finishing.",
    longDescription: "This sample event can be replaced later with the real masterclass details. For now, it gives visitors a polished place to discover upcoming academy events, see timing, and understand what kind of session is happening.",
    dateLabel: "Friday evening",
    timeLabel: "6:00 PM - 8:30 PM",
    location: "EB Academy Studio",
    price: "$45 placeholder",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Bridal Beauty Open Day",
    slug: "bridal-beauty-open-day",
    category: "Open Day",
    shortDescription: "A casual preview day with sample bridal looks, product demos, and course guidance.",
    longDescription: "This placeholder open day is designed for visitors who want to experience the academy before booking a course. The content is temporary and can be swapped with a real event announcement from the admin workflow later.",
    dateLabel: "Saturday",
    timeLabel: "11:00 AM - 2:00 PM",
    location: "EB Academy Reception",
    price: "Free placeholder",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Product Discovery Session",
    slug: "product-discovery-session",
    category: "Event",
    shortDescription: "A hands-on product session for foundation matching, skin preparation, and finishing choices.",
    longDescription: "This sample product session gives the schedule something event-based to point to. It can later become a real brand activation, academy demo, or private beauty education session.",
    dateLabel: "Wednesday",
    timeLabel: "4:00 PM - 5:30 PM",
    location: "EB Academy Lab",
    price: "$20 placeholder",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85",
  },
];

export const defaultWeeklySchedule: WeeklyScheduleItem[] = [
  {
    id: "previous-skin-lab",
    date: "2026-07-14",
    startTime: "10:00",
    endTime: "13:00",
    room: "Training Room A",
    note: "Skin analysis and cleansing practice",
    target: { type: "course", slug: "skin-care-training", title: "Skin Care Training Program" },
  },
  {
    id: "previous-product-discovery",
    date: "2026-07-16",
    startTime: "16:00",
    endTime: "17:30",
    room: "Product Lab",
    note: "Foundation matching and prep demo",
    target: { type: "event", slug: "product-discovery-session", title: "Product Discovery Session" },
  },
  {
    id: "current-professional-makeup",
    date: "2026-07-21",
    startTime: "11:00",
    endTime: "14:00",
    room: "Main Studio",
    note: "Theory, skin prep, and product setup",
    target: { type: "course", slug: "professional-makeup", title: "Professional Makeup Course" },
  },
  {
    id: "current-self-makeup",
    date: "2026-07-22",
    startTime: "15:00",
    endTime: "18:00",
    room: "Beauty Bar",
    note: "Daily makeup practice",
    target: { type: "course", slug: "self-makeup", title: "Self Makeup / Auto Self Makeup Training" },
  },
  {
    id: "current-product-discovery",
    date: "2026-07-23",
    startTime: "16:00",
    endTime: "17:30",
    room: "Product Lab",
    note: "Product testing and shade selection",
    target: { type: "event", slug: "product-discovery-session", title: "Product Discovery Session" },
  },
  {
    id: "current-glow-night",
    date: "2026-07-25",
    startTime: "18:00",
    endTime: "20:30",
    room: "Masterclass Studio",
    note: "Soft glam and glow finishing",
    target: { type: "event", slug: "glow-night-masterclass", title: "Glow Night Masterclass" },
  },
  {
    id: "next-lamination",
    date: "2026-07-27",
    startTime: "12:00",
    endTime: "14:00",
    room: "Technique Room",
    note: "Lamination tools, safety, and finishing",
    target: { type: "course", slug: "lamination", title: "Lamination Course" },
  },
  {
    id: "next-bridal-open-day",
    date: "2026-08-02",
    startTime: "11:00",
    endTime: "14:00",
    room: "Reception Studio",
    note: "Open day with sample bridal looks",
    target: { type: "event", slug: "bridal-beauty-open-day", title: "Bridal Beauty Open Day" },
  },
  {
    id: "next-mesotherapy",
    date: "2026-07-31",
    startTime: "10:30",
    endTime: "12:30",
    room: "Aesthetic Lab",
    note: "Device usage and protocol overview",
    target: { type: "course", slug: "mesotherapy", title: "Mesotherapy Course" },
  },
];

function normalizeEvent(event: Partial<AcademyEvent>, index: number): AcademyEvent {
  const title = event.title?.trim() || `Event ${index + 1}`;

  return {
    title,
    slug: event.slug?.trim() || slugify(title),
    category: event.category?.trim() || "Event",
    shortDescription: event.shortDescription?.trim() || "",
    longDescription: event.longDescription?.trim() || "",
    dateLabel: event.dateLabel?.trim() || "",
    timeLabel: event.timeLabel?.trim() || "",
    location: event.location?.trim() || "",
    price: event.price?.trim() || "",
    imageUrl: event.imageUrl?.trim() || "",
  };
}

function normalizeScheduleItem(item: Partial<WeeklyScheduleItem>, index: number): WeeklyScheduleItem {
  const fallbackTarget = { type: "event" as const, slug: "", title: "Choose item" };
  const target = item.target?.type && item.target.slug
    ? {
        type: item.target.type === "course" ? "course" as const : "event" as const,
        slug: item.target.slug.trim(),
        title: item.target.title?.trim() || item.target.slug.trim(),
      }
    : fallbackTarget;

  return {
    id: item.id?.trim() || `schedule-${index + 1}`,
    date: getScheduleDate(item, index),
    startTime: item.startTime?.trim() || "10:00",
    endTime: item.endTime?.trim() || "11:00",
    room: item.room?.trim() || "",
    note: item.note?.trim() || "",
    target,
  };
}

function getScheduleDate(item: Partial<WeeklyScheduleItem> & { weekOffset?: number; dayIndex?: number }, index: number) {
  if (typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date.trim())) {
    return item.date.trim();
  }

  const weekOffset = Number.isFinite(item.weekOffset) ? Number(item.weekOffset) : 0;
  const dayIndex = Math.min(6, Math.max(0, Number.isFinite(item.dayIndex) ? Number(item.dayIndex) : index % 7));
  const weekStart = getSeedWeekStart();
  weekStart.setDate(weekStart.getDate() + weekOffset * 7 + dayIndex);
  return toDateInputValue(weekStart);
}

function getSeedWeekStart() {
  const date = new Date(2026, 6, 23);
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function readEvents() {
  const parsed = await readJsonFile<Partial<AcademyEvent>[]>(eventsFile, defaultAcademyEvents);
  return parsed.map(normalizeEvent);
}

export async function writeEvents(nextEvents: AcademyEvent[]) {
  const normalizedEvents = nextEvents.map(normalizeEvent);
  await writeJsonFile(eventsFile, normalizedEvents);
  return normalizedEvents;
}

export async function readSchedule() {
  const parsed = await readJsonFile<Partial<WeeklyScheduleItem>[]>(scheduleFile, defaultWeeklySchedule);
  return parsed.map(normalizeScheduleItem);
}

export async function writeSchedule(nextSchedule: WeeklyScheduleItem[]) {
  const normalizedSchedule = nextSchedule.map(normalizeScheduleItem);
  await writeJsonFile(scheduleFile, normalizedSchedule);
  return normalizedSchedule;
}

export async function getEventBySlug(slug: string) {
  const events = await readEvents();
  return events.find((event) => event.slug === slug) ?? null;
}

export function getScheduleHref(target: ScheduleTarget) {
  return target.type === "course" ? `/courses/${target.slug}` : `/events/${target.slug}`;
}
