import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: "EB Academy",
  description: "Eliano Bou Assi Academy website with courses and certificate verification.",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/verify", label: "Verify" },
];

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { contact } = await readContent();
  const footerContact = [...contact.phones, ...contact.emails, contact.location].filter(Boolean).join(" | ");

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-[#b97866]/10 bg-[#fbf7f1]/82 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <Link href="/" className="group flex items-center gap-3" aria-label="EB Academy home">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151313] text-sm font-semibold text-[#f6ead7] shadow-lg shadow-[#b97866]/20">
                EB
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-semibold tracking-wide">EB Academy</span>
                <span className="hidden text-xs uppercase tracking-[0.28em] text-[#8f695e] sm:block">Eliano Bou Assi Academy</span>
              </span>
            </Link>
            <div className="hidden items-center gap-7 md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-[#51433f] transition hover:text-[#b97866]">
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/admin" className="rounded-full border border-[#151313]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#151313] transition hover:border-[#b97866]/40 hover:bg-white">
              Admin
            </Link>
          </nav>
        </header>
        {children}
        <footer className="border-t border-[#b97866]/10 px-5 py-10 text-center text-sm text-[#7a625b]">
          <p>EB Academy - Eliano Bou Assi Academy</p>
          {footerContact && <p className="mt-2">{footerContact}</p>}
        </footer>
      </body>
    </html>
  );
}
