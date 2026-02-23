import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define context type for dynamic route segments
type ConnectContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    request: Request,
    { params }: ConnectContext
) {
    try {
        const { id } = await params;
        const facultyRef = doc(db, "users", id);
        const facultyDoc = await getDoc(facultyRef);

        if (!facultyDoc.exists()) {
            return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
        }

        return NextResponse.json(facultyDoc.data());
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: ConnectContext
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { classTeacherOf } = body;

        const facultyRef = doc(db, "users", id);

        // We only support updating classTeacherOf for now in this API
        await updateDoc(facultyRef, {
            "profile.classTeacherOf": classTeacherOf
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
