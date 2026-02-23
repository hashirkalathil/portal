"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, BookOpen, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
    id: string;
    code: string;
    name: string;
    department: string;
    facultyName?: string;
    description?: string;
}

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch only courses the student is enrolled in.
        // For MVP, we'll fetch all courses to demonstrate the UI.
        const fetchCourses = async () => {
            try {
                const q = query(collection(db, "courses"));
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
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    My Courses
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Access your course materials, grades, and attendance records.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground bg-white rounded-[2rem] shadow-sm border border-border/50">
                    No courses found.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-[1.5rem] overflow-hidden">
                            <CardHeader className="bg-muted/10 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        {course.code}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{course.department}</span>
                                </div>
                                <CardTitle className="mt-4 text-xl">{course.name}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {course.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pt-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                                        <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span>{course.facultyName || "TBA"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span>Mon, Wed 10:00 AM</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 pb-6 px-6">
                                <Button className="w-full rounded-full shadow-lg shadow-primary/20">
                                    View Course
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
