import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardSchedule() {
    return (
        <Card className="lg:col-span-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <CardHeader>
                <CardTitle className="text-xl">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[
                        { time: "09:00 AM", course: "CS101: Intro to Programming", room: "Lab A", status: "Present" },
                        { time: "11:00 AM", course: "CS302: Data Structures", room: "Room 304", status: "Upcoming" },
                    ].map((item, i) => (
                        <div key={i} className="group flex items-center justify-between rounded-xl border border-transparent bg-muted/30 p-4 hover:bg-muted/60 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col items-center justify-center rounded-lg bg-white h-12 w-16 text-xs font-medium text-muted-foreground shadow-sm group-hover:text-primary transition-colors">
                                    {item.time.split(" ")[0]}
                                    <span className="text-[10px] text-muted-foreground/70">{item.time.split(" ")[1]}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.course}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {item.room}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                item.status === "Present" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {item.status}
                            </div>
                        </div>
                    ))}
                    {/* Empty state example with diagonal stripes */}
                    <div className="flex items-center justify-center rounded-xl bg-striped p-4 border border-dashed border-border h-20">
                        <span className="text-sm text-muted-foreground">No more classes today</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
