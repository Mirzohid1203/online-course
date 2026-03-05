"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Instructor } from "@/types";
import { toast } from "react-hot-toast";

export const useInstructors = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInstructors = async () => {
        try {
            const q = query(collection(db, "instructors"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Instructor[];
            setInstructors(data);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        } finally {
            setLoading(false);
        }
    };

    const addInstructor = async (instructor: Omit<Instructor, "id" | "createdAt">) => {
        try {
            // Check if access code is unique in instructors
            if (instructor.accessCode) {
                const q = query(collection(db, "instructors"), where("accessCode", "==", instructor.accessCode));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    toast.error("This Access Code is already in use by an instructor.");
                    return;
                }

                // Also check students collection for the same code to ensure global unique code
                const q2 = query(collection(db, "students"), where("accessCode", "==", instructor.accessCode));
                const snap2 = await getDocs(q2);
                if (!snap2.empty) {
                    toast.error("This Access Code is already in use by a student.");
                    return;
                }
            }

            const docRef = await addDoc(collection(db, "instructors"), {
                ...instructor,
                createdAt: serverTimestamp()
            });
            setInstructors([{ id: docRef.id, ...instructor, createdAt: new Date() } as Instructor, ...instructors]);
            toast.success("Instructor registered successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add instructor");
        }
    };

    const removeInstructor = async (id: string) => {
        try {
            await deleteDoc(doc(db, "instructors", id));
            setInstructors(instructors.filter(i => i.id !== id));
            toast.success("Instructor removed");
        } catch (error) {
            toast.error("Failed to remove instructor");
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    return { instructors, loading, addInstructor, removeInstructor, refresh: fetchInstructors };
};
