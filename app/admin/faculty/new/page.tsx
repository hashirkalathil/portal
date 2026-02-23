"use client";

import { useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Secondary App trick
function getSecondaryApp() {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    return getApps().length > 1 ? getApps().find(a => a.name === "Secondary") : initializeApp(config, "Secondary");
}

export default function NewFacultyPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [staffId, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const secondaryApp = getSecondaryApp();
            const secondaryAuth = getAuth(secondaryApp);

            // 1. Create User in Firebase Auth (Client Side)
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const uid = userCredential.user.uid;

            // 2. Create User Profile via API (Server Side DB Operation)
            const res = await fetch("/api/admin/faculty", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid,
                    email,
                    name,
                    staffId
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create faculty profile in database");
            }

            router.push("/admin/faculty");
        } catch (error: any) {
            console.error("Error creating faculty:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Faculty</CardTitle>
                    <CardDescription>
                        Create a new faculty account. They will be able to access the Faculty Portal.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreate}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Staff ID
                                </label>
                                <Input
                                    required
                                    value={staffId}
                                    onChange={(e) => setStaffId(e.target.value)}
                                    placeholder="e.g. FAC-001"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Full Name
                                </label>
                                <Input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Dr. John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john.doe@sabeel.edu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Initial Password
                                </label>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Create Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
