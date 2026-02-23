import { Input } from "@/components/ui/input";

interface Student {
    uid: string;
    profile: {
        name: string;
        class?: string;
        department?: string;
        admissionNo: string;
    };
}

interface MarksTableProps {
    students: Student[];
    marks: Record<string, string>;
    maxMarks: string;
    handleMarkChange: (studentId: string, value: string) => void;
}

export function MarksTable({ students, marks, maxMarks, handleMarkChange }: MarksTableProps) {
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
                        <th className="px-6 py-4 font-medium text-right w-48">Marks Obtained</th>
                        <th className="px-6 py-4 font-medium text-right w-32">Percentage</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {students.map((student) => {
                        const mark = marks[student.uid] || "";
                        const percentage = mark && maxMarks ? ((parseFloat(mark) / parseFloat(maxMarks)) * 100).toFixed(1) + "%" : "-";

                        return (
                            <tr key={student.uid} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    <div className="flex flex-col">
                                        <span>{student.profile.name}</span>
                                        <span className="text-xs text-muted-foreground font-normal">{student.profile.admissionNo}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Input
                                        value={mark}
                                        onChange={(e) => handleMarkChange(student.uid, e.target.value)}
                                        className="w-24 ml-auto text-right bg-white dark:bg-zinc-900 rounded-lg border-zinc-200"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                                    {percentage}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
