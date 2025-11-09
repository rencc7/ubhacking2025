"use client";

import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function GetStartedButton({ className }: { className?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!loading && user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label="Get Started"
    >
      <span className="inline-flex items-center justify-center gap-2">
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </span>
    </button>
  );
}
