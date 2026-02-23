"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Search, Mail } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Student {
    uid: string;
    email: string;
    profile: {
        name: string;
        class?: string;
        department?: string; // Legacy support
        admissionNo: string;
    };
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/students");
                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(
        (s) =>
            s.profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.profile.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.profile.class || s.profile.department)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Student Directory
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage student records and admission details.
                    </p>
                </div>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                    <Link href="/admin/students/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                    </Link>
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">All Students</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-10 bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                placeholder="Search by name, class or admission no..."
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
                    ) : filteredStudents.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            No students found.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Admission No</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Class</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredStudents.map((person) => (
                                        <tr key={person.uid} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                        {person.profile.name?.charAt(0) || "S"}
                                                    </div>
                                                    <span className="font-semibold text-foreground">{person.profile.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle font-mono text-xs text-muted-foreground">{person.profile.admissionNo}</td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full bg-muted/40 px-3 py-1 text-xs font-medium text-foreground border border-border">
                                                    {person.profile.class || person.profile.department || "N/A"}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">{person.email}</td>
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
