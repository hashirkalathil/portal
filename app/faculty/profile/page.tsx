"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, User, Mail, Shield, Building } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FacultyProfile {
    name: string;
    email: string;
    role: string;
    department?: string; // If faculty belongs to a department
    designation?: string;
}

export default function FacultyProfilePage() {
    const { user, role } = useAuth();
    const [profile, setProfile] = useState<FacultyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data().profile as FacultyProfile);
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
                <CardHeader className="bg-[#165A3A]/10 pb-8 pt-8">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center ring-4 ring-white overflow-hidden">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} />
                                <AvatarFallback className="bg-[#165A3A] text-white text-2xl">
                                    {profile?.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{profile?.name || user?.displayName || "Faculty Name"}</h2>
                            <p className="text-[#165A3A] font-medium mt-1 uppercase tracking-wide text-xs">
                                {profile?.designation || role?.toUpperCase() || "FACULTY MEMBER"}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Personal Details</h3>
                        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                            <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <div className="flex items-center gap-3 text-foreground font-semibold text-lg max-w-full overflow-hidden">
                                    <Mail className="h-5 w-5 text-[#165A3A] shrink-0" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                            </div>

                            <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</label>
                                <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                                    <Shield className="h-5 w-5 text-[#165A3A]" />
                                    {role?.toUpperCase()}
                                </div>
                            </div>

                            <div className="group space-y-2 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</label>
                                <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                                    <Building className="h-5 w-5 text-[#165A3A]" />
                                    {profile?.department || "General Faculty"}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
