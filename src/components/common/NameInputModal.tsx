"use client";
import React, { useState, useEffect } from "react";
import { useNameInputStore } from "@/store/nameInputStore";
import { useMindGraphStore } from "@/store/mindGraphStore";

export default function NameInputModal() {
  const { isOpen, data, closeNameInput } = useNameInputStore();
  const { addStar, addPlanet, addSatellite } = useMindGraphStore();
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !data) return;

    if (data.type === "star" && data.x !== undefined && data.y !== undefined) {
      addStar(data.x, data.y, name);
    } else if (data.type === "planet" && data.parentId !== undefined) {
      addPlanet(data.parentId, name);
    } else if (data.type === "satellite" && data.parentId !== undefined) {
      addSatellite(data.parentId, name);
    }

    closeNameInput();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <form onSubmit={handleSubmit}>
          <h2 style={styles.title}>이름 입력</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="노드의 이름을 입력하세요"
            autoFocus
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>
              생성
            </button>
            <button type="button" onClick={closeNameInput} style={styles.button}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    background: "#2a2a3a",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    color: 'white',
  },
  title: {
    margin: 0,
    marginBottom: '15px',
    textAlign: 'center',
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #555",
    background: '#3a3a4a',
    color: 'white',
    boxSizing: 'border-box'
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    background: '#4a4a5a',
    color: 'white',
  },
}; 