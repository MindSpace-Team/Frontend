import "@/styles/globals.css";

export const metadata = {
  title: "Mind Space",
  description: "우주 마인드맵 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-black text-white">
        {/* 상단 NavBar, Footer 등 필요 시 추가 */}
        {children}
      </body>
    </html>
  );
}
