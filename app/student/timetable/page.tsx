"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schedule = [
    {
        day: "Monday", slots: [
            { time: "09:00 - 10:30", course: "CS101", room: "Lab A", color: "bg-blue-100 text-blue-700" },
            { time: "11:00 - 12:30", course: "CS201", room: "Room 304", color: "bg-purple-100 text-purple-700" }
        ]
    },
    {
        day: "Tuesday", slots: [
            { time: "10:00 - 11:30", course: "ENG101", room: "Hall B", color: "bg-orange-100 text-orange-700" }
        ]
    },
    {
        day: "Wednesday", slots: [
            { time: "09:00 - 10:30", course: "CS101", room: "Lab A", color: "bg-blue-100 text-blue-700" },
            { time: "14:00 - 15:30", course: "CS305", room: "Room 202", color: "bg-green-100 text-green-700" }
        ]
    },
    { day: "Thursday", slots: [] },
    {
        day: "Friday", slots: [
            { time: "09:00 - 11:00", course: "CS201 Lab", room: "Lab B", color: "bg-purple-100 text-purple-700" }
        ]
    },
];

export default function TimetablePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Weekly Timetable
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Spring 2026 Semester Schedule.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-5">
                {schedule.map((day) => (
                    <Card key={day.day} className="h-full border-border/50 shadow-sm rounded-[1.5rem] overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="pb-3 text-center border-b border-border/50 bg-muted/10">
                            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 p-4">
                            {day.slots.length > 0 ? (
                                day.slots.map((slot, i) => (
                                    <div key={i} className={`rounded-xl p-3 text-xs shadow-sm ${slot.color} transition-transform hover:scale-[1.02]`}>
                                        <div className="font-bold text-sm mb-1">{slot.course}</div>
                                        <div className="font-medium opacity-90">{slot.time}</div>
                                        <div className="opacity-75 mt-1 flex items-center gap-1">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                            {slot.room}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-xs text-muted-foreground py-8 border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
                                    No Classes
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
