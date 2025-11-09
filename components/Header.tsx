"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { LogOut, User, UserPlus } from "lucide-react";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, loading: isLoading, logout } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname?.startsWith('/login');

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          FitAI
        </Link>

        <nav className="flex items-center gap-6">
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-warm-gray hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/workouts"
                className="text-warm-gray hover:text-primary transition-colors"
              >
                Workouts
              </Link>
              <Link
                href="/dashboard/progress"
                className="text-warm-gray hover:text-primary transition-colors"
              >
                Progress
              </Link>
              <Link
                href="/dashboard/exercises"
                className="text-warm-gray hover:text-primary transition-colors"
              >
                Exercises
              </Link>
              <Link
                href="/dashboard/reports"
                className="text-warm-gray hover:text-primary transition-colors"
              >
                Reports
              </Link>
            </>
          )}

          {!isLoading && (
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-warm-gray">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-warm-gray"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                // On the login page, show a Sign up button in the header instead of Login
                isLoginPage ? (
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign up</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

