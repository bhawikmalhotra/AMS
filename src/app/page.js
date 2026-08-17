import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "VYNS Global Attendance Management System | Official Portal",
  description: "Official employee attendance management portal for VYNS Global. Manage daily check-ins, department attendance, and employee records.",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-3xl font-bold shadow-sm">
          📋
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">VYNS Global</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Attendance Management System
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            A simple, secure, and modern portal for employees, managers, and administrators.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3 text-left pt-4">
          <div className="rounded-lg border p-4 bg-card shadow-sm">
            <div className="text-xl mb-2">👤</div>
            <h3 className="font-semibold text-sm">Employee</h3>
            <p className="text-xs text-muted-foreground mt-1">
              One-click check-in/out and personal attendance statistics.
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-card shadow-sm">
            <div className="text-xl mb-2">👔</div>
            <h3 className="font-semibold text-sm">Manager</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Department-scoped employee list and daily turnout tracking.
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-card shadow-sm">
            <div className="text-xl mb-2">👑</div>
            <h3 className="font-semibold text-sm">Admin</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Company-wide overview, account creation, and role management.
            </p>
          </div>
        </div>

        {/* Login / Dashboard Button */}
        <div className="pt-6">
          {session?.user ? (
            <Link href="/dashboard">
              <Button size="lg" className="px-8 font-semibold">
                Go to Dashboard &rarr;
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" className="px-8 font-semibold">
                Sign In to Portal &rarr;
              </Button>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
