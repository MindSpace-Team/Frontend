"use client";
import Login from "@/components/home/Login";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <h2 className="text-2xl mb-4 font-bold">로그인</h2>
      <Login />
    </main>
  );
}
