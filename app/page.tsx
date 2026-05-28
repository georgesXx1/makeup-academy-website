import Link from "next/link";
import { Award, Brush, HeartHandshake, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CourseCard } from "@/components/CourseCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { readContent } from "@/lib/content";
import { readCourses } from "@/lib/courses";
import { createWhatsappUrl, createWhatsappUrlFromContact } from "@/lib/whatsapp";

const reasons = [
  { icon: Brush, title: "Modern Technique", text: "Skin-first artistry, polished detail, and looks that photograph beautifully." },
  { icon: Award, title: "Verified Certificates", text: "Every certificate can be checked publicly with a unique code or QR link." },
  { icon: HeartHandshake, title: "Luxury Client Care", text: "Students learn how to create a premium experience from booking to final touch." },
];

const heroImages = [
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const { team, contact } = await readContent();
  const courses = await readCourses();
  const firstEmail = contact.emails[0];
  const contactHref = contact.phones.length || contact.whatsapp ? createWhatsappUrlFromContact(contact) : firstEmail ? `mailto:${firstEmail}` : "#contact";

  return (
    <main>
      <section className="soft-grid px-5 py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[620px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#b97866]">Premium beauty education</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-[#151313] md:text-7xl">
              EB Academy
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f4d47]">
              Eliano Bou Assi Academy offers elegant, confidence-building makeup courses for artists who want refined technique, a premium client experience, and verified certification.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/courses">Explore courses</ButtonLink>
              <ButtonLink href="/verify" variant="light">Verify certificate</ButtonLink>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="grid items-end gap-6 sm:grid-cols-2">
              {heroImages.map((image, index) => (
                <div key={image} className={`aspect-[0.78] overflow-hidden rounded-[2rem] shadow-2xl ${index === 0 ? "shadow-[#151313]/20" : "shadow-[#b97866]/18 sm:mb-8"}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8" id="courses">
        <SectionHeading eyebrow="Courses" title="Polished programs for every artist stage" description="Explore editable academy programs with photos, descriptions, prices, levels, and duration." />
        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
          {courses.slice(0, 2).map((course) => <CourseCard key={course.title} course={course} />)}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/courses" variant="light">View all courses</ButtonLink>
        </div>
      </section>

      <section className="bg-[#151313] px-5 py-20 text-[#f6ead7] lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d9aa9a]">Why choose us</p>
            <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">A refined academy experience, from first lesson to final certificate.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-5 lg:justify-end">
            {reasons.map((reason) => (
              <div key={reason.title} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 md:w-[calc(50%-0.625rem)] xl:w-[calc(33.333%-0.875rem)]">
                <reason.icon className="text-[#d9aa9a]" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#e9d8ce]">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8" id="team">
        <SectionHeading eyebrow="Meet the team" title="Learn with artists who care about the details" description="The admin dashboard controls each team member's photo, role, and biography." />
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-center gap-6">
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] bg-[#f7d9dc] p-8 shadow-2xl shadow-[#b97866]/12 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <div className="flex items-center gap-3 text-[#8e584c]"><ShieldCheck /> Official certificate verification</div>
            <h2 className="mt-4 font-display text-4xl font-semibold">Let clients verify credentials instantly.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#6c5851]">Each printed certificate can include a QR code that opens the public verification page with the certificate code pre-filled.</p>
          </div>
          <ButtonLink href="/verify">Open verification</ButtonLink>
        </div>
      </section>

      <section id="contact" className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#b97866]/15 bg-white/70 p-8 text-center shadow-2xl shadow-[#b97866]/10 md:p-12">
          <h2 className="font-display text-4xl font-semibold">{contact.headline}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6c5851]">{contact.description}</p>
          <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-4">
            {contact.phones.map((phone, index) => (
              <ContactChip key={phone} icon={<Phone size={17} />} label={index === 0 ? "Phone" : `Phone ${index + 1}`} value={phone} href={createWhatsappUrl(phone)} />
            ))}
            {contact.emails.map((email, index) => (
              <ContactChip key={email} icon={<Mail size={17} />} label={index === 0 ? "Email" : `Email ${index + 1}`} value={email} href={`mailto:${email}`} />
            ))}
            {contact.location && (
              <ContactChip icon={<MapPin size={17} />} label="Location" value={contact.location} />
            )}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={contactHref} className="rounded-full bg-[#151313] px-7 py-3 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5">Contact academy</Link>
            {contact.instagram && <Link href={contact.instagram} className="rounded-full border border-[#151313]/10 bg-white px-7 py-3 text-sm font-semibold text-[#151313] transition hover:-translate-y-0.5">Instagram</Link>}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactChip({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#151313] text-[#f6ead7]">{icon}</span>
      <span className="min-w-0 text-left">
        <span className="block text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#b97866]">{label}</span>
        <span className="mt-1 block break-words text-sm font-semibold text-[#2a2422]">{value}</span>
      </span>
    </>
  );

  const className = "flex min-h-24 w-full items-center gap-3 rounded-[1.25rem] border border-[#b97866]/14 bg-[#fbf7f1] px-4 py-3 shadow-lg shadow-[#b97866]/6 transition hover:-translate-y-0.5 hover:bg-white sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]";

  if (href) {
    return <Link href={href} className={className}>{content}</Link>;
  }

  return <div className={className}>{content}</div>;
}
