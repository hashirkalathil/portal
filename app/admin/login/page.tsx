"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Lock, User, ArrowRight, Shield, ArrowLeft, ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signOut } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userRole = await signIn(id, password);
            if (userRole === "admin" || userRole === "superadmin") {
                router.push("/admin");
            } else {
                await signOut();
                setError("Unauthorized: Please use the correct login portal.");
            }
        } catch (err: any) {
            console.error(err);
            setError("Invalid credentials. Please double check your Email/ID and Password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center bg-[#F5F6F8]">
            <div className="flex w-full max-w-6xl overflow-hidden bg-white shadow-2xl lg:grid lg:grid-cols-2 rounded-3xl">                {/* Left Side: Form */}
                <div className="flex flex-col justify-center p-8 lg:p-24 relative z-10 bg-white order-2 lg:order-1">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="absolute top-6 left-6 flex items-center gap-2 rounded-full p-4 text-sm bg-muted hover:bg-muted/70 transition"                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                            <Shield className="h-7 w-7" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
                        <p className="mt-2 text-muted-foreground text-lg">
                            Enter your administrator credentials to access the system.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2.5">
                            <label className="text-sm font-semibold leading-none text-foreground">Admin ID or Email</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    className="pl-12 h-12 bg-muted/30 border-input focus-visible:ring-primary rounded-xl transition-all duration-200"
                                    placeholder="e.g. admin@sabeel.edu"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold leading-none text-foreground">Password</label>
                                <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    className="pl-12 h-12 bg-muted/30 border-input focus-visible:ring-primary rounded-xl transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                {error}
                            </div>
                        )}

                        <Button className="w-full h-12 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300" size="lg" isLoading={loading}>
                            Sign In to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-10 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Sabeel Institute. Secure Access.
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <div className="hidden order-1 lg:order-2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-24 text-primary-foreground relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="h-16 w-16 mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight tracking-tight">
                            "Securing the future of education."
                        </h2>
                        <p className="mt-6 text-primary-foreground/80 text-xl leading-relaxed max-w-md">
                            Oversee operations, manage users, and maintain the integrity of the institution's data.
                        </p>
                    </div>

                    {/* Abstract circles */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-[100px] mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[400px] w-[400px] rounded-full bg-white/10 blur-[80px] mix-blend-overlay" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>
            </div>
        </div>
    );
}
