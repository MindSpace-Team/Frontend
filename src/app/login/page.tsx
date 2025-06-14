import Login from "@/components/home/Login";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Header from "@/components/header/Header";
import "@/styles/globals.css";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <Login />
      <StarsBackground />
      <ShootingStars />
      <Header />
    </main>
  );
}
