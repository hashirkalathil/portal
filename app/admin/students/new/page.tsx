"use client";

import { useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Secondary App trick to create user without logging out admin
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

export default function NewStudentPage() {
    const [name, setName] = useState("");
    const [admissionNo, setAdmissionNo] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Construct an email if one isn't provided (or just use the pattern)
            // For this system, we'll force the email pattern to be consistent with login:
            // If we want them to login with Admission No, we should create the user with `admissionNo@portal.local`
            // OR we just use their real email if provided. 
            // Let's use the `admissionNo@portal.local` convention for students to ensure ID-based login works seamlessly without real emails.

            const email = `${admissionNo}@portal.local`;

            const secondaryApp = getSecondaryApp();
            const secondaryAuth = getAuth(secondaryApp);

            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                uid,
                email, // Store the generated email
                role: "student",
                createdAt: new Date().toISOString(),
                profile: {
                    name,
                    admissionNo,
                    class: studentClass
                }
            });

            router.push("/admin/students");
        } catch (error: any) {
            console.error("Error creating student:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Student</CardTitle>
                    <CardDescription>
                        Register a new student. They will use their Admission Number to log in.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreate}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Admission Number
                                </label>
                                <Input
                                    required
                                    value={admissionNo}
                                    onChange={(e) => setAdmissionNo(e.target.value)}
                                    placeholder="e.g. 2024001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Class
                                </label>
                                <select
                                    required
                                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                >
                                    <option value="">Select Class</option>
                                    <option value="Class 1">Class 1</option>
                                    <option value="Class 2">Class 2</option>
                                    <option value="Class 3">Class 3</option>
                                    <option value="Class 4">Class 4</option>
                                    <option value="Class 5">Class 5</option>
                                    <option value="Class 6">Class 6</option>
                                    <option value="Class 7">Class 7</option>
                                    <option value="Class 8">Class 8</option>
                                    <option value="Class 9">Class 9</option>
                                    <option value="Class 10">Class 10</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Full Name
                            </label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Student"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Initial Password
                            </label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                            />
                            <p className="text-[10px] text-zinc-500">
                                Standard convention: 000 + Admission No (e.g. 0002024001)
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Create Student Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
