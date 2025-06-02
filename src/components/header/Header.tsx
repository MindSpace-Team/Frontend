"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-16 flex items-center px-8 bg-gray-900 text-white shadow-md">
      <Link href="/" className="block cursor-pointer" prefetch={false}>
        <Image
          src="/logo/Mind_Space.webp"
          alt="Mind Space Logo"
          width={220}
          height={40}
          priority
          className="h-10 w-auto"
        />
      </Link>
    </header>
  );
}
