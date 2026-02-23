"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Search, Mail, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
    uid: string;
    email: string;
    profile: {
        name: string;
        class?: string;
        department?: string;
        admissionNo: string;
    };
}

export default function FacultyStudentsPage() {
    const { user, profile } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMyStudents = async () => {
            if (!user) {
                // If context is still loading, wait.
                return;
            }

            // If profile is still null but we have user, it might be loading profile
            // But useAuth loading should handle that. 
            // If useAuth loading is false and profile is null, then user has no profile or just basic auth.

            try {
                if (!profile?.classTeacherOf) {
                    setStudents([]);
                    setLoading(false);
                    return;
                }

                const assignedClass = profile.classTeacherOf;
                setLoading(true);

                // Fetch students via API
                const res = await fetch(`/api/students?class=${assignedClass}`);
                if (!res.ok) throw new Error("Failed to fetch students");

                const matchedStudents = await res.json();
                setStudents(matchedStudents as Student[]);

            } catch (error) {
                console.error("Error fetching students:", error);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        if (user !== null && profile !== undefined) {
            fetchMyStudents();
        } else if (user === null && loading === false) {
            // Not logged in
            setLoading(false);
        }

    }, [user, profile]);

    const filteredStudents = students.filter(
        (s) =>
            s.profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.profile.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Students</h1>
                    <p className="mt-2 text-muted-foreground">
                        List of students enrolled in your classes.
                    </p>
                </div>
            </div>

            <Card className="border-border/50 shadow-sm rounded-[2rem]">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Enrolled Students</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-10 bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredStudents.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            {profile?.classTeacherOf
                                ? "No students found in your class."
                                : "You are not assigned as a Class Teacher to any class."}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredStudents.map((student) => (
                                <div key={student.uid} className="flex items-start gap-4 p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.profile.name}`} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {student.profile.name ? student.profile.name.substring(0, 2).toUpperCase() : "ST"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-foreground truncate">{student.profile.name}</h4>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                            <GraduationCap className="h-3 w-3" />
                                            <span>{student.profile.admissionNo}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{student.email}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                {student.profile.class || student.profile.department}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
