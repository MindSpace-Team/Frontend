import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMindGraphStore } from '@/store/mindGraphStore';

export default function Editor() {
  const { selectedNodeId, nodes, setNodeContent } = useMindGraphStore();
  const [content, setContent] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  // When a new node is selected, reset visibility and fullscreen
  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.content || '');
      setIsVisible(true);
      setIsFullScreen(false);
    }
  }, [selectedNode]);


  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (selectedNodeId) {
      setNodeContent(selectedNodeId, content);
    }
  };

  if (!selectedNodeId) {
    return null;
  }

  // Render the collapsed button if the panel is not visible
  if (!isVisible) {
    const collapsedBtn = (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '50%',
          right: '0px',
          transform: 'translateY(-50%)',
          zIndex: 99999,
          pointerEvents: 'auto',
          background: '#31323a',
          border: '1px solid #555',
          color: '#fff',
          padding: '15px 10px',
          borderRadius: '8px 0 0 8px',
          cursor: 'pointer',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '14px',
        }}
      >
        &lt;&lt; 열기
      </button>
    );
    return typeof window !== 'undefined' ? createPortal(collapsedBtn, document.body) : null;
  }

  return (
    <>
      {typeof window !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: isFullScreen ? '240px' : undefined,
            width: isFullScreen ? 'auto' : '40%',
            height: '100%',
            backgroundColor: '#26272d',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
            zIndex: 99999,
            pointerEvents: 'auto',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                  background: 'none', border: 'none', color: '#bbb',
                  cursor: 'pointer', fontSize: '24px', padding: '5px 15px',
                  pointerEvents: 'auto', zIndex: 99999
              }}
            >
              &gt;&gt;
            </button>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                style={{
                  background: '#31323a', border: '1px solid #555', color: '#ddd',
                  borderRadius: '6px', padding: '8px 12px', cursor: 'pointer',
                  pointerEvents: 'auto', zIndex: 99999
                }}
              >
                {isFullScreen ? '창 모드' : '전체 화면'}
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            style={{
              flexGrow: 1,
              width: '100%',
              background: '#1e1e1e',
              border: '1px solid #444',
              borderRadius: '8px',
              color: 'white',
              padding: '10px',
              fontSize: '16px',
              resize: 'none',
              outline: 'none',
              pointerEvents: 'auto',
              zIndex: 99999
            }}
            placeholder="여기에 마크다운을 입력하세요..."
          />
        </div>,
        document.body
      )}
    </>
  );
} 