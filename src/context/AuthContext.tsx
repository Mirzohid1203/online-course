"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, provider } from "@/lib/firebase";
import { User, UserRole } from "@/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: () => Promise<void>;
    loginWithCode: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Check if user exists in Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    // Force admin role for the specific email if it's not already set
                    if (userData.email === "mmahmutaliyev411@gmail.com" && userData.role !== "admin") {
                        await setDoc(doc(db, "users", firebaseUser.uid), { ...userData, role: "admin" }, { merge: true });
                        userData.role = "admin";
                    }
                    setUser(userData);
                } else {
                    // Create new user document
                    const isAdminEmail = firebaseUser.email === "mmahmutaliyev411@gmail.com";

                    const newUser: User = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || "Unknown User",
                        email: firebaseUser.email || "",
                        avatar: firebaseUser.photoURL || "",
                        role: isAdminEmail ? "admin" : "student",
                        createdAt: serverTimestamp(),
                    };
                    await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                    setUser(newUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const loginWithCode = async (email: string, code: string) => {
        try {
            // 1. Try to find student
            const qS = query(collection(db, "students"), where("email", "==", email), where("accessCode", "==", code));
            const snapS = await getDocs(qS);

            if (!snapS.empty) {
                const studentData = snapS.docs[0].data();
                const studentUser: User = {
                    id: snapS.docs[0].id,
                    name: studentData.name,
                    email: studentData.email,
                    avatar: `https://ui-avatars.com/api/?name=${studentData.name}&background=random`,
                    role: "student",
                    createdAt: studentData.createdAt
                };
                setUser(studentUser);
                toast.success("Welcome back! Initializing student console.");
                router.push("/dashboard");
                return;
            }

            // 2. Try to find instructor
            const qI = query(collection(db, "instructors"), where("email", "==", email), where("accessCode", "==", code));
            const snapI = await getDocs(qI);

            if (!snapI.empty) {
                const instructorData = snapI.docs[0].data();
                const instructorUser: User = {
                    id: snapI.docs[0].id,
                    name: instructorData.name,
                    email: instructorData.email,
                    avatar: `https://ui-avatars.com/api/?name=${instructorData.name}&background=random`,
                    role: "instructor",
                    createdAt: instructorData.createdAt
                };
                setUser(instructorUser);
                toast.success("Welcome, Instructor! Loading classroom hub.");
                router.push("/dashboard");
                return;
            }

            throw new Error("Invalid credentials");
        } catch (error) {
            console.error("Login with code error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, logout, loginWithCode }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
