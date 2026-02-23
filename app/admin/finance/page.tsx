"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Plus, DollarSign, TrendingUp, CreditCard, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FinanceDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCollected: 0,
        pendingDues: 0,
        recentTransactions: [] as any[]
    });

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const duesQuery = query(collection(db, "dues"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(duesQuery);

                let collected = 0;
                let pending = 0;
                let recentActivity: any[] = [];

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const amount = Number(data.amount) || 0;
                    if (data.status === "paid") {
                        collected += amount;
                    } else {
                        pending += amount;
                    }

                    // Collect recent 5 items for the list
                    if (recentActivity.length < 5) {
                        recentActivity.push({
                            id: doc.id,
                            student: "Student", // We'd need to fetch name or store it in due
                            ...data
                        });
                    }
                });

                setStats({
                    totalCollected: collected,
                    pendingDues: pending,
                    recentTransactions: recentActivity
                });
            } catch (error) {
                console.error("Error fetching finance data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Finance & Fees
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Track revenue, manage student dues, and view transaction history.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors" asChild>
                        <Link href="/admin/finance/transactions">
                            <FileText className="mr-2 h-4 w-4" />
                            View Reports
                        </Link>
                    </Button>
                    <Button className="rounded-full shadow-lg shadow-primary/20" asChild>
                        <Link href="/admin/finance/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Fee Challan
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                                <h3 className="text-2xl font-bold text-foreground">${stats.totalCollected.toLocaleString()}</h3>
                                <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +12% this month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Dues</p>
                                <h3 className="text-2xl font-bold text-foreground">${stats.pendingDues.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    From 42 students
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Challans</p>
                                <h3 className="text-2xl font-bold text-foreground">156</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Generated for Spring '26
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-muted/20">
                                    <tr className="border-b transition-colors">
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Global Status</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date Created</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {stats.recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-6 align-middle font-medium text-foreground">{tx.title}</td>
                                            <td className="p-6 align-middle">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${tx.status === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="p-6 align-middle text-muted-foreground">{new Date(tx.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td className="p-6 align-middle text-right font-bold text-foreground">
                                                ${Number(tx.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
