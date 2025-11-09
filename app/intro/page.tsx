import Link from 'next/link';
import Header from '@/components/Header';
import { Sparkles, Target, TrendingUp, Cpu, ShieldCheck, Users, Clock } from 'lucide-react';

export default function IntroPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">About FitAI</h1>
          <p className="text-lg text-warm-gray">
            FitAI is your personal AI-powered fitness coach. We generate personalized
            workout plans, keep you motivated with daily check-ins, and track your
            progress with clear visualizations. Whether you're a beginner or an
            experienced athlete, FitAI adapts to your goals and evolves with you.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Plans</h3>
              <p className="text-warm-gray">Plans tailored to your body, equipment and schedule using intelligent optimization.</p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Daily Motivation</h3>
              <p className="text-warm-gray">Short check-ins, streaks and tips to keep you consistent and engaged.</p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-warm-gray">Track weight, measurements and performance with clear charts and exportable logs.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register" className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark">
              Get Started
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg bg-muted text-foreground hover:bg-accent">
              Log in
            </Link>
          </div>
        </section>

        <section className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">How FitAI works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-medium">Personalized Plan Generation</h4>
              </div>
              <p className="text-warm-gray">Answer a few simple questions about your goals, experience, and available equipment. FitAI creates an initial plan optimized for progress and time.</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-secondary" />
                <h4 className="text-lg font-medium">Adaptive Scheduling</h4>
              </div>
              <p className="text-warm-gray">Plans adapt as you complete workouts and provide alternative sessions when your schedule changes.</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-accent" />
                <h4 className="text-lg font-medium">Community & Coaching</h4>
              </div>
              <p className="text-warm-gray">Join challenges, share achievements, and get automated coaching tips tailored to your progress.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="text-warm-gray">We treat your data with care. Personal data and logs are stored securely. Authentication uses HttpOnly cookies and industry-standard cryptography. You can export or delete your data anytime from your profile.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">What people say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-warm-gray">“FitAI helped me finally stick to a plan — the daily check-ins and shorter workouts made it easy to keep momentum.”</p>
              <div className="mt-4 font-medium">— Alex</div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-warm-gray">“I love that exercises are tailored to the equipment I actually have at home.”</p>
              <div className="mt-4 font-medium">— Priya</div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
