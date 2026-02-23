"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StudentSidebar } from "@/components/student/sidebar";

export function StudentMobileHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-transparent bg-primary px-4 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <span className="text-lg">S</span>
                </div>
                <span className="text-white">Student Portal</span>
            </div>

            <Sheet>
                <SheetTrigger>
                    <Menu className="h-6 w-6 text-white" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r-0 bg-primary text-white">
                    <div className="h-full">
                        <StudentSidebar mobile />
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
