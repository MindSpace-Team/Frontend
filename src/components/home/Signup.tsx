// src/components/home/Signup.tsx
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
    // TODO: 회원가입 로직
    alert("회원가입 완료 (더미)");
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
      <input
        type="text"
        placeholder="이름"
        className="p-2 rounded text-black"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
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
      <button type="submit" className="mt-2 p-2 bg-gray-600 rounded">회원가입</button>
    </form>
  );
}
