"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/login");
            return;
        }

        if (role === "admin" || role === "superadmin") {
            router.push("/admin");
        } else if (role === "faculty") {
            router.push("/faculty");
        } else if (role === "student") {
            router.push("/student");
        } else {
            // Fallback or setup needed
            console.warn("User has no role assigned");
            router.push("/login?error=no_role");
        }
    }, [user, role, loading, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-sm text-gray-500">Redirecting...</span>
        </div>
    );
}
