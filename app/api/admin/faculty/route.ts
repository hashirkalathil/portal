import { NextResponse } from "next/server";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
    try {
        const q = query(
            collection(db, "users"),
            where("role", "==", "faculty")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, email, name, staffId } = body;

        // In a real app with Admin SDK, we would create the Auth user here too.
        // For now, we assume Auth user is created on client, and we just save the DB record.

        await setDoc(doc(db, "users", uid), {
            uid,
            email,
            role: "faculty",
            createdAt: new Date().toISOString(),
            profile: {
                name,
                staffId,
                classTeacherOf: null
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
