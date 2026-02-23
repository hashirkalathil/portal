"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Search, Mail, Building, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Faculty {
    uid: string;
    email: string;
    profile: {
        name: string;
        department?: string; // Legacy
        staffId: string;
        classTeacherOf?: string | null;
    };
}

export default function FacultyPage() {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit/Class Teacher Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>("none");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await fetch("/api/admin/faculty");
                if (!res.ok) throw new Error("Failed to fetch faculty");
                const data = await res.json();

                // The API returns the raw user document. We need to ensure it matches our interface.
                // In API route we returned doc.data().
                setFaculty(data);
            } catch (error) {
                console.error("Error fetching faculty:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, []);

    const handleEdit = (f: Faculty) => {
        setSelectedFaculty(f);
        setSelectedClass(f.profile.classTeacherOf || "none");
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!selectedFaculty) return;
        setUpdating(true);
        try {
            const newClassTeacherOf = selectedClass === "none" ? null : selectedClass;

            const res = await fetch(`/api/admin/faculty/${selectedFaculty.uid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    classTeacherOf: newClassTeacherOf
                }),
            });

            if (!res.ok) throw new Error("Failed to update faculty");

            // Update local state
            setFaculty(prev => prev.map(f =>
                f.uid === selectedFaculty.uid
                    ? { ...f, profile: { ...f.profile, classTeacherOf: newClassTeacherOf } }
                    : f
            ));

            setIsDialogOpen(false);
        } catch (error: any) {
            console.error("Error updating faculty:", error);
            alert("Error: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const filteredFaculty = faculty.filter(
        (f) =>
            f.profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.profile.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Faculty Directory
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your teaching staff and their department assignments.
                    </p>
                </div>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                    <Link href="/admin/faculty/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Faculty
                    </Link>
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">All Faculty Members</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-10 bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                placeholder="Search by name or class..."
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
                    ) : filteredFaculty.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            No faculty members found.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                            Name
                                        </th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                            Class
                                        </th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                            Email
                                        </th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredFaculty.map((person) => (
                                        <tr key={person.uid} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                        {person.profile.name?.charAt(0) || "F"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{person.profile.name}</span>
                                                        <span className="text-xs text-muted-foreground">{person.profile.staffId}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col gap-1">
                                                    {person.profile.classTeacherOf && (
                                                        <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary w-fit">
                                                            <GraduationCap className="h-3 w-3" />
                                                            CT: {person.profile.classTeacherOf}
                                                        </div>
                                                    )}
                                                    {person.profile.department && (
                                                        <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground w-fit">
                                                            {person.profile.department}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {person.email}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-primary hover:bg-primary/5"
                                                    onClick={() => handleEdit(person)}
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Faculty</DialogTitle>
                        <DialogDescription>
                            Assign a class to this faculty member as a Class Teacher.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="class-teacher" className="text-sm font-medium">
                                Class Teacher Of
                            </label>
                            <select
                                id="class-teacher"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="none">Not a Class Teacher</option>
                                <option value="CS">Computer Science</option>
                                <option value="ENG">Engineering</option>
                                <option value="SCI">Science</option>
                                <option value="ARTS">Arts</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={updating}>
                            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
