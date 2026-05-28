import { CourseCard } from "@/components/CourseCard";
import { SectionHeading } from "@/components/SectionHeading";
import { readCourses } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await readCourses();

  return (
    <main className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Course Catalog" title="Makeup courses with a premium finish" description="Explore EB Academy courses, certificates, training options, and booking details." />
      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap justify-center gap-8">
        {courses.map((course) => <CourseCard key={course.title} course={course} />)}
      </div>
    </main>
  );
}
