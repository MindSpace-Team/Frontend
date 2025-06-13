import Signup from "@/components/home/Signup";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Header from "@/components/header/Header";
import "@/styles/globals.css";

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <Signup />
      <StarsBackground />
      <ShootingStars />
      <Header />
    </main>
  );
}
