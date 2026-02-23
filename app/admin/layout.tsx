"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { MobileHeader } from "@/components/admin/mobile-header";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return <>
            <div className="flex min-h-screen items-center justify-center bg-background">
                {children}
            </div>
        </>;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <MobileHeader />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
