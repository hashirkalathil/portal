"use client";

import { Users, GraduationCap, BookOpen, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
    { name: "Total Students", value: "1,200", icon: GraduationCap, description: "+12% from last month" },
    { name: "Faculty Members", value: "85", icon: Users, description: "+2 new this week" },
    { name: "Active Courses", value: "42", icon: BookOpen, description: "Semester 1, 2026" },
    { name: "Pending Dues", value: "$12,450", icon: DollarSign, description: "Due by Feb 28" },
];

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboard() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || (role !== "admin" && role !== "superadmin")) {
                router.push("/admin/login");
            }
        }
    }, [user, role, loading, router]);

    if (loading || !user || (role !== "admin" && role !== "superadmin")) {
        return <div className="flex h-full min-h-[50vh] items-center justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                <p className="mt-2 text-muted-foreground">
                    Welcome back, Admin. Here is an overview of your institute's performance.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.name}
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <stat.icon className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-border/50">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">No recent activity to show</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-border/50">
                    <CardHeader>
                        <CardTitle>Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {["Create New Announcement", "Verify Student Enrollment", "Generate Financial Report"].map((action, i) => (
                                <button key={i} className="flex items-center justify-between rounded-xl bg-muted/30 p-4 text-sm font-medium text-foreground hover:bg-muted/60 hover:text-primary transition-all duration-200 group text-left">
                                    {action}
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
