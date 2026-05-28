import Link from "next/link";
import { ArrowRight, Award, Clock, MapPin, Sparkles } from "lucide-react";
import type { CourseDetail } from "@/lib/courses";

type CourseCardProps = {
  course: CourseDetail;
};

export function CourseCard({ course }: CourseCardProps) {
  const certificateText = course.certificates?.length ? "Certificate available" : "Certificate details on request";

  return (
    <article className="luxury-card group w-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#b97866]/15 md:w-[calc(50%-1rem)] xl:w-[calc(33.333%-1.35rem)]">
      <div className="relative aspect-[4/3] bg-[#151313]">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#f6ead7]">
            <Sparkles size={30} />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b97866]">{course.category}</span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold">{course.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#6c5851]">{course.shortDescription}</p>
        <div className="mt-6 grid gap-3 text-sm text-[#51433f]">
          <span className="flex items-center gap-2"><Clock size={16} className="text-[#b97866]" /> {course.duration}</span>
          <span className="flex items-center gap-2"><MapPin size={16} className="text-[#b97866]" /> {course.location}</span>
          <span className="flex items-center gap-2"><Award size={16} className="text-[#b97866]" /> {certificateText}</span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#b97866]/12 pt-5">
          <span className="font-display text-2xl font-semibold text-[#151313]">{course.cardPrice ?? course.price}</span>
          <Link href={`/courses/${course.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f7d9dc] px-4 py-3 text-sm font-semibold text-[#151313] transition group-hover:bg-[#151313] group-hover:text-[#f6ead7]">
            View Course
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
