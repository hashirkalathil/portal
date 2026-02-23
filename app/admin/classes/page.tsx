"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Search, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ClassItem {
    id: string;
    name: string;
    createdAt: string;
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Create Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchClasses = async () => {
        try {
            const res = await fetch("/api/admin/classes");
            if (!res.ok) throw new Error("Failed to fetch classes");
            const data = await res.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("/api/admin/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newClassName.trim()
                }),
            });

            if (!res.ok) throw new Error("Failed to create class");

            setNewClassName("");
            setIsDialogOpen(false);
            fetchClasses(); // Refresh list
        } catch (error: any) {
            console.error("Error creating class:", error);
            alert("Error: " + error.message);
        } finally {
            setCreating(false);
        }
    };

    const filteredClasses = classes.filter(
        (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Class Management
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Create and view the classes available in the institute.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>
                                Enter the name of the class (e.g., "Computer Science", "Grade 10").
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right text-sm font-medium">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                        className="col-span-3 rounded-xl bg-muted/30 border-input focus-visible:ring-primary"
                                        placeholder="e.g. Science"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" isLoading={creating} className="rounded-full shadow-lg shadow-primary/25">Save Class</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border/50 shadow-sm rounded-[2rem] bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">All Classes</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-10 bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                placeholder="Search classes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredClasses.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            No classes found. Add one to get started.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredClasses.map((item) => (
                                <div key={item.id} className="flex items-center p-4 border border-border/40 rounded-2xl hover:bg-muted/30 transition-all duration-300 bg-white/60 hover:shadow-md hover:-translate-y-0.5 group">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <Building className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground">ID: {item.id.substring(0, 8)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
