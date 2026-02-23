"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
    id: string;
    code: string;
    name: string;
    facultyId: string;
    department: string; // This is actually the Class
}

export default function FacultyCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;
            try {
                // Query courses where facultyId matches current user
                const q = query(
                    collection(db, "courses")
                    // In a real app we would filter by facultyId, but for now we might not have it set correctly in all docs
                    // So we will filter in client side or if we are sure, we use where clause:
                    , where("facultyId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const data: Course[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Course);
                });
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Courses</h1>
                <p className="mt-2 text-muted-foreground">
                    View and manage the courses you are teaching this semester.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <BookOpen className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground">No courses assigned</h3>
                    <p className="mt-2 text-muted-foreground max-w-sm">
                        You haven't been assigned any courses yet. Please contact the administrator if this is a mistake.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="group overflow-hidden rounded-[2rem] border-border/50 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/20">
                            <div className="h-2 bg-gradient-to-r from-primary to-[#56A981]" />
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        {course.code}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        {course.department}
                                    </span>
                                </div>
                                <CardTitle className="text-xl line-clamp-2 min-h-[3.5rem] flex items-center">
                                    {course.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>4 Credit Hours</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>32 Students</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-lg transition-all" asChild>
                                    <Link href={`/faculty/courses/${course.id}`}>
                                        Manage Course <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
