import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMindGraphStore } from '@/store/mindGraphStore';

export default function Editor({ isMenuVisible = true }: { isMenuVisible?: boolean }) {
  const { selectedNodeId, nodes, setNodeContent, selectNode } = useMindGraphStore();
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.content || '');
      setVisible(true);
      setClosing(false);
      setIsFullScreen(false);
    } else {
      setVisible(false);
      setClosing(false);
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

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      selectNode(null);
    }, 400); // 애니메이션 시간과 맞춤
  };

  if (!selectedNodeId && !visible) {
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
            width: isFullScreen
              ? (isMenuVisible ? 'calc(100vw - 280px)' : '100vw')
              : '50vw',
            maxWidth: isFullScreen ? (isMenuVisible ? 'calc(100vw - 280px)' : '100vw') : 700,
            minWidth: 320,
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
            willChange: 'transform,width',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1)',
            transform: visible && !closing ? 'translateX(0)' : 'translateX(100%)',
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
              onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
              onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
            >
              ✕
            </button>
            <button
              onClick={() => setIsFullScreen(f => !f)}
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
            placeholder="내용을 입력하세요..."
          />
        </div>,
        document.body
      )}
    </>
  );
} 