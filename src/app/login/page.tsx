import Login from "@/components/home/Login";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import "@/styles/globals.css";

export default function LoginPage() {
  return (
    <>
      <StarsBackground />
      <ShootingStars />
      <Login />
    </>
  );
}
