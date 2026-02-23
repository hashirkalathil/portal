"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/sidebar";

export function MobileHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <span className="text-lg">S</span>
                </div>
                <span className="text-foreground">Sabeel</span>
            </div>

            <Sheet>
                <SheetTrigger>
                    <Menu className="h-6 w-6 text-zinc-600" />
                </SheetTrigger>
                <SheetContent side="left">
                    {/* Reuse standard sidebar but ensure it fits without the fixed positioning constraints of the desktop version if needed. 
              Actually, the AdminSidebar component has `hidden lg:flex`. We need to make sure we can render it here.
          */}
                    <div className="h-full">
                        <AdminSidebar mobile />
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
