'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          console.log('No authenticated user found, redirecting to login...');
          router.replace('/login');
        }
      })
      .catch(err => {
        console.error('Error checking auth:', err);
        router.replace('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

