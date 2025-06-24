"use client";
import React, { useState } from 'react';
import { useMindGraphStore } from '@/store/mindGraphStore';

export default function NodeTree() {
  const [isVisible, setIsVisible] = useState(true);
  const { nodes, rootIds } = useMindGraphStore();

  // Basic recursive component to render the tree - will be improved later
  const renderNode = (nodeId: number, depth: number) => {
    const node = nodes[nodeId];
    if (!node) return null;

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 15}px`, padding: '3px 0' }}>
        <span>{node.type.charAt(0).toUpperCase()}{node.type.slice(1)} {node.id}</span>
        {node.children.map(childId => renderNode(childId, depth + 1))}
      </div>
    );
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '15px',
          left: '0px',
          zIndex: 1001,
          background: '#31323a',
          border: '1px solid #555',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
        }}
      >
        &gt;&gt;
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '240px',
        height: '100%',
        backgroundColor: '#26272d',
        boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        zIndex: 1000,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>탐색기</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none', border: 'none', color: '#bbb',
            cursor: 'pointer', fontSize: '24px', padding: '5px 15px'
          }}
        >
          &lt;&lt;
        </button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {rootIds.map(rootId => renderNode(rootId, 0))}
      </div>
    </div>
  );
} 