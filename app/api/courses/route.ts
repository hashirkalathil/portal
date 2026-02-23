import { NextResponse } from "next/server";
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
    try {
        const q = query(collection(db, "courses"));
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
        const { code, name, department, facultyId, description } = body;

        // Auto-generate ID or use code? The previous logic used doc(collection(db, "courses")) which auto-generates.
        const newCourseRef = doc(collection(db, "courses"));

        await setDoc(newCourseRef, {
            id: newCourseRef.id,
            code,
            name,
            department,
            facultyId,
            description,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, id: newCourseRef.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
