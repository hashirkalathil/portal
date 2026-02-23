import { NextResponse } from "next/server";
import { collection, query, getDocs, doc, setDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
    try {
        const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
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
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate a simple ID from the name (e.g., "Computer Science" -> "COMPUTER_SCIENCE") or just use auto-id.
        // User asked for "creating classes only", implying simple names. 
        // Let's use auto-ID for safety against duplicates/renames, but store a normalized code if needed.
        // For now, auto-ID is safest.

        const newClassRef = doc(collection(db, "classes"));

        await setDoc(newClassRef, {
            id: newClassRef.id,
            name,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, id: newClassRef.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
