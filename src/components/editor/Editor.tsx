import React, { useState, useEffect, useRef } from 'react';
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
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '50%',
          right: '0px',
          transform: 'translateY(-50%)',
          zIndex: 1001,
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
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isFullScreen ? '98%' : '40%',
        height: '100%',
        backgroundColor: '#26272d',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
        zIndex: 1000,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setIsVisible(false)}
          style={{
              background: 'none', border: 'none', color: '#bbb',
              cursor: 'pointer', fontSize: '24px', padding: '5px 15px'
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
        }}
        placeholder="여기에 마크다운을 입력하세요..."
      />
    </div>
  );
} 