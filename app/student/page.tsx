"use client";

import { DashboardStats } from "@/components/student/dashboard-stats";
import { DashboardSchedule } from "@/components/student/dashboard-schedule";
import { DashboardNotices } from "@/components/student/dashboard-notices";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || role !== "student") {
                router.push("/login"); // Students use the main /login page
            }
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== "student") {
        return <div className="flex h-full min-h-[50vh] items-center justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                    Welcome back, {user?.displayName || "Student"}. Here's your academic summary.
                </p>
            </div>

            {/* Hero / Welcome Card */}
            <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-primary to-secondary p-8 shadow-xl shadow-primary/20 text-white">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">You have an upcoming exam.</h2>
                    <p className="mt-2 text-white/90 max-w-xl">
                        "Data Structures" midterm is scheduled for Feb 20th. Make sure to review the syllabus.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 border-0" asChild>
                            <Link href="/student/timetable">View Timetable</Link>
                        </Button>
                        <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50" asChild>
                            <Link href="/student/courses">My Courses</Link>
                        </Button>
                    </div>
                </div>
                {/* Abstract Shapes */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 opacity-30 mix-blend-overlay" />
                <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/20 blur-3xl mix-blend-overlay" />
            </div>

            <DashboardStats />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <DashboardSchedule />
                <DashboardNotices />
            </div>
        </div>
    );
}
