"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FacultySidebar } from "@/components/faculty/sidebar";
import { useState } from "react";

export function FacultyMobileHeader() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center justify-between border-b border-white/10 bg-[#165A3A] px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-[#165A3A]">
                    <span className="text-lg">F</span>
                </div>
                <span>Sabeel</span>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <button className="rounded-md p-2 text-white hover:bg-white/10">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-none w-64">
                    <FacultySidebar mobile />
                </SheetContent>
            </Sheet>
        </div>
    );
}
