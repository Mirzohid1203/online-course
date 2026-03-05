"use client";

import { useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Certificate } from "@/types";

export const useCertificate = () => {
    const [loading, setLoading] = useState(false);

    const getCertificate = async (userId: string, courseId: string) => {
        setLoading(true);
        try {
            const certId = `${userId}_${courseId}`;
            const certSnap = await getDoc(doc(db, "certificates", certId));
            if (certSnap.exists()) {
                return { id: certSnap.id, ...certSnap.data() } as Certificate;
            }
            return null;
        } catch (error) {
            console.error("Error getting certificate:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateCertificate = async (user: any, course: any) => {
        setLoading(true);
        try {
            const certId = `${user.id}_${course.id}`;
            const certificateData: Partial<Certificate> = {
                userId: user.id,
                courseId: course.id,
                courseTitle: course.title,
                userName: user.name,
                issueDate: serverTimestamp(),
                certificateUrl: `/certificate/${course.id}`, // Internal link
            };

            await setDoc(doc(db, "certificates", certId), certificateData);
            return { id: certId, ...certificateData } as Certificate;
        } catch (error) {
            console.error("Error generating certificate:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, getCertificate, generateCertificate };
};
