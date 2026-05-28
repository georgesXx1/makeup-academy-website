import { notFound } from "next/navigation";
import { Award, BookOpen, CheckCircle2, Clock, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { getCourseBySlug, readCourses } from "@/lib/courses";
import { readContent } from "@/lib/content";
import { createWhatsappUrlFromContact } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const courses = await readCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const { contact } = await readContent();

  if (!course) {
    notFound();
  }

  const bookingHref = createWhatsappUrlFromContact(
    contact,
    `Hello EB Academy, I would like to ask about the ${course.title} course.`,
  );

  return (
    <main>
      <section className="soft-grid px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#b97866]">{course.category}</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] text-[#151313] md:text-7xl">{course.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f4d47]">{course.longDescription}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={bookingHref}>WhatsApp booking</ButtonLink>
              <ButtonLink href="/courses" variant="light">View all courses</ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-[#151313]/15">
            <img src={course.imageUrl} alt="" className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="luxury-card rounded-[2rem] p-6">
            <h2 className="font-display text-3xl font-semibold">Course details</h2>
            <div className="mt-6 grid gap-4">
              <DetailRow icon={<Clock size={18} />} label="Duration" value={course.duration} />
              <DetailRow icon={<MapPin size={18} />} label="Location" value={course.location} />
              <DetailRow icon={<Sparkles size={18} />} label="Price" value={course.price} />
              {course.participants && <DetailRow icon={<Users size={18} />} label="Participants" value={course.participants} />}
            </div>
            <a href={bookingHref} className="shine mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#151313] px-6 py-3 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5">
              <MessageCircle size={18} />
              WhatsApp booking
            </a>
          </aside>

          <div className="grid gap-6">
            {course.certificates?.length ? (
              <InfoPanel title="Certificate options" icon={<Award size={20} />} items={course.certificates} />
            ) : null}
            {course.targetAudience?.length ? (
              <InfoPanel title="Target audience" icon={<Users size={20} />} items={course.targetAudience} />
            ) : null}
            {course.curriculum?.length ? (
              <section className="luxury-card rounded-[2rem] p-6">
                <h2 className="flex items-center gap-2 font-display text-3xl font-semibold"><BookOpen size={20} /> Curriculum / agenda</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {course.curriculum.map((section) => (
                    <div key={section.title} className="rounded-[1.25rem] bg-[#fbf7f1] p-5">
                      <h3 className="font-semibold text-[#151313]">{section.title}</h3>
                      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#6c5851]">
                        {section.items.map((item) => <li key={item}>- {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            <InfoPanel title="What students will learn" icon={<CheckCircle2 size={20} />} items={course.whatStudentsWillLearn} />
            {course.importantNotes?.length ? <InfoPanel title="Important notes" icon={<Sparkles size={20} />} items={course.importantNotes} /> : null}
            {course.possibleMasterclasses?.length ? <InfoPanel title="Possible masterclass examples" icon={<Sparkles size={20} />} items={course.possibleMasterclasses} /> : null}
            {course.eventSupport?.length ? <InfoPanel title="Event details supported" icon={<BookOpen size={20} />} items={course.eventSupport} /> : null}
            <section className="rounded-[2rem] bg-[#151313] p-6 text-[#f6ead7]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">Final result</p>
              <p className="mt-4 text-lg leading-8 text-[#e9d8ce]">{course.finalResult}</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[#fbf7f1] p-5">
      <div className="flex items-center gap-2 text-[#b97866]">{icon}<span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span></div>
      <p className="mt-2 font-semibold leading-6 text-[#151313]">{value}</p>
    </div>
  );
}

function InfoPanel({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <section className="luxury-card rounded-[2rem] p-6">
      <h2 className="flex items-center gap-2 font-display text-3xl font-semibold">{icon}{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#6c5851] md:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="rounded-[1rem] bg-[#fbf7f1] px-4 py-3">{item}</li>
        ))}
      </ul>
    </section>
  );
}
