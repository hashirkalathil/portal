"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Mail, Hash, Building, Loader2 } from "lucide-react";

interface StudentProfile {
    name: string;
    email: string;
    role: string;
    admissionNo?: string;
    class?: string;
    department?: string; // Legacy
}

export default function ProfilePage() {
    const { user, role } = useAuth();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data().profile as StudentProfile);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    My Profile
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your personal information and account settings.
                </p>
            </div>

            <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/10 pb-8 pt-8">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center text-primary ring-4 ring-white">
                            <User className="h-12 w-12" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{profile?.name || user?.displayName || "Student Name"}</h2>
                            <p className="text-muted-foreground font-medium mt-1">{role ? role.toUpperCase() : "STUDENT"}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Academic Details</h3>
                        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                            <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student ID / Admission No</label>
                                <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                                    <Hash className="h-5 w-5 text-primary" />
                                    {profile?.admissionNo || "Not Assigned"}
                                </div>
                            </div>

                            <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class</label>
                                <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                                    <Building className="h-5 w-5 text-primary" />
                                    {profile?.class || profile?.department || "General"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Contact Information</h3>
                        <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                                <Mail className="h-5 w-5 text-primary" />
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
