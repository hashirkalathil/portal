"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Plus, Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    category: "general" | "academic" | "event";
}

export function NoticesPage() {
    const { user, profile, role } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const q = query(collection(db, "notices"), orderBy("date", "desc"));
                const snapshot = await getDocs(q);
                const data: Notice[] = [];
                snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Notice));
                setNotices(data);
            } catch (error) {
                console.error("Error fetching notices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [open]);

    const handlePost = async () => {
        if (!title || !content) return;
        setPosting(true);
        try {
            await addDoc(collection(db, "notices"), {
                title,
                content,
                category,
                date: new Date().toISOString(),
                authorId: user?.uid,
                authorName: profile?.name || "Admin"
            });
            setOpen(false);
            setTitle("");
            setContent("");
        } catch (e) {
            console.error(e);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Notice Board
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        Latest announcements and updates.
                    </p>
                </div>

                {role === "admin" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Post Notice
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Announcement</DialogTitle>
                                <DialogDescription>
                                    This will be visible to all students and faculty.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Holiday Announcement" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="general">General</option>
                                        <option value="academic">Academic</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Content</label>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your message here..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handlePost} disabled={posting}>
                                    {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Post Notice
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
            ) : notices.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    No notices posted yet.
                </div>
            ) : (
                <div className="grid gap-6">
                    {notices.map((notice) => (
                        <Card key={notice.id} className="relative overflow-hidden border-l-4 border-l-blue-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className="capitalize bg-zinc-100 px-2 py-0.5 rounded-full">{notice.category}</span>
                                            <span>•</span>
                                            <span>{new Date(notice.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Pin className="h-5 w-5 text-zinc-300 rotate-45" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-600 whitespace-pre-wrap">{notice.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
