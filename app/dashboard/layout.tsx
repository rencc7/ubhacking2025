'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from '@/components/AuthProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Prefer the client auth state to avoid a race where the session cookie
    // hasn't been applied to the browser yet when we immediately hit the
    // server endpoint. Wait until the client auth provider finishes loading.
    if (loading) return;
    if (!user) {
      console.log('No authenticated user found (client), redirecting to login...');
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

