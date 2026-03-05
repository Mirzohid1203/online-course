"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Student } from "@/types";
import { toast } from "react-hot-toast";

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const addStudent = async (student: Omit<Student, "id" | "createdAt" | "enrolledCourses" | "progress"> & { accessCode?: string }) => {
        try {
            const docRef = await addDoc(collection(db, "students"), {
                ...student,
                enrolledCourses: [],
                progress: {},
                createdAt: serverTimestamp()
            });
            const newStudent = { id: docRef.id, ...student, enrolledCourses: [], progress: {}, createdAt: new Date() } as Student;
            setStudents([newStudent, ...students]);
            toast.success("Student added successfully");
            return docRef.id;
        } catch (error) {
            toast.error("Failed to add student");
        }
    };

    const removeStudent = async (id: string) => {
        try {
            await deleteDoc(doc(db, "students", id));
            setStudents(students.filter(s => s.id !== id));
            toast.success("Student removed");
        } catch (error) {
            toast.error("Failed to remove student");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return { students, loading, addStudent, removeStudent, refresh: fetchStudents };
};
