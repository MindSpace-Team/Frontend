import Signup from "@/components/home/Signup";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import "@/styles/globals.css";

export default function SignupPage() {
  return (
    <>
      <StarsBackground />
      <ShootingStars />
      <Signup />
    </>
  );
}
