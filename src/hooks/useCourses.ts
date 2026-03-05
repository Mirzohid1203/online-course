"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";
import { toast } from "react-hot-toast";

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const addCourse = async (course: Omit<Course, "id" | "createdAt">) => {
        try {
            const docRef = await addDoc(collection(db, "courses"), {
                ...course,
                createdAt: serverTimestamp()
            });
            toast.success("Course created successfully");
            refresh();
            return docRef.id;
        } catch (error) {
            toast.error("Failed to create course");
        }
    };

    const updateCourse = async (id: string, updates: Partial<Course>) => {
        try {
            await updateDoc(doc(db, "courses", id), updates);
            toast.success("Course updated");
            refresh();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const removeCourse = async (id: string) => {
        try {
            await deleteDoc(doc(db, "courses", id));
            setCourses(courses.filter(c => c.id !== id));
            toast.success("Course deleted");
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const refresh = () => fetchCourses();

    useEffect(() => {
        fetchCourses();
    }, []);

    return { courses, loading, addCourse, updateCourse, removeCourse, refresh };
};
