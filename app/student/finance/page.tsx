"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Due {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: "pending" | "paid" | "overdue";
}

export default function StudentFinancePage() {
    const { user } = useAuth();
    const [dues, setDues] = useState<Due[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDues = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "dues"),
                    where("studentId", "==", user.uid)
                    // orderBy("dueDate", "desc") // Requires index
                );
                const snapshot = await getDocs(q);
                const data: Due[] = [];
                snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Due));
                setDues(data);
            } catch (error) {
                console.error("Error fetching dues:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDues();
    }, [user]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Fee Portal
                </h1>
                <p className="mt-2 text-muted-foreground">
                    View your outstanding dues and payment history.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : dues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[2rem] shadow-sm border border-border/50">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 shadow-sm">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No Dues Pending</h3>
                    <p className="text-muted-foreground max-w-sm mt-3 leading-relaxed">
                        You are all caught up! No outstanding fees were found for your account.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {dues.map((due) => (
                        <Card key={due.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-[1.5rem]">
                            <div className="flex flex-col md:flex-row">
                                <div className={`p-1 w-full md:w-3 ${due.status === "paid" ? "bg-green-500" : due.status === "overdue" ? "bg-red-500" : "bg-orange-500"}`} />
                                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-foreground text-xl">{due.title}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${due.status === "paid" ? "bg-green-100 text-green-700" :
                                                due.status === "overdue" ? "bg-red-100 text-red-700" :
                                                    "bg-orange-100 text-orange-700"
                                                }`}>
                                                {due.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" /> Due: {due.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-3xl font-bold text-foreground">
                                            ${due.amount.toFixed(2)}
                                        </span>
                                        {due.status !== "paid" && (
                                            <Button className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 px-6">
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Pay Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
