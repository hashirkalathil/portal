"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Search, Book, User } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Course {
    id: string;
    code: string;
    name: string;
    facultyId: string;
    facultyName?: string; // Fetched separately
    department: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                if (!res.ok) throw new Error("Failed to fetch courses");
                const data: Course[] = await res.json();

                // Fetch faculty names
                // We'll iterate and fetch details. 
                // Enhanced approach: Fetch all faculty once and map? Or fetch individually?
                // Given we have an API for all faculty, fetching all might be better if N is large.
                // But let's stick to individual fetching via API to match previous logic logic first, 
                // OR better: fetch all faculty map.

                // Let's try fetching all faculty first to avoid N+1 API calls if possible.
                // Actually, let's just do the loop for now to be safe with the new API we just made.

                const coursesWithFaculty = await Promise.all(data.map(async (course) => {
                    let facultyName = "Unassigned";
                    if (course.facultyId) {
                        try {
                            const facRes = await fetch(`/api/admin/faculty/${course.facultyId}`);
                            if (facRes.ok) {
                                const facData = await facRes.json();
                                facultyName = facData.profile?.name || "Unknown";
                            }
                        } catch (e) {
                            console.error("Error fetching faculty for course", course.code);
                        }
                    }
                    return { ...course, facultyName };
                }));

                setCourses(coursesWithFaculty);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Course Management
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Create courses and assign faculty members.
                    </p>
                </div>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                    <Link href="/admin/courses/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Course
                    </Link>
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">All Courses</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-10 bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                placeholder="Search by code or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            No courses found. Create one to get started.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Code</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Course Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Class</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Assigned Faculty</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-4 align-middle font-mono text-xs text-muted-foreground">{course.code}</td>
                                            <td className="p-4 align-middle font-semibold text-foreground">{course.name}</td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full bg-muted/40 px-3 py-1 text-xs font-medium text-foreground border border-border">
                                                    {course.department}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-foreground">{course.facultyName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/5">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
