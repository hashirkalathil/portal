"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminSetupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create Firestore User Doc
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                role: "admin", // creating an admin
                createdAt: new Date().toISOString(),
                profile: {
                    name: "Super Admin",
                    department_id: "ADMIN"
                }
            });

            setMsg("Admin created successfully! Redirecting...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            console.error(err);
            setMsg(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-4 text-xl text-gray-800 font-bold">First Time Admin Setup</h1>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-800 font-medium">Email (for Admin)</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md text-gray-800 border border-gray-300 p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@sabeel.edu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-800 font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md text-gray-800 border border-gray-300 p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="StrongPassword123"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-black px-4 py-2 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Create Admin"}
                    </button>
                    {msg && <p className="text-center text-sm text-red-500">{msg}</p>}
                </form>
            </div>
        </div>
    );
}
