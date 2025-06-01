// src/components/home/Login.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직
    alert("로그인 성공 (더미)");
    router.push("/home");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
      <input
        type="email"
        placeholder="이메일"
        className="p-2 rounded text-black"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="p-2 rounded text-black"
        value={pw}
        onChange={e => setPw(e.target.value)}
        required
      />
      <button type="submit" className="mt-2 p-2 bg-blue-600 rounded">로그인</button>
    </form>
  );
}
