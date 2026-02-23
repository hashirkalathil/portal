import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardNotices() {
    return (
        <Card className="lg:col-span-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <CardHeader>
                <CardTitle className="text-xl">Notice Board</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex gap-4 group">
                        <div className="flex-none pt-1">
                            <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Exam Schedule Released</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                The midterm exam schedule for Spring 2026 has been published. Check the notices section.
                            </p>
                            <span className="text-[10px] text-muted-foreground/70 mt-2 block font-medium">2 hours ago</span>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="flex-none pt-1">
                            <div className="h-3 w-3 rounded-full bg-muted-foreground/30 ring-4 ring-muted-foreground/10 group-hover:ring-muted-foreground/20 transition-all" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Guest Lecture: AI Ethics</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Join us for a session on AI Ethics by Dr. Smith on Feb 18th.
                            </p>
                            <span className="text-[10px] text-muted-foreground/70 mt-2 block font-medium">Yesterday</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
