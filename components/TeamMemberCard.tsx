import Link from "next/link";
import { ArrowRight, Camera, Mail } from "lucide-react";
import type { TeamMember } from "@/lib/content";

type TeamMemberCardProps = {
  member: TeamMember;
  imageShape?: "wide" | "square";
  showIcons?: boolean;
};

export function TeamMemberCard({ member, imageShape = "wide", showIcons = false }: TeamMemberCardProps) {
  const shortBio = getShortBio(member.bio);

  return (
    <article className="luxury-card flex w-full flex-col overflow-hidden rounded-[1.75rem] md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]">
      <div className={`${imageShape === "square" ? "aspect-square" : "aspect-[4/3]"} bg-[#151313]`}>
        {member.imageUrl ? <img src={member.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-3xl font-semibold">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-[#b97866]">{member.role}</p>
        <p className="mt-4 text-sm leading-7 text-[#6c5851]">{shortBio}</p>
        <Link href={`/team/${member.id}`} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#151313] px-4 py-2.5 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5">
          Read full bio
          <ArrowRight size={16} />
        </Link>
        {showIcons && (
          <div className="mt-5 flex gap-3 text-[#151313]">
            <Mail size={18} />
            <Camera size={18} />
          </div>
        )}
      </div>
    </article>
  );
}

function getShortBio(bio: string) {
  const cleanBio = bio.trim();

  if (cleanBio.length <= 130) {
    return cleanBio;
  }

  const trimmed = cleanBio.slice(0, 130);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpace > 90 ? lastSpace : trimmed.length)}...`;
}
