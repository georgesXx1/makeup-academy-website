import { SectionHeading } from "@/components/SectionHeading";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { readContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { team } = await readContent();

  return (
    <main className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="About" title="A calm, elegant space for serious beauty education" description="Meet the editable academy team and the people behind the student experience." />
      <section className="mx-auto mt-14 grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-[#151313] p-8 text-[#f6ead7] shadow-2xl shadow-[#151313]/15">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d9aa9a]">Our point of view</p>
          <h2 className="mt-4 font-display text-4xl font-semibold">Technique should feel precise, personal, and beautiful.</h2>
          <p className="mt-5 leading-8 text-[#e9d8ce]">EB Academy teaches modern artistry, professional habits, and client trust with a refined standard from the first lesson to final certification.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} imageShape="square" showIcons />
          ))}
        </div>
      </section>
    </main>
  );
}
