"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Building,
    Calendar,
    FileText,
    Settings,
    LogOut,
    CreditCard,
    MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Faculty", href: "/admin/faculty", icon: Users },
    { name: "Students", href: "/admin/students", icon: GraduationCap },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Classes", href: "/admin/classes", icon: Building },
    { name: "Finance", href: "/admin/finance", icon: CreditCard },
    { name: "Messages", href: "/messages", icon: MessageSquare }, // Shared
    { name: "Notices", href: "/notices", icon: FileText },       // Shared
    { name: "Events", href: "/events", icon: Calendar },         // Shared
];

interface AdminSidebarProps {
    mobile?: boolean;
}

export function AdminSidebar({ mobile = false }: AdminSidebarProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className={cn(
            "flex min-h-screen flex-col border-r border-[#165A3A] bg-[#165A3A] text-white",
            mobile ? "w-full border-none" : "hidden w-64 lg:flex"
        )}>
            <div className="flex h-16 items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-[#165A3A]">
                        <span className="text-lg">S</span>
                    </div>
                    <span>Sabeel</span>
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
                                        ? "bg-white text-[#165A3A] shadow-md transform scale-[1.02]"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-[#165A3A]" : "text-white/70")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-white/10 pt-4">
                    <button
                        onClick={() => signOut("/admin/login")}
                        className="group flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-100 transition-colors"
                    >
                        <LogOut className="h-4 w-4 group-hover:text-red-200" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
