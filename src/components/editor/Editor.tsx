import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMindGraphStore } from '@/store/mindGraphStore';

export default function Editor() {
  const { selectedNodeId, nodes, setNodeContent, selectNode } = useMindGraphStore();
  const [content, setContent] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenStep, setFullScreenStep] = useState<0 | 1 | 2>(0); // 0: normal, 1: left만 이동, 2: width 확장

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.content || '');
      setIsFullScreen(false);
      setFullScreenStep(0);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (isFullScreen) {
      setFullScreenStep(1);
      const timer = setTimeout(() => setFullScreenStep(2), 60); // left 이동 후 width 확장
      return () => clearTimeout(timer);
    } else {
      setFullScreenStep(0);
    }
  }, [isFullScreen]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (selectedNodeId) {
      setNodeContent(selectedNodeId, content);
    }
  };

  const handleClose = () => {
    selectNode(null);
  };

  if (!selectedNodeId) {
    return null;
  }

  return (
    <>
      {typeof window !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: isFullScreen ? 'calc(100vw - 280px)' : '40%',
            height: '100%',
            backgroundColor: '#26272d',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
            zIndex: 99999,
            pointerEvents: 'auto',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflow: 'hidden',
            willChange: 'width',
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={handleClose}
              style={{
                background: 'none', border: 'none', color: '#bbb',
                cursor: 'pointer', fontSize: '20px', padding: '5px 10px',
                pointerEvents: 'auto', zIndex: 99999,
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b6b'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#bbb'}
            >
              ✕
            </button>
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