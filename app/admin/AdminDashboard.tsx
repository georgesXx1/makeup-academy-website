"use client";

import { FormEvent, useMemo, useState } from "react";
import { AtSign, Award, BookOpen, Download, Image, Mail, MapPin, MessageCircle, Phone, Plus, Save, Search, Trash2, Users } from "lucide-react";
import { downloadCertificatePng } from "@/lib/certificateDownload";
import type { ContactInfo, SiteContent, TeamMember } from "@/lib/content";
import type { CourseDetail } from "@/lib/courses";

type Certificate = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

type AdminTab = "certificates" | "courses" | "team" | "contact";
type CourseTextKey = "title" | "slug" | "category" | "shortDescription" | "duration" | "price" | "cardPrice" | "location" | "participants" | "longDescription" | "finalResult" | "imageUrl";
type ListCourseKey = "certificates" | "targetAudience" | "importantNotes" | "possibleMasterclasses" | "eventSupport" | "whatStudentsWillLearn";

const emptyCertificateForm = {
  studentNames: "",
  courseName: "",
  issueDate: new Date().toISOString().slice(0, 10),
};

const emptyTeamMember: TeamMember = {
  id: "",
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
};

const emptyContact: ContactInfo = {
  headline: "",
  description: "",
  emails: [],
  phones: [],
  whatsapp: "",
  location: "",
  instagram: "",
};

const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
  { id: "certificates", label: "Certificates", icon: <Award size={18} /> },
  { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
  { id: "team", label: "Team", icon: <Users size={18} /> },
  { id: "contact", label: "Contact", icon: <Mail size={18} /> },
];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [activePassword, setActivePassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("certificates");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [content, setContent] = useState<SiteContent>({ courses: [], team: [], contact: emptyContact });
  const [adminCourses, setAdminCourses] = useState<CourseDetail[]>([]);
  const [activeCourseSlug, setActiveCourseSlug] = useState("");
  const [certificateForm, setCertificateForm] = useState(emptyCertificateForm);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return certificates;

    return certificates.filter((certificate) =>
      [certificate.studentName, certificate.courseName, certificate.code, certificate.issueDate]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [certificates, search]);

  async function loadCertificates(nextPassword = activePassword) {
    const response = await fetch("/api/admin/certificates", {
      headers: { "x-admin-password": nextPassword },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Could not load certificates.");
    setCertificates(data.certificates);
  }

  async function loadContent(nextPassword = activePassword) {
    const response = await fetch("/api/admin/content", {
      headers: { "x-admin-password": nextPassword },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Could not load site content.");
    setContent(data.content);
  }

  async function loadCourses(nextPassword = activePassword) {
    const response = await fetch("/api/admin/courses", {
      headers: { "x-admin-password": nextPassword },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Could not load courses.");
    setAdminCourses(data.courses);
    setActiveCourseSlug((current) => current || data.courses[0]?.slug || "");
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setMessage("Invalid password.");
      setLoading(false);
      return;
    }

    try {
      setActivePassword(password);
      await Promise.all([loadCertificates(password), loadContent(password), loadCourses(password)]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
    }

    setLoading(false);
  }

  async function createCertificates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const names = certificateForm.studentNames
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter(Boolean);

    const response = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": activePassword,
      },
      body: JSON.stringify({
        studentNames: names,
        courseName: certificateForm.courseName,
        issueDate: certificateForm.issueDate,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not create certificates.");
      return;
    }

    setCertificateForm({ ...emptyCertificateForm, courseName: certificateForm.courseName });
    await loadCertificates();
    setMessage(`Created ${data.certificates.length} certificate${data.certificates.length === 1 ? "" : "s"}.`);
  }

  async function removeCertificate(code: string) {
    const response = await fetch(`/api/admin/certificates/${encodeURIComponent(code)}`, {
      method: "DELETE",
      headers: { "x-admin-password": activePassword },
    });

    if (!response.ok) {
      setMessage("Could not delete certificate.");
      return;
    }

    setCertificates((current) => current.filter((certificate) => certificate.code !== code));
    setMessage("Certificate deleted.");
  }

  async function saveContent(nextContent = content) {
    setSavingContent(true);
    setMessage("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": activePassword,
      },
      body: JSON.stringify(nextContent),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not save content.");
      setSavingContent(false);
      return;
    }

    setContent(data.content);
    setMessage("Site content saved.");
    setSavingContent(false);
  }

  function updateCourse(slug: string, key: CourseTextKey, value: string) {
    setAdminCourses((current) =>
      current.map((course) => (course.slug === slug ? { ...course, [key]: value } : course)),
    );
  }

  function updateCourseList(slug: string, key: ListCourseKey, value: string) {
    setAdminCourses((current) =>
      current.map((course) => (course.slug === slug ? { ...course, [key]: linesToList(value) } : course)),
    );
  }

  function updateCourseCurriculum(slug: string, value: string) {
    setAdminCourses((current) =>
      current.map((course) => (course.slug === slug ? { ...course, curriculum: parseCurriculumText(value) } : course)),
    );
  }

  function updateTeamMember(index: number, key: keyof TeamMember, value: string) {
    setContent((current) => ({
      ...current,
      team: current.team.map((member, memberIndex) => (memberIndex === index ? { ...member, [key]: value } : member)),
    }));
  }

  function updateContact(key: "headline" | "description" | "whatsapp" | "location" | "instagram", value: string) {
    setContent((current) => ({
      ...current,
      contact: { ...current.contact, [key]: value },
    }));
  }

  function updateContactList(key: "emails" | "phones", index: number, value: string) {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: current.contact[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
      },
    }));
  }

  function addContactListItem(key: "emails" | "phones") {
    setContent((current) => ({
      ...current,
      contact: { ...current.contact, [key]: [...current.contact[key], ""] },
    }));
  }

  function removeContactListItem(key: "emails" | "phones", index: number) {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: current.contact[key].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  async function saveCourses() {
    setSavingContent(true);
    setMessage("");

    const response = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": activePassword,
      },
      body: JSON.stringify({ courses: adminCourses }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not save courses.");
      setSavingContent(false);
      return;
    }

    setAdminCourses(data.courses);
    setMessage("Courses saved.");
    setSavingContent(false);
  }

  function addTeamMember() {
    setContent((current) => ({
      ...current,
      team: [...current.team, { ...emptyTeamMember, id: crypto.randomUUID() }],
    }));
  }

  if (!activePassword) {
    return (
      <form onSubmit={login} className="luxury-card mx-auto max-w-md rounded-[2rem] p-7">
        <h1 className="font-display text-4xl font-semibold">Admin access</h1>
        <p className="mt-3 text-sm leading-6 text-[#6c5851]">Enter the academy admin password to manage certificates, courses, team, and contact info.</p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-full border border-[#b97866]/20 bg-white px-5 outline-none focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc]"
        />
        {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}
        <button disabled={loading} className="shine mt-6 w-full rounded-full bg-[#151313] px-6 py-3 text-sm font-semibold text-[#f6ead7] disabled:opacity-60">
          {loading ? "Checking..." : "Enter dashboard"}
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b97866]">Academy manager</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Admin dashboard</h1>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[390px]">
          <StatCard value={String(certificates.length)} label="Certificates" />
          <StatCard value={String(adminCourses.length)} label="Courses" />
          <StatCard value={String(content.team.length)} label="Team" />
        </div>
      </div>

      <div className="mb-6 overflow-x-auto rounded-full border border-[#b97866]/15 bg-white/70 p-1 shadow-lg shadow-[#b97866]/8">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[#151313] text-[#f6ead7]" : "text-[#51433f] hover:bg-[#fbf7f1]"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="mb-5 rounded-2xl bg-white p-4 text-sm font-semibold text-[#6c5851] shadow-lg shadow-[#b97866]/8">{message}</p>}

      {activeTab === "certificates" && (
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={createCertificates} className="luxury-card rounded-[2rem] p-6">
            <PanelTitle title="Create certificates" description="Paste one or many participant names. Codes are generated automatically." />
            <div className="mt-6 grid gap-4">
              <AdminTextarea label="Participant names" value={certificateForm.studentNames} placeholder="One name per line, or separated by commas" onChange={(value) => setCertificateForm({ ...certificateForm, studentNames: value })} />
              <label className="block text-sm font-semibold text-[#51433f]">
                Course name
                <select required value={certificateForm.courseName} onChange={(event) => setCertificateForm({ ...certificateForm, courseName: event.target.value })} className="mt-2 min-h-12 w-full rounded-full border border-[#b97866]/20 bg-white px-5 text-sm outline-none transition focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc]">
                  <option value="">Choose a course</option>
                  {adminCourses.map((course) => <option key={course.slug} value={course.title}>{course.title}</option>)}
                </select>
              </label>
              <AdminInput label="Issue date" type="date" value={certificateForm.issueDate} onChange={(value) => setCertificateForm({ ...certificateForm, issueDate: value })} />
            </div>
            <button className="shine mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#151313] px-6 py-3 text-sm font-semibold text-[#f6ead7]">
              <Plus size={18} />
              Create certificates
            </button>
          </form>

          <div className="luxury-card overflow-hidden rounded-[2rem]">
            <div className="border-b border-[#b97866]/12 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <PanelTitle title="Certificates given out" description={`${filteredCertificates.length} shown out of ${certificates.length}`} />
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b97866]" size={18} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search certificates" className="min-h-12 w-full rounded-full border border-[#b97866]/20 bg-white pl-11 pr-5 outline-none focus:border-[#b97866] md:w-72" />
                </div>
              </div>
            </div>
            <div className="max-h-[620px] divide-y divide-[#b97866]/12 overflow-auto">
              {filteredCertificates.map((certificate) => (
                <div key={certificate.code} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-semibold">{certificate.studentName}</p>
                    <p className="mt-1 text-sm text-[#6c5851]">{certificate.courseName} - {certificate.issueDate}</p>
                    <p className="mt-2 break-all rounded-full bg-[#fbf7f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#b97866]">{certificate.code}</p>
                    <p className="mt-2 break-all text-xs text-[#7a625b]">QR URL: /verify?code={certificate.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => void downloadCertificatePng(certificate)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b97866]/20 text-[#151313] transition hover:bg-[#fbf7f1]" aria-label={`Download ${certificate.studentName} certificate as PNG`}>
                      <Download size={18} />
                    </button>
                    <button onClick={() => void removeCertificate(certificate.code)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-500/20 text-red-700 transition hover:bg-red-50" aria-label={`Delete ${certificate.code}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredCertificates.length === 0 && <p className="p-6 text-sm text-[#6c5851]">No certificates found.</p>}
            </div>
          </div>
        </section>
      )}

      {activeTab === "courses" && (
        <ContentPanel title="Courses" description="Open each course tab and edit the public course card plus the full detail page." onSave={() => void saveCourses()} saving={savingContent}>
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="rounded-[1.5rem] border border-[#b97866]/14 bg-white/70 p-3">
              <div className="grid gap-2">
                {adminCourses.map((course) => (
                  <button
                    key={course.slug}
                    type="button"
                    onClick={() => setActiveCourseSlug(course.slug)}
                    className={`rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition ${activeCourseSlug === course.slug ? "bg-[#151313] text-[#f6ead7]" : "bg-[#fbf7f1] text-[#51433f] hover:bg-white"}`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>
            {adminCourses.filter((course) => course.slug === activeCourseSlug).map((course) => (
              <CourseEditor
                key={course.slug}
                course={course}
                onChange={(key, value) => updateCourse(course.slug, key, value)}
                onListChange={(key, value) => updateCourseList(course.slug, key, value)}
                onCurriculumChange={(value) => updateCourseCurriculum(course.slug, value)}
              />
            ))}
          </div>
        </ContentPanel>
      )}

      {activeTab === "team" && (
        <ContentPanel title="Meet the team" description="Edit the public team section with each person’s photo, role, and bio." onAdd={addTeamMember} onSave={() => void saveContent()} saving={savingContent}>
          <div className="grid gap-5 xl:grid-cols-2">
            {content.team.map((member, index) => (
              <EditableBlock key={member.id || index} title={member.name || "New team member"} imageUrl={member.imageUrl} onRemove={() => setContent((current) => ({ ...current, team: current.team.filter((_, memberIndex) => memberIndex !== index) }))}>
                <AdminInput label="Name" value={member.name} onChange={(value) => updateTeamMember(index, "name", value)} />
                <AdminInput label="Role" value={member.role} onChange={(value) => updateTeamMember(index, "role", value)} />
                <AdminTextarea label="Bio" value={member.bio} onChange={(value) => updateTeamMember(index, "bio", value)} />
                <ImageUpload label="Team picture" value={member.imageUrl} onChange={(value) => updateTeamMember(index, "imageUrl", value)} />
              </EditableBlock>
            ))}
          </div>
        </ContentPanel>
      )}

      {activeTab === "contact" && (
        <ContentPanel title="Contact info" description="Edit the contact block on the homepage and footer details." onSave={() => void saveContent()} saving={savingContent}>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-[#b97866]/14 bg-white/70 p-5">
              <div className="grid gap-4">
                <AdminInput label="Contact headline" value={content.contact.headline} onChange={(value) => updateContact("headline", value)} />
                <AdminTextarea label="Contact description" value={content.contact.description} onChange={(value) => updateContact("description", value)} />
                <RepeatableContactFields
                  label="Emails"
                  addLabel="Add email"
                  icon={<Mail size={16} />}
                  inputType="email"
                  values={content.contact.emails}
                  placeholder="name@example.com"
                  onAdd={() => addContactListItem("emails")}
                  onChange={(index, value) => updateContactList("emails", index, value)}
                  onRemove={(index) => removeContactListItem("emails", index)}
                />
                <RepeatableContactFields
                  label="Phone numbers"
                  addLabel="Add phone"
                  icon={<Phone size={16} />}
                  values={content.contact.phones}
                  placeholder="+961 ..."
                  onAdd={() => addContactListItem("phones")}
                  onChange={(index, value) => updateContactList("phones", index, value)}
                  onRemove={(index) => removeContactListItem("phones", index)}
                />
                <AdminInput label="WhatsApp link" value={content.contact.whatsapp} placeholder="https://wa.me/961..." onChange={(value) => updateContact("whatsapp", value)} icon={<MessageCircle size={16} />} required={false} />
                <AdminInput label="Location" value={content.contact.location} onChange={(value) => updateContact("location", value)} icon={<MapPin size={16} />} required={false} />
                <AdminInput label="Instagram link" value={content.contact.instagram} placeholder="https://instagram.com/..." onChange={(value) => updateContact("instagram", value)} icon={<AtSign size={16} />} required={false} />
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#151313] p-6 text-[#f6ead7]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa9a]">Preview</p>
              <h3 className="mt-5 font-display text-4xl font-semibold">{content.contact.headline || "Contact headline"}</h3>
              <p className="mt-4 text-sm leading-7 text-[#e9d8ce]">{content.contact.description || "Contact description"}</p>
              <div className="mt-6 grid gap-3 text-sm">
                {content.contact.emails.filter(Boolean).map((email) => <p key={email}>{email}</p>)}
                {content.contact.phones.filter(Boolean).map((phone) => <p key={phone}>{phone}</p>)}
                {content.contact.location && <p>{content.contact.location}</p>}
                {content.contact.whatsapp && <p className="break-all">{content.contact.whatsapp}</p>}
                {content.contact.instagram && <p className="break-all">{content.contact.instagram}</p>}
              </div>
            </div>
          </div>
        </ContentPanel>
      )}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[#b97866]/12 bg-white/70 p-4 shadow-lg shadow-[#b97866]/8">
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8f695e]">{label}</p>
    </div>
  );
}

function PanelTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6c5851]">{description}</p>
    </div>
  );
}

function ContentPanel({ title, description, children, onAdd, onSave, saving }: { title: string; description: string; children: React.ReactNode; onAdd?: () => void; onSave: () => void; saving: boolean }) {
  return (
    <section className="luxury-card rounded-[2rem] p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#b97866]/12 pb-5 lg:flex-row lg:items-center">
        <PanelTitle title={title} description={description} />
        <div className="flex gap-2">
          {onAdd && (
            <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full border border-[#151313]/10 bg-white px-4 py-2 text-sm font-semibold">
              <Plus size={16} />
              Add
            </button>
          )}
          <button type="button" onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#151313] px-4 py-2 text-sm font-semibold text-[#f6ead7] disabled:opacity-60">
            <Save size={16} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CourseEditor({
  course,
  onChange,
  onListChange,
  onCurriculumChange,
}: {
  course: CourseDetail;
  onChange: (key: CourseTextKey, value: string) => void;
  onListChange: (key: ListCourseKey, value: string) => void;
  onCurriculumChange: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#b97866]/14 bg-white/70 p-5">
      <div className="grid gap-5">
        <ImageUpload label="Course picture" value={course.imageUrl} onChange={(value) => onChange("imageUrl", value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput label="Course title" value={course.title} onChange={(value) => onChange("title", value)} />
          <AdminInput label="Slug" value={course.slug} onChange={(value) => onChange("slug", value)} />
          <AdminInput label="Category" value={course.category} onChange={(value) => onChange("category", value)} />
          <AdminInput label="Duration" value={course.duration} onChange={(value) => onChange("duration", value)} />
          <AdminInput label="Price" value={course.price} onChange={(value) => onChange("price", value)} />
          <AdminInput label="Card price" value={course.cardPrice ?? ""} onChange={(value) => onChange("cardPrice", value)} required={false} />
          <AdminInput label="Location" value={course.location} onChange={(value) => onChange("location", value)} />
          <AdminInput label="Participants" value={course.participants ?? ""} onChange={(value) => onChange("participants", value)} required={false} />
        </div>
        <AdminTextarea label="Short card description" value={course.shortDescription} onChange={(value) => onChange("shortDescription", value)} />
        <AdminTextarea label="Full course description" value={course.longDescription} onChange={(value) => onChange("longDescription", value)} />
        <AdminTextarea label="Certificate options, one per line" value={listToLines(course.certificates)} onChange={(value) => onListChange("certificates", value)} />
        <AdminTextarea label="Target audience, one per line" value={listToLines(course.targetAudience)} onChange={(value) => onListChange("targetAudience", value)} />
        <AdminTextarea label="Curriculum / agenda" value={curriculumToText(course.curriculum)} onChange={onCurriculumChange} placeholder={"Day 1: Title\n- Item one\n- Item two\n\nDay 2: Title\n- Item one"} />
        <AdminTextarea label="What students will learn, one per line" value={listToLines(course.whatStudentsWillLearn)} onChange={(value) => onListChange("whatStudentsWillLearn", value)} />
        <AdminTextarea label="Important notes, one per line" value={listToLines(course.importantNotes)} onChange={(value) => onListChange("importantNotes", value)} />
        <AdminTextarea label="Possible masterclasses, one per line" value={listToLines(course.possibleMasterclasses)} onChange={(value) => onListChange("possibleMasterclasses", value)} />
        <AdminTextarea label="Event details supported, one per line" value={listToLines(course.eventSupport)} onChange={(value) => onListChange("eventSupport", value)} />
        <AdminTextarea label="Final result" value={course.finalResult} onChange={(value) => onChange("finalResult", value)} />
      </div>
    </div>
  );
}

function EditableBlock({ title, children, onRemove, imageUrl }: { title: string; children: React.ReactNode; onRemove: () => void; imageUrl?: string }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#b97866]/14 bg-white/70">
      <div className="grid md:grid-cols-[160px_1fr]">
        <div className="aspect-[4/3] bg-[#151313] md:aspect-auto">
          {imageUrl ? <img src={imageUrl} alt="" className="h-full min-h-40 w-full object-cover" /> : <div className="flex h-full min-h-40 items-center justify-center text-[#f6ead7]"><Image size={24} /></div>}
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">{title}</h3>
            <button type="button" onClick={onRemove} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 text-red-700 transition hover:bg-red-50" aria-label={`Remove ${title}`}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RepeatableContactFields({
  label,
  addLabel,
  values,
  onAdd,
  onChange,
  onRemove,
  icon,
  inputType = "text",
  placeholder,
}: {
  label: string;
  addLabel: string;
  values: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  icon: React.ReactNode;
  inputType?: string;
  placeholder?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#b97866]/14 bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#51433f]">{label}</p>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full border border-[#151313]/10 bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#fbf7f1]">
          <Plus size={14} />
          {addLabel}
        </button>
      </div>
      <div className="grid gap-3">
        {values.map((value, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <AdminInput
              label={`${label.slice(0, -1)} ${index + 1}`}
              type={inputType}
              value={value}
              placeholder={placeholder}
              onChange={(nextValue) => onChange(index, nextValue)}
              icon={icon}
              required={false}
            />
            <button type="button" onClick={() => onRemove(index)} className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-full border border-red-500/20 bg-white px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50">
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))}
        {values.length === 0 && <p className="rounded-[1rem] bg-[#fbf7f1] px-4 py-3 text-sm text-[#6c5851]">No {label.toLowerCase()} added yet.</p>}
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, type = "text", placeholder, icon, required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; icon?: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-[#51433f]">
      {label}
      <span className="relative mt-2 block">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b97866]">{icon}</span>}
        <input
          required={required}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-12 w-full rounded-full border border-[#b97866]/20 bg-white px-5 text-sm outline-none transition focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc] ${icon ? "pl-11" : ""}`}
        />
      </span>
    </label>
  );
}

function AdminSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-[#51433f]">
      {label}
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-full border border-[#b97866]/20 bg-white px-5 text-sm outline-none transition focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc]"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function AdminTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-semibold text-[#51433f]">
      {label}
      <textarea
        required
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-[1.25rem] border border-[#b97866]/20 bg-white px-5 py-3 text-sm leading-6 outline-none transition focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc]"
      />
    </label>
  );
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const imageData = await resizeImageFile(file);
      onChange(imageData);
    } catch {
      setError("Could not upload this image. Try a smaller JPG or PNG.");
    }

    setUploading(false);
  }

  return (
    <div className="block text-sm font-semibold text-[#51433f]">
      {label}
      <div className="mt-2 grid gap-3 rounded-[1.25rem] border border-[#b97866]/20 bg-white p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[#151313] text-[#f6ead7]">
            {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <Image size={22} />}
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#151313] px-4 py-2 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5">
              <Image size={16} />
              {uploading ? "Uploading..." : value ? "Replace pic" : "Upload pic"}
              <input type="file" accept="image/*" onChange={(event) => void handleUpload(event)} className="sr-only" disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      </div>
    </div>
  );
}

async function resizeImageFile(file: File) {
  const imageUrl = await readFileAsDataUrl(file);
  const image = await loadImage(imageUrl);
  const maxSize = 1400;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.86);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function listToLines(items?: string[]) {
  return items?.join("\n") ?? "";
}

function linesToList(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function curriculumToText(curriculum?: CourseDetail["curriculum"]) {
  return curriculum
    ?.map((section) => [section.title, ...section.items.map((item) => `- ${item}`)].join("\n"))
    .join("\n\n") ?? "";
}

function parseCurriculumText(value: string): CourseDetail["curriculum"] {
  return value
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const [title = "", ...items] = lines;

      return {
        title,
        items: items.map((item) => item.replace(/^[-*]\s*/, "").trim()).filter(Boolean),
      };
    })
    .filter((section) => section.title || section.items.length);
}
