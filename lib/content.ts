import { promises as fs } from "fs";
import path from "path";

export type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  imageUrl: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

export type ContactInfo = {
  headline: string;
  description: string;
  emails: string[];
  phones: string[];
  whatsapp: string;
  location: string;
  instagram: string;
};

export type SiteContent = {
  courses: Course[];
  team: TeamMember[];
  contact: ContactInfo;
};

const courseLevels = ["Beginners", "Intermediate", "Advanced"];

const dataDirectory = path.join(process.cwd(), "data");
const contentFile = path.join(dataDirectory, "content.json");

export const defaultContent: SiteContent = {
  courses: [
    {
      id: "signature-bridal-artistry",
      title: "Signature Bridal Artistry",
      description: "A premium bridal-focused course covering skin prep, timeless glam, client consultations, and long-wear finishing.",
      duration: "6 weeks",
      level: "Intermediate",
      price: "$890",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "professional-makeup-foundations",
      title: "Professional Makeup Foundations",
      description: "A polished starter program for aspiring artists who want confident technique, hygiene, color theory, and kit building.",
      duration: "4 weeks",
      level: "Beginners",
      price: "$620",
      imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "editorial-soft-glam-masterclass",
      title: "Editorial & Soft Glam Masterclass",
      description: "Modern camera-ready beauty looks, refined complexion work, creative eyes, and portfolio-ready styling.",
      duration: "3 weeks",
      level: "Advanced",
      price: "$740",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "luxury-client-experience",
      title: "Luxury Client Experience",
      description: "Service design, pricing, booking workflows, client care, and the finishing details that make an artist feel premium.",
      duration: "2 weeks",
      level: "Beginners",
      price: "$390",
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    },
  ],
  team: [
    {
      id: "eliano-bou-assi",
      name: "Eliano Bou Assi",
      role: "Academy Director",
      bio: "Founder and lead educator guiding students through refined technique, professional standards, and confident client care.",
      imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "beauty-educator",
      name: "Senior Beauty Educator",
      role: "Makeup Instructor",
      bio: "Supports students through practical application, face charts, kit guidance, and polished final assessments.",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    },
  ],
  contact: {
    headline: "Ready to build your artistry?",
    description: "Contact the academy for course details, registration, and certificate questions.",
    emails: [],
    phones: [],
    whatsapp: "",
    location: "",
    instagram: "",
  },
};

async function ensureContentFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(contentFile);
  } catch {
    await writeContent(defaultContent);
  }
}

function normalizeCourse(course: Partial<Course>, index: number): Course {
  const title = course.title?.trim() || `Course ${index + 1}`;
  const level = normalizeCourseLevel(course.level);

  return {
    id: course.id?.trim() || slugify(title),
    title,
    description: course.description?.trim() || "",
    duration: course.duration?.trim() || "",
    level,
    price: course.price?.trim() || "",
    imageUrl: course.imageUrl?.trim() || "",
  };
}

function normalizeCourseLevel(level?: string) {
  const cleanLevel = level?.trim();
  if (!cleanLevel) return courseLevels[0];
  if (cleanLevel.toLowerCase() === "beginner") return "Beginners";
  if (courseLevels.includes(cleanLevel)) return cleanLevel;
  return courseLevels[0];
}

function normalizeTeamMember(member: Partial<TeamMember>, index: number): TeamMember {
  const name = member.name?.trim() || `Team Member ${index + 1}`;

  return {
    id: member.id?.trim() || slugify(name),
    name,
    role: member.role?.trim() || "",
    bio: member.bio?.trim() || "",
    imageUrl: member.imageUrl?.trim() || "",
  };
}

function normalizeStringList(value: unknown, fallback?: string) {
  const values = Array.isArray(value) ? value : fallback ? [fallback] : [];

  return values
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeContact(contact?: Partial<ContactInfo> & { email?: string; phone?: string }): ContactInfo {
  return {
    headline: contact?.headline?.trim() || defaultContent.contact.headline,
    description: contact?.description?.trim() || defaultContent.contact.description,
    emails: normalizeStringList(contact?.emails, contact?.email),
    phones: normalizeStringList(contact?.phones, contact?.phone),
    whatsapp: contact?.whatsapp?.trim() || "",
    location: contact?.location?.trim() || "",
    instagram: contact?.instagram?.trim() || "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function readContent(): Promise<SiteContent> {
  await ensureContentFile();
  const file = await fs.readFile(contentFile, "utf8");
  const parsed = JSON.parse(file) as Partial<SiteContent>;

  return {
    courses: (parsed.courses?.length ? parsed.courses : defaultContent.courses).map(normalizeCourse),
    team: (parsed.team?.length ? parsed.team : defaultContent.team).map(normalizeTeamMember),
    contact: normalizeContact(parsed.contact),
  };
}

export async function writeContent(content: SiteContent) {
  await fs.mkdir(dataDirectory, { recursive: true });
  const normalizedContent = {
    courses: content.courses.map(normalizeCourse),
    team: content.team.map(normalizeTeamMember),
    contact: normalizeContact(content.contact),
  };

  await fs.writeFile(contentFile, JSON.stringify(normalizedContent, null, 2), "utf8");
  return normalizedContent;
}
