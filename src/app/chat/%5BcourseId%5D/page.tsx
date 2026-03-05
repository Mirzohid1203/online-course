"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
import { Send, ChevronLeft, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ChatPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }

        const q = query(
            collection(db, "chats"),
            where("courseId", "==", courseId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);

            // Auto scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => unsubscribe();
    }, [courseId, user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(collection(db, "chats"), {
                courseId,
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                message: newMessage,
                timestamp: serverTimestamp(),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold italic text-blue-600">Connecting to course chat...</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 pr-4 border-r border-gray-200">
                        <ChevronLeft />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 italic leading-none mb-1">Course Discussion</h2>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online • {messages.length} messages</p>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <Info className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <div className="max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 text-2xl font-bold">💬</div>
                            <h3 className="text-lg font-bold text-gray-900 italic mb-2">Start the conversation!</h3>
                            <p className="text-gray-500 italic max-w-xs mx-auto">Ask questions, share resources, or just say hello to your fellow learners.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.senderId === user?.id;
                            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                            return (
                                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!isMe && (
                                        <div className="w-8 flex-shrink-0">
                                            {showAvatar && (
                                                <img
                                                    src={msg.senderAvatar || "https://ui-avatars.com/api/?name=" + msg.senderName}
                                                    className="w-8 h-8 rounded-full border border-gray-200"
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && showAvatar && (
                                            <p className="text-[10px] font-bold text-gray-500 mb-1 ml-1 italic">{msg.senderName}</p>
                                        )}
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}>
                                            {msg.message}
                                        </div>
                                        {msg.timestamp && (
                                            <p className={`text-[9px] text-gray-400 mt-1 italic ${isMe ? 'mr-1' : 'ml-1'}`}>
                                                {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input */}
            <footer className="p-4 md:p-6 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none italic transition-all"
                    />
                    <Button type="submit" className="rounded-2xl px-6 shadow-lg shadow-blue-200">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </footer>
        </div>
    );
}
