"use client";
import Image from "next/image";
import Link from "next/link";
import "@/styles/Header.css";

export default function Header() {
  return (
    <header className="led-header">
      {/* 로고 */}
      <Link href="/" className="led-logo flex items-center" prefetch={false}>
        <Image
          src="/logo/Mind_Space.webp"
          alt="Mind Space Logo"
          width={170}
          height={36}
          priority
        />
      </Link>
      {/* 버튼 그룹 */}
      <nav className="led-nav">
        {[
          { href: "/login", label: "LOGIN" },
          { href: "/signup", label: "SIGNUP" },
          { href: "/canvas", label: "CANVAS" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}>
            <span className="glitch-text" data-text={label}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}