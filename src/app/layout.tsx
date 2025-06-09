import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Header from "@/components/header/Header";
import "@/styles/globals.css";

export const metadata = {
  title: "Mind Space",
  description: "우주 마인드맵 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-black text-white relative overflow-hidden">
        <StarsBackground />
        <ShootingStars />
        <Header />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
