import Link from "next/link";
import { ArrowLeft, Award, Camera, MessageCircle, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
import { createWhatsappUrlFromContact } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { team } = await readContent();
  return team.map((member) => ({ id: member.id }));
}

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { team, contact } = await readContent();
  const member = team.find((teamMember) => teamMember.id === id);

  if (!member) {
    notFound();
  }

  const bioParagraphs = member.bio
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const whatsappHref = createWhatsappUrlFromContact(
    contact,
    `Hello EB Academy, I would like to ask about ${member.name}.`,
  );

  return (
    <main>
      <section className="soft-grid px-4 py-6 sm:px-5 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/#team" className="inline-flex items-center gap-2 rounded-full border border-[#b97866]/20 bg-white/75 px-4 py-2 text-sm font-semibold text-[#151313] transition hover:-translate-y-0.5 hover:bg-white">
            <ArrowLeft size={16} />
            Back to team
          </Link>

          <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className="overflow-hidden rounded-[1.75rem] bg-[#151313] shadow-2xl shadow-[#151313]/15 lg:rounded-[2rem]">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt="" className="aspect-[4/5] h-full w-full object-cover sm:aspect-[3/4] lg:aspect-auto" />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-[#f6ead7]">
                  <Camera size={42} />
                </div>
              )}
            </div>

            <div className="rounded-[1.75rem] bg-[#151313] p-6 text-[#f6ead7] shadow-2xl shadow-[#151313]/15 sm:p-8 lg:rounded-[2rem] lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">{member.role}</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">{member.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#e9d8ce] sm:text-lg">
                A closer look at the educator behind the EB Academy student experience.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <ProfileStat icon={<Award size={18} />} label="Academy role" value={member.role} />
                <ProfileStat icon={<Sparkles size={18} />} label="Focus" value="Beauty education" />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={whatsappHref} className="shine inline-flex items-center justify-center gap-2 rounded-full bg-[#f6ead7] px-6 py-3 text-sm font-semibold text-[#151313] transition hover:-translate-y-0.5">
                  <MessageCircle size={18} />
                  Ask on WhatsApp
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-[#f6ead7]/20 px-6 py-3 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5 hover:bg-white/10">
                  View courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="order-2 rounded-[1.5rem] border border-[#b97866]/15 bg-[#fbf7f1] p-5 lg:order-1 lg:self-start lg:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b97866]">Profile</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[#151313]">EB Academy team member</h2>
            <p className="mt-4 text-sm leading-7 text-[#6c5851]">
              Students can learn more about each educator, their background, and the standard they bring into the academy.
            </p>
          </aside>

          <article className="order-1 rounded-[1.5rem] bg-white/75 p-6 shadow-2xl shadow-[#b97866]/10 sm:p-8 lg:order-2 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b97866]">Full bio</p>
            <div className="mt-5 space-y-5 text-base leading-8 text-[#4f423e] sm:text-lg sm:leading-9">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-center gap-2 text-[#d9aa9a]">
        {icon}
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#f6ead7]">{value}</p>
    </div>
  );
}
