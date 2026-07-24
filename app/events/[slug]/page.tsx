import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Sparkles, Ticket } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { getEventBySlug, readEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const academyEvents = await readEvents();
  return academyEvents.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main>
      <section className="soft-grid px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#b97866]">{event.category}</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] text-[#151313] md:text-7xl">{event.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f4d47]">{event.longDescription}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/events#schedule">View schedule</ButtonLink>
              <ButtonLink href="/events" variant="light">All events</ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-[#151313]/15">
            <img src={event.imageUrl} alt="" className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <EventDetail icon={<CalendarDays size={18} />} label="Date" value={event.dateLabel} />
          <EventDetail icon={<Clock size={18} />} label="Time" value={event.timeLabel} />
          <EventDetail icon={<MapPin size={18} />} label="Location" value={event.location} />
          <EventDetail icon={<Ticket size={18} />} label="Price" value={event.price} />
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#151313] p-8 text-[#f6ead7] md:p-12">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">
            <Sparkles size={17} />
            Placeholder details
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold">Ready for real event content later.</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[#e9d8ce]">
            This page is intentionally filled with sample copy so the event system, schedule links, and visitor flow can be tested before the academy adds final dates, prices, photos, and booking details.
          </p>
        </div>
      </section>
    </main>
  );
}

function EventDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="luxury-card rounded-[1.5rem] p-6">
      <div className="flex items-center gap-2 text-[#b97866]">
        {icon}
        <span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 font-semibold leading-6 text-[#151313]">{value}</p>
    </div>
  );
}
