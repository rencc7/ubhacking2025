"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { user, isLoading } = useUser();

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
                  <a
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-warm-gray"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </a>
                </>
              ) : (
                <a
                  href="/api/auth/login"
                  className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

