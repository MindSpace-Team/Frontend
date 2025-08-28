"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useMindGraphStore } from '@/store/mindGraphStore';
import { usePopupStore } from '@/store/popupStore';
import Link from 'next/link';

interface NodeTreeProps {
  onMenuStateChange?: (isVisible: boolean) => void;
}

export default function NodeTree({ onMenuStateChange }: NodeTreeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<'tree' | 'user'>('tree');
  const { nodes, rootIds, selectNode } = useMindGraphStore();
  const { setPopup } = usePopupStore();
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // 임시 로그인 상태 (나중에 실제 인증 상태로 교체)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 메뉴 상태 변경을 부모 컴포넌트에 알림
  useEffect(() => {
    onMenuStateChange?.(isVisible);
  }, [isVisible, onMenuStateChange]);

  const handleMouseEnter = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  // Basic recursive component to render the tree - will be improved later
  const renderNode = (nodeId: number, depth: number) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setPopup({ id: node.id, x: 0, y: 0 });
    };

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 15}px`, padding: '3px 0' }}>
        <span
          onClick={() => selectNode(node.id)}
          onContextMenu={handleContextMenu}
          style={{ cursor: 'pointer' }}
        >
          {node.type === 'star' && '⭐ '}
          {node.type === 'planet' && '🪐 '}
          {node.type === 'satellite' && '🛰️ '}
          {node.name}
        </span>
        {node.children.map(childId => renderNode(childId, depth + 1))}
      </div>
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // 실제 로그아웃 로직 추가
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '20px',
          height: '100%',
          zIndex: 999, // 메뉴보다 뒤에 있도록
        }}
      />
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          backgroundColor: '#26272d',
          boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
          zIndex: 1000,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* 상단 헤더 영역 */}
        <div style={{
          padding: '15px',
          borderBottom: '1px solid #444',
          background: '#1e1f23'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Mind Space</span>
          </div>

          {/* 홈 버튼 */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#4a90e2',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              🏠 홈으로
            </button>
          </Link>

          {/* 탭 버튼들 */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setActiveSection('tree')}
              style={{
                flex: 1,
                padding: '8px',
                background: activeSection === 'tree' ? '#4a90e2' : '#444',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📁 탐색기
            </button>
            <button
              onClick={() => setActiveSection('user')}
              style={{
                flex: 1,
                padding: '8px',
                background: activeSection === 'user' ? '#4a90e2' : '#444',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              👤 계정
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
          {activeSection === 'tree' ? (
            // 탐색기 탭
            <div>
              <div style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                노드 트리
              </div>
              {rootIds.map(rootId => renderNode(rootId, 0))}
            </div>
          ) : (
            // 계정 탭
            <div>
              <div style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                계정 정보
              </div>

              {isLoggedIn ? (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    background: '#333',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {/* {userInfo.name} */}
                      사용자
                    </div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>
                      {/* {userInfo.email} */}
                      user@example.com
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#e74c3c',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    background: '#333',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#ccc'
                  }}>
                    로그인이 필요합니다
                  </div>

                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#4a90e2',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}
                    >
                      로그인
                    </button>
                  </Link>

                  <Link href="/signup" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#27ae60',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      회원가입
                    </button>
                  </Link>
                </div>
              )}

              {/* 추가 메뉴들 */}
              <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                  도움말
                </div>
                <Link href="/guide" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginBottom: '5px',
                      textAlign: 'left'
                    }}
                  >
                    📖 사용 가이드
                  </button>
                </Link>
                <Link href="/about" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginBottom: '5px',
                      textAlign: 'left'
                    }}
                  >
                    ℹ️ 서비스 소개
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
 