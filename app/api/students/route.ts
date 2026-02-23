import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const assignedClass = searchParams.get("class");

        let q;

        if (assignedClass) {
            // We can't query by "profile.class" easily if it's dynamic or legacy. 
            // But for now, let's fetch all students and filter in memory if the index isn't guaranteed.
            // OR, if we assume the structure is consistent:
            // Firestore allows where("profile.class", "==", ...).
            // However, some students might have "profile.department".
            // Let's fetch all students (role=student) and filter server-side here to be safe and consistent with previous logic.
            // Fetching all students isn't Scalable but fine for MVP/Small scale.
            q = query(
                collection(db, "users"),
                where("role", "==", "student")
            );
        } else {
            q = query(
                collection(db, "users"),
                where("role", "==", "student")
            );
        }

        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map(doc => doc.data());

        // Server-side filtering for flexible legacy support (class vs department)
        if (assignedClass) {
            data = data.filter((student: any) => {
                const studentClass = student.profile?.class || student.profile?.department;
                return studentClass === assignedClass;
            });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
