import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { StatusButton } from "@/components/faculty/status-button";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

interface Student {
    uid: string;
    profile: {
        name: string;
        class?: string;
        department?: string;
        admissionNo: string;
    };
}

interface AttendanceTableProps {
    students: Student[];
    attendance: Record<string, AttendanceStatus>;
    handleStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export function AttendanceTable({ students, attendance, handleStatusChange }: AttendanceTableProps) {
    if (students.length === 0) {
        return (
            <div className="py-16 text-center text-muted-foreground">
                No students found for this class.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                    <tr>
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {students.map((student) => (
                        <tr key={student.uid} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground">
                                <div className="flex flex-col">
                                    <span>{student.profile.name}</span>
                                    <span className="text-xs text-muted-foreground font-normal">{student.profile.admissionNo}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <StatusButton
                                        active={attendance[student.uid] === "Present"}
                                        onClick={() => handleStatusChange(student.uid, "Present")}
                                        variant="present"
                                        icon={CheckCircle2}
                                        label="Present"
                                    />
                                    <StatusButton
                                        active={attendance[student.uid] === "Absent"}
                                        onClick={() => handleStatusChange(student.uid, "Absent")}
                                        variant="absent"
                                        icon={XCircle}
                                        label="Absent"
                                    />
                                    <StatusButton
                                        active={attendance[student.uid] === "Late"}
                                        onClick={() => handleStatusChange(student.uid, "Late")}
                                        variant="late"
                                        icon={Clock}
                                        label="Late"
                                    />
                                    <StatusButton
                                        active={attendance[student.uid] === "Excused"}
                                        onClick={() => handleStatusChange(student.uid, "Excused")}
                                        variant="excused"
                                        icon={AlertCircle}
                                        label="Excused"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
