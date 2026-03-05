"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types";

export const useChat = (courseId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;

        const q = query(
            collection(db, "chats"),
            where("courseId", "==", courseId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [courseId]);

    const sendMessage = async (user: any, message: string) => {
        if (!message.trim() || !user) return;

        try {
            await addDoc(collection(db, "chats"), {
                courseId,
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                message,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return { messages, loading, sendMessage };
};
