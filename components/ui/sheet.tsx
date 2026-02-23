"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

function Sheet({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    );
}

function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetTrigger must be used within Sheet");

    return (
        <div onClick={() => context.setOpen(true)} className="cursor-pointer">
            {children}
        </div>
    );
}

function SheetContent({ children, side = "left", className }: { children: React.ReactNode; side?: "left" | "right"; className?: string }) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetContent must be used within Sheet");

    if (!context.open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => context.setOpen(false)}
            />

            {/* Panel */}
            <div className={cn(
                "relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out",
                side === "left" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right",
                className
            )}>
                <button
                    onClick={() => context.setOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    );
}

export { Sheet, SheetTrigger, SheetContent };
