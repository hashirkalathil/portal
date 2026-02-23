"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Plus, Pin, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

export default function NoticesPage() {
    const { user, role } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // New Notice State
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
    }, [open]); // Refresh when dialog closes (post successful)

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
                authorName: user?.displayName || "Admin"
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
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-zinc-950 p-6 rounded-[2rem] shadow-sm border border-border/50">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Megaphone className="h-8 w-8 text-primary" />
                        Notice Board
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Stay updated with the latest announcements and events.
                    </p>
                </div>

                {role === "admin" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                                <Plus className="mr-2 h-4 w-4" /> Post Notice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/50 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-foreground">Create New Announcement</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    This will be visible to all students and faculty.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Holiday Announcement"
                                        className="bg-muted/30 border-input focus-visible:ring-primary rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="general">General</option>
                                        <option value="academic">Academic</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Content</label>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your message here..."
                                        className="min-h-[150px] bg-muted/30 border-input focus-visible:ring-primary rounded-xl resize-none"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-border hover:bg-muted">Cancel</Button>
                                <Button onClick={handlePost} disabled={posting} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
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
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border-2 border-dashed border-border/50 rounded-[2rem]">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Pin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="max-w-xs">
                        <h3 className="text-lg font-semibold text-foreground">No notices yet</h3>
                        <p className="text-muted-foreground mt-1">Check back later for important updates and announcements.</p>
                    </div>
                </div>
            ) : (
                <div className="masonry-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                    {notices.map((notice) => (
                        <Card key={notice.id} className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-[1.5rem] bg-white dark:bg-zinc-900 group`}>
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${notice.category === 'academic' ? 'bg-blue-500' :
                                notice.category === 'event' ? 'bg-purple-500' : 'bg-emerald-500'
                                }`} />
                            <CardHeader className="pb-3 pl-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{notice.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                                            <span className={`capitalize px-2 py-0.5 rounded-full ${notice.category === 'academic' ? 'bg-blue-500/10 text-blue-600' :
                                                notice.category === 'event' ? 'bg-purple-500/10 text-purple-600' : 'bg-emerald-500/10 text-emerald-600'
                                                }`}>{notice.category}</span>
                                            <span>•</span>
                                            <span>{new Date(notice.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Pin className="h-5 w-5 text-muted-foreground/30 rotate-45 shrink-0" />
                                </div>
                            </CardHeader>
                            <CardContent className="pl-6">
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{notice.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
