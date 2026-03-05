"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    orderBy,
    limit,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, Lesson } from "@/types";

export const useCourses = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async (category?: string) => {
        setLoading(true);
        try {
            const coursesRef = collection(db, "courses");
            let q = query(coursesRef, orderBy("createdAt", "desc"));

            if (category && category !== "All") {
                q = query(coursesRef, where("category", "==", category), orderBy("createdAt", "desc"));
            }

            const querySnapshot = await getDocs(q);
            const fetchedCourses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[];

            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCourseById = async (id: string) => {
        try {
            const docRef = doc(db, "courses", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Course;
            }
            return null;
        } catch (error) {
            console.error("Error getting course:", error);
            return null;
        }
    };

    const getLessons = async (courseId: string) => {
        try {
            const lessonsRef = collection(db, "lessons");
            const q = query(lessonsRef, where("courseId", "==", courseId), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lesson[];
        } catch (error) {
            console.error("Error fetching lessons:", error);
            return [];
        }
    };

    return {
        loading,
        courses,
        fetchCourses,
        getCourseById,
        getLessons
    };
};
