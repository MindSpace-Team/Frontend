"use client";
import React from "react";
import styles from "@/styles/Spaceship.module.css";

export default function Spaceship({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.internal}>
      <div className={styles.window}>
        {children}
      </div>
    </div>
  );
}