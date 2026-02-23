"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    role: string | null;
    profile: any | null;
    loading: boolean;
    signIn: (id: string, password: string) => Promise<string | null>;
    signOut: (redirectPath?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    profile: null,
    loading: true,
    signIn: async () => null,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch user role from Firestore
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setRole(data.role);
                    setProfile(data.profile || null);
                } else {
                    console.error("User document not found");
                    setRole(null);
                    setProfile(null);
                }
            } else {
                setRole(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (id: string, password: string) => {
        // Logic to convert ID to email
        // If id already contains '@', treat it as a full email (for admins/faculty with real emails)
        // Otherwise, assume it's an Admission No / Staff ID and append domain.

        const email = id.includes("@") ? id : `${id}@portal.local`;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Explicitly fetch profile here to ensure state is ready before the promise resolves
            // This prevents race conditions where redirect happens before role is loaded
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUser(userCredential.user);
                setRole(data.role);
                setProfile(data.profile || null);
                return data.role as string;
            }
            return null;
        } catch (error) {
            console.error("Login Failed", error);
            throw error;
        }
    };

    const signOut = async (redirectPath: string = "/login") => {
        await firebaseSignOut(auth);
        router.push(redirectPath);
    };

    return (
        <AuthContext.Provider value={{ user, role, profile, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
