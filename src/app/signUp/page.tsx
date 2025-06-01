"use client";
import Signup from "@/components/home/Signup";

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <h2 className="text-2xl mb-4 font-bold">회원가입</h2>
      <Signup />
    </main>
  );
}
