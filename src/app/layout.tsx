"use client";
import Header from "@/components/header/Header";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCanvasPage = pathname === "/canvas";

  return (
    <html lang="ko">
      <head>
        <title>Mind Space</title>
        <meta name="description" content="우주 마인드맵 프로젝트" />
      </head>
      <body className="min-h-screen bg-black text-white relative overflow-hidden">
        {!isCanvasPage && <Header />}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
