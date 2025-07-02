"use client";
import { useState } from "react";
import { Menu, MenuItem, HoveredLink } from "../ui/navbar-menu";

export default function Header() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center bg-transparent mt-8 px-4 pointer-events-none">
      {/* 메뉴 그룹 */}
      <nav className="w-full max-w-4xl flex justify-center pointer-events-auto" style={{margin: '0 auto'}}>
        <Menu setActive={setActive}>
          <HoveredLink href="/">Home</HoveredLink>
          <MenuItem setActive={setActive} active={active} item="Canvas">
            <div className="flex flex-col space-y-2 text-sm min-w-[180px]">
              <HoveredLink href="/canvas">마인드맵 캔버스</HoveredLink>
              <HoveredLink href="/guide">사용 가이드</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Account">
            <div className="flex flex-col space-y-2 text-sm min-w-[180px]">
              <HoveredLink href="/login">로그인</HoveredLink>
              <HoveredLink href="/signup">회원가입</HoveredLink>
            </div>
          </MenuItem>
          {/* 아래는 예시 - 추가 메뉴 */}
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-2 text-sm min-w-[180px]">
              <HoveredLink href="/about">서비스 소개</HoveredLink>
              <HoveredLink href="/team">팀 소개</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
}
