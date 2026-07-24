import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading } from "@/components/SectionHeading";
import { readEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const academyEvents = await readEvents();
  const [featuredEvent, ...otherEvents] = academyEvents;

  return (
    <main>
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 border-b border-[#b97866]/14 pb-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#b97866]">
                <Sparkles size={17} />
                Academy events
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] text-[#151313] md:text-6xl">Upcoming events</h1>
              <p className="mt-4 max-w-2xl leading-8 text-[#5f4d47]">
                Masterclasses, open days, product sessions, and academy announcements. Course timetables stay on the weekly schedule page.
              </p>
            </div>
            <ButtonLink href="/schedule">Open weekly schedule</ButtonLink>
          </div>

          {featuredEvent && (
            <Link href={`/events/${featuredEvent.slug}`} className="group mt-10 grid overflow-hidden rounded-[1.75rem] bg-[#151313] text-[#f6ead7] shadow-2xl shadow-[#151313]/12 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="p-7 md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">Featured event</p>
                <h2 className="mt-5 font-display text-4xl font-semibold md:text-5xl">{featuredEvent.title}</h2>
                <p className="mt-4 max-w-2xl leading-8 text-[#e9d8ce]">{featuredEvent.shortDescription}</p>
                <div className="mt-8 grid gap-3 text-sm text-[#f6ead7] sm:grid-cols-3">
                  <span className="flex items-center gap-2"><CalendarDays size={16} className="text-[#d9aa9a]" /> {featuredEvent.dateLabel}</span>
                  <span className="flex items-center gap-2"><Clock size={16} className="text-[#d9aa9a]" /> {featuredEvent.timeLabel}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-[#d9aa9a]" /> {featuredEvent.location}</span>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f6ead7] px-5 py-3 text-sm font-semibold text-[#151313] transition group-hover:-translate-y-0.5">
                  View event
                  <ArrowRight size={16} />
                </span>
              </div>
              <img src={featuredEvent.imageUrl} alt="" className="h-full min-h-72 w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
            </Link>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8">
        <SectionHeading eyebrow="Event list" title="More event pages" description="Edit these event cards from the admin dashboard when real events are ready." />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {otherEvents.map((event) => (
            <article key={event.slug} className="luxury-card group overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#b97866]/15">
              <div className="relative aspect-[4/3] bg-[#151313]">
                <img src={event.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b97866]">{event.category}</span>
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-semibold">{event.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#6c5851]">{event.shortDescription}</p>
                <div className="mt-6 grid gap-3 text-sm text-[#51433f]">
                  <span className="flex items-center gap-2"><CalendarDays size={16} className="text-[#b97866]" /> {event.dateLabel}</span>
                  <span className="flex items-center gap-2"><Clock size={16} className="text-[#b97866]" /> {event.timeLabel}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-[#b97866]" /> {event.location}</span>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#b97866]/12 pt-5">
                  <span className="font-display text-2xl font-semibold text-[#151313]">{event.price}</span>
                  <Link href={`/events/${event.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f7d9dc] px-4 py-3 text-sm font-semibold text-[#151313] transition group-hover:bg-[#151313] group-hover:text-[#f6ead7]">
                    View Event
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {otherEvents.length === 0 && <p className="rounded-[1.25rem] border border-[#b97866]/14 bg-white/70 p-6 text-sm text-[#6c5851]">No additional events yet.</p>}
        </div>
      </section>

      <section className="bg-[#151313] px-5 py-16 text-[#f6ead7] lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">Schedule</p>
            <h2 className="mt-4 font-display text-4xl font-semibold">Weekly classes live on their own page.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#e9d8ce]">Use the schedule page to move between weeks and open the course or event attached to each session.</p>
          </div>
          <ButtonLink href="/schedule" variant="light">Open weekly schedule</ButtonLink>
        </div>
      </section>
    </main>
  );
}
