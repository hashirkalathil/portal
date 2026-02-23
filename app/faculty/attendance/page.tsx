"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, where, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Calendar as CalendarIcon, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AttendanceTable } from "@/components/faculty/attendance-table";

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

type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export default function FacultyAttendancePage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    // 1. Fetch Courses
    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, "courses"));
                // In real app, filter by facultyId: where("facultyId", "==", user.uid)
                // Filtering client side for now as per previous pages logic
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

    // 2. Fetch Students & Existing Attendance when Course or Date changes
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedCourseId || !date) return;
            setFetchingStudents(true);
            try {
                const selectedCourse = courses.find(c => c.id === selectedCourseId);
                if (!selectedCourse) return;

                const targetClass = selectedCourse.department;

                // Fetch Students in this class
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

                // Sort by name
                classStudents.sort((a, b) => a.profile.name.localeCompare(b.profile.name));
                setStudents(classStudents);

                // Initialize attendance with "Present" or fetch existing
                const initialAttendance: Record<string, AttendanceStatus> = {};

                // Check if attendance record exists
                const recordId = `attendance_${selectedCourseId}_${date}`;
                const docRef = doc(db, "attendance", recordId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setAttendance(data.records || {});
                } else {
                    // Default to Present
                    classStudents.forEach(s => {
                        initialAttendance[s.uid] = "Present";
                    });
                    setAttendance(initialAttendance);
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
    }, [selectedCourseId, date, courses]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSave = async () => {
        if (!selectedCourseId || !date) return;
        setSaving(true);
        try {
            const recordId = `attendance_${selectedCourseId}_${date}`;
            const selectedCourse = courses.find(c => c.id === selectedCourseId);

            await setDoc(doc(db, "attendance", recordId), {
                courseId: selectedCourseId,
                courseName: selectedCourse?.name,
                courseCode: selectedCourse?.code,
                date,
                facultyId: user?.uid,
                records: attendance,
                updatedAt: new Date().toISOString()
            });

            // Show toast (simulated with alert for now as Sonner might not be setup or I need to import it)
            // Using window.alert for simplicity if toast isn't available, but I imported `toast` from sonner earlier. 
            // If sonner isn't installed/setup, I'd revert to alert. 
            // I'll assume sonner is available or just fallback to console.
            console.log("Attendance saved!");
            alert("Attendance saved successfully!");

        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance.");
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance</h1>
                    <p className="mt-2 text-muted-foreground">
                        Mark daily attendance for your classes.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || students.length === 0}
                    className="rounded-full shadow-lg shadow-primary/20 bg-[#165A3A] hover:bg-[#165A3A]/90 text-white"
                >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Attendance
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm rounded-4xl overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/50 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Select Course</label>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            <option value="" disabled>Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-64 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Select Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
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
                        <AttendanceTable
                            students={students}
                            attendance={attendance}
                            handleStatusChange={handleStatusChange}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
