import { StudentSidebar } from "@/components/student/sidebar";
import { StudentMobileHeader } from "@/components/student/mobile-header";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <StudentSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <StudentMobileHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
