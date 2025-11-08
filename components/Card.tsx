"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-sm border border-border ${className}`}>
      {children}
    </div>
  );
}

