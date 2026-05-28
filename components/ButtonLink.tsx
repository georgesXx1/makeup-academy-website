import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
};

export function ButtonLink({ href, children, variant = "dark" }: ButtonLinkProps) {
  const classes =
    variant === "dark"
      ? "shine bg-[#151313] text-[#f6ead7] shadow-xl shadow-[#b97866]/20 hover:-translate-y-0.5"
      : "border border-[#b97866]/25 bg-white/70 text-[#151313] hover:border-[#b97866]/60 hover:bg-white";

  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${classes}`}>
      {children}
    </Link>
  );
}
