"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    CreditCard,
    User,
    LogOut,
    FileText,
    MessageSquare
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Courses", href: "/student/courses", icon: BookOpen },
    { name: "Timetable", href: "/student/timetable", icon: Calendar },
    { name: "Fee Portal", href: "/student/finance", icon: CreditCard },
    { name: "My Profile", href: "/student/profile", icon: User },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Notices", href: "/notices", icon: FileText },
];

interface StudentSidebarProps {
    mobile?: boolean;
}

export function StudentSidebar({ mobile = false }: StudentSidebarProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className={cn(
            "flex min-h-screen flex-col border-r border-transparent bg-primary text-primary-foreground",
            mobile ? "w-full border-none" : "hidden w-64 lg:flex"
        )}>
            <div className="flex h-16 items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                        <span className="text-lg">S</span>
                    </div>
                    <span className="text-white">Student Portal</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-white text-primary shadow-lg shadow-black/5"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-white/70")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-white/10 pt-4">
                    <button
                        onClick={() => signOut("/login")}
                        className="group flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-100 transition-colors"
                    >
                        <LogOut className="h-4 w-4 group-hover:text-red-100" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
