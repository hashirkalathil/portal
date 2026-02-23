"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Save, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Student {
    uid: string;
    profile: {
        name: string;
        admissionNo: string;
    };
}

export default function CreateFeePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<string>("");

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch students for search
    // Optimized: Ideally search server-side or limit results. For MVP, fetch all students (assuming < 1000).
    useEffect(() => {
        const fetchStudents = async () => {
            const q = query(collection(db, "users"), where("role", "==", "student"));
            const snapshot = await getDocs(q);
            const data: Student[] = [];
            snapshot.forEach(doc => data.push({ uid: doc.id, ...doc.data() } as Student));
            setStudents(data);
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s =>
        s.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.profile.admissionNo.includes(searchTerm)
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) {
            alert("Please select a student");
            return;
        }
        setLoading(true);

        try {
            await addDoc(collection(db, "dues"), {
                studentId: selectedStudent,
                title,
                amount: parseFloat(amount),
                dueDate,
                status: "pending", // pending, paid
                createdAt: new Date().toISOString()
            });

            router.push("/admin/finance");
        } catch (error: any) {
            console.error("Error creating fee:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Fee Challan</CardTitle>
                    <CardDescription>
                        Assign a fee or due to a student.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreate}>
                    <CardContent className="space-y-6">

                        {/* Student Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Select Student
                            </label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input
                                    placeholder="Search name or admission no..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 mb-2"
                                />
                            </div>

                            {searchTerm && (
                                <div className="max-h-40 overflow-y-auto rounded-md border border-zinc-200 bg-white p-2 shadow-sm">
                                    {filteredStudents.length === 0 ? (
                                        <div className="p-2 text-sm text-zinc-500">No students found.</div>
                                    ) : (
                                        filteredStudents.map(s => (
                                            <div
                                                key={s.uid}
                                                onClick={() => {
                                                    setSelectedStudent(s.uid);
                                                    setSearchTerm(`${s.profile.name} (${s.profile.admissionNo})`);
                                                }}
                                                className={`cursor-pointer rounded-sm p-2 text-sm hover:bg-zinc-100 ${selectedStudent === s.uid ? "bg-zinc-100 font-medium text-indigo-600" : ""}`}
                                            >
                                                {s.profile.name} <span className="text-zinc-500">({s.profile.admissionNo})</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {selectedStudent && !searchTerm.includes("(") && (
                                <div className="text-xs text-green-600 font-medium">Student Selected ✓</div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Fee Title
                                </label>
                                <Input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Spring 2026 Tuition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Amount ($)
                                </label>
                                <Input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Due Date
                            </label>
                            <Input
                                type="date"
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Generate Challan
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
