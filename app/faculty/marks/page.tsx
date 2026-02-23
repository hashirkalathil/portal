"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, where, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Save, FileBarChart, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarksTable } from "@/components/faculty/marks-table";

interface Student {
    uid: string;
    profile: {
        name: string;
        class?: string;
        department?: string;
        admissionNo: string;
    };
}

interface Course {
    id: string;
    name: string;
    code: string;
    department: string;
    facultyId: string;
}

export default function FacultyMarksPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [examName, setExamName] = useState<string>("Midterm");
    const [maxMarks, setMaxMarks] = useState<string>("100");
    const [students, setStudents] = useState<Student[]>([]);
    const [marks, setMarks] = useState<Record<string, string>>({}); // studentId -> marks
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    const examTypes = ["Midterm", "Final", "Assignment 1", "Assignment 2", "Quiz 1", "Quiz 2", "Project"];

    // 1. Fetch Courses
    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, "courses"));
                const querySnapshot = await getDocs(q);
                const data: Course[] = [];
                querySnapshot.forEach((doc) => {
                    const courseData = { id: doc.id, ...doc.data() } as Course;
                    if (courseData.facultyId === user.uid) {
                        data.push(courseData);
                    }
                });
                setCourses(data);
                if (data.length > 0) {
                    setSelectedCourseId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user]);

    // 2. Fetch Students & Existing Marks
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedCourseId || !examName) return;
            setFetchingStudents(true);
            try {
                const selectedCourse = courses.find(c => c.id === selectedCourseId);
                if (!selectedCourse) return;

                const targetClass = selectedCourse.department;

                // Fetch Students
                const studentsQ = query(
                    collection(db, "users"),
                    where("role", "==", "student")
                );
                const studentsSnapshot = await getDocs(studentsQ);
                const classStudents: Student[] = [];
                studentsSnapshot.docs.forEach(doc => {
                    const s = doc.data() as Student;
                    const sClass = s.profile.class || s.profile.department;
                    if (sClass === targetClass) {
                        classStudents.push({ ...s, uid: doc.id });
                    }
                });

                classStudents.sort((a, b) => a.profile.name.localeCompare(b.profile.name));
                setStudents(classStudents);

                // Fetch Existing Marks
                // ID scheme: marks_courseId_examName (sanitized)
                const sanitizedExam = examName.replace(/\s+/g, '_').toLowerCase();
                const recordId = `marks_${selectedCourseId}_${sanitizedExam}`;
                const docRef = doc(db, "marks", recordId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setMarks(data.records || {});
                    if (data.maxMarks) setMaxMarks(data.maxMarks);
                } else {
                    setMarks({});
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setFetchingStudents(false);
            }
        };

        if (courses.length > 0) {
            fetchData();
        }
    }, [selectedCourseId, examName, courses]);

    const handleMarkChange = (studentId: string, value: string) => {
        // Allow only numbers
        if (!/^\d*\.?\d*$/.test(value)) return;
        setMarks(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSave = async () => {
        if (!selectedCourseId || !examName) return;
        setSaving(true);
        try {
            const sanitizedExam = examName.replace(/\s+/g, '_').toLowerCase();
            const recordId = `marks_${selectedCourseId}_${sanitizedExam}`;
            const selectedCourse = courses.find(c => c.id === selectedCourseId);

            await setDoc(doc(db, "marks", recordId), {
                courseId: selectedCourseId,
                courseName: selectedCourse?.name,
                courseCode: selectedCourse?.code,
                examName,
                maxMarks,
                facultyId: user?.uid,
                records: marks,
                updatedAt: new Date().toISOString()
            });

            console.log("Marks saved!");
            alert("Marks saved successfully!");
        } catch (error) {
            console.error("Error saving marks:", error);
            alert("Failed to save marks.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Marks Ledger</h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter and manage student marks for assessments.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || students.length === 0}
                    className="rounded-full shadow-lg shadow-primary/20 bg-[#165A3A] hover:bg-[#165A3A]/90 text-white"
                >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Marks
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm rounded-4xl overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/50 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Course</label>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            <option value="" disabled>Select course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Assessment</label>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        >
                            <option value="" disabled>Select exam</option>
                            {examTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-32 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Max Marks</label>
                        <Input
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    {fetchingStudents ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            No students found for this class.
                        </div>
                    ) : (
                        <MarksTable
                            students={students}
                            marks={marks}
                            maxMarks={maxMarks}
                            handleMarkChange={handleMarkChange}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
