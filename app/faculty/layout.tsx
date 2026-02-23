"use client";

import { FacultySidebar } from "@/components/faculty/sidebar";
import { FacultyMobileHeader } from "@/components/faculty/mobile-header";
import { usePathname } from "next/navigation";

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/faculty/login";

    if (isLoginPage) {
        return <div className="flex min-h-screen bg-[#F5F6F8]">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#F5F6F8]">
            <FacultySidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <FacultyMobileHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
