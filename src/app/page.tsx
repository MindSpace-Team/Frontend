import Home from "@/components/home/Home";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function HomePage() {
  return (
    <>
      <StarsBackground />
      <ShootingStars />
      <Home />
    </>
  );
}