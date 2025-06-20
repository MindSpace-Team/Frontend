"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("회원가입 완료 (더미)");
    router.push("/login");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full text-white font-orbitron overflow-hidden">

      <div className="flex flex-col items-center gap-6 w-72 sm:w-80 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="이름"
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
          />
          <button type="submit" className="glitch-button text-lg tracking-wide w-full">
            <span className="glitch-text" data-text="회원가입">회원가입</span>
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className="glitch-button text-lg tracking-wide w-full"
        >
          <span className="glitch-text" data-text="뒤로가기">뒤로가기</span>
        </button>
      </div>
    </div>
  );
}