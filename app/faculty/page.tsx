"use client";

import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function FacultyDashboard() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || role !== "faculty") {
                router.push("/faculty/login");
            }
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== "faculty") {
        return <div className="flex h-full min-h-[50vh] items-center justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Faculty Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your courses, attendance, and student performance.
                </p>
            </div>

            {/* Hero / Welcome Card */}
            <div className="relative overflow-hidden rounded-4xl bg-[#165A3A] p-8 shadow-xl shadow-primary/20 text-white">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">Good Morning, Professor.</h2>
                    <p className="mt-2 text-white/90 max-w-xl">
                        You have 3 classes scheduled for today. Don't forget to mark attendance for "Advanced Algorithms" by 2:00 PM.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Button variant="secondary" className="rounded-full bg-white text-[#165A3A] hover:bg-white/90 border-0 shadow-lg" asChild>
                            <Link href="/faculty/attendance">Mark Attendance</Link>
                        </Button>
                        <Button variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-0" asChild>
                            <Link href="/faculty/schedule">View Schedule</Link>
                        </Button>
                    </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#56A981] blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#56A981] blur-3xl opacity-20 transform translate-y-1/2" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Schedule Card */}
                <Card className="col-span-1 lg:col-span-2 border-border/50 shadow-sm rounded-4xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            Today's Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { time: "09:00 AM", course: "CS101: Intro to Programming", room: "Lab A", status: "Completed" },
                                { time: "11:00 AM", course: "CS302: Data Structures", room: "Room 304", status: "Upcoming" },
                                { time: "02:00 PM", course: "CS405: Software Engineering", room: "Room 201", status: "Upcoming" },
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center justify-between rounded-xl border border-transparent bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex flex-col items-center justify-center rounded-lg bg-white h-12 w-16 text-xs font-medium text-muted-foreground shadow-sm group-hover:text-primary transition-colors">
                                            {item.time.split(" ")[0]}
                                            <span className="text-[10px] text-muted-foreground/70">{item.time.split(" ")[1]}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.course}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {item.room}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        item.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Notifications */}
                <Card className="border-border/50 shadow-sm rounded-4xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                            </div>
                            Pending Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl bg-orange-50/50 p-4 border border-orange-100/50 hover:bg-orange-50 transition-colors">
                            <h4 className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" /> Attendance Missing
                            </h4>
                            <p className="text-xs text-orange-600/80 mt-1">
                                Mark attendance for yesterday's "Database Systems" class.
                            </p>
                            <Button size="sm" variant="ghost" className="mt-2 h-7 px-0 text-orange-700 hover:text-orange-900 hover:bg-transparent p-0 flex items-center gap-1 group">
                                Fix now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        <div className="rounded-xl bg-indigo-50/50 p-4 border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                            <h4 className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Marks Entry Open
                            </h4>
                            <p className="text-xs text-indigo-600/80 mt-1">
                                Midterm marks submission portal closes in 3 days.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
