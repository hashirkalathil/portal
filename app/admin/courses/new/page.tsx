"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Faculty {
    uid: string;
    profile: {
        name: string;
    };
}

export default function NewCoursePage() {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [facultyId, setFacultyId] = useState("");
    const [description, setDescription] = useState("");
    const [facultyList, setFacultyList] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch faculty for the dropdown
    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await fetch("/api/admin/faculty");
                if (res.ok) {
                    const data = await res.json();
                    setFacultyList(data);
                }
            } catch (error) {
                console.error("Error fetching faculty:", error);
            }
        };
        fetchFaculty();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    name,
                    department,
                    facultyId,
                    description,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create course");
            }

            router.push("/admin/courses");
        } catch (error: any) {
            console.error("Error creating course:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Course</CardTitle>
                    <CardDescription>
                        Add a new subject to the curriculum and assign a faculty member.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreate}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Course Code
                                </label>
                                <Input
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. CS101"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Class
                                </label>
                                <select
                                    required
                                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="">Select Class</option>
                                    <option value="CS">Computer Science</option>
                                    <option value="ENG">Engineering</option>
                                    <option value="SCI">Science</option>
                                    <option value="ARTS">Arts</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Course Name
                            </label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Introduction to Programming"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Description (Optional)
                            </label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief overview of the course..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Assign Faculty
                            </label>
                            <select
                                className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {facultyList.map(f => (
                                    <option key={f.uid} value={f.uid}>{f.profile.name}</option>
                                ))}
                            </select>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Create Course
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
