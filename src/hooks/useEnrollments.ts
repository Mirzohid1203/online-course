"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Enrollment } from "@/types";
import { toast } from "react-hot-toast";

export const useEnrollments = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrollments = async () => {
        try {
            const q = query(collection(db, "enrollments"), orderBy("enrolledAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Enrollment[];
            setEnrollments(data);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        } finally {
            setLoading(false);
        }
    };

    const createEnrollment = async (enrollment: Omit<Enrollment, "id" | "enrolledAt" | "progress">) => {
        try {
            const docRef = await addDoc(collection(db, "enrollments"), {
                ...enrollment,
                progress: 0,
                enrolledAt: serverTimestamp()
            });
            toast.success("Enrollment created");
            refresh();
            return docRef.id;
        } catch (error) {
            toast.error("Enrollment failed");
        }
    };

    const updatePayment = async (id: string, amount: number, status: Enrollment["paymentStatus"]) => {
        try {
            const ref = doc(db, "enrollments", id);
            await updateDoc(ref, { amountPaid: amount, paymentStatus: status });
            toast.success("Payment updated");
            refresh();
        } catch (error) {
            toast.error("Failed to update payment");
        }
    };

    const refresh = () => fetchEnrollments();

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return { enrollments, loading, createEnrollment, updatePayment, refresh };
};
