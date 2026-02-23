import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, BookOpen, AlertCircle } from "lucide-react";

export function DashboardStats() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <Card className="hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                            <h3 className="text-2xl font-bold text-foreground">3.8</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                            <h3 className="text-2xl font-bold text-foreground">92%</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Courses</p>
                            <h3 className="text-2xl font-bold text-foreground">5</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Due Fees</p>
                            <h3 className="text-2xl font-bold text-foreground">$0</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
