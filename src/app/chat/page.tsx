"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useStudents } from "@/hooks/useStudents";
import { Button, cn } from "@/components/ui/Button";
import {
    Send,
    Search,
    MoreVertical,
    Hash,
    AtSign,
    Users,
    Circle,
    Video,
    Info
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function CRMChatPage() {
    const { user } = useAuth();
    const { students } = useStudents();
    const [activeChannel, setActiveChannel] = useState("Staff General");
    const { messages, sendMessage, loading } = useChat(activeChannel);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const channels = [
        { name: "Staff General", type: "channel" },
        { name: "Instructors Hub", type: "channel" },
        { name: "Student Support", type: "channel" },
        { name: "Admin Announcements", type: "channel" },
    ];

    const contacts = students.map(s => ({
        id: s.id,
        name: s.name,
        status: "offline",
        role: "Student",
        avatar: `https://ui-avatars.com/api/?name=${s.name}&background=random`
    }));

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            sendMessage(user, inputText); // Basic sender logic
            setInputText("");
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-160px)] flex bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                placeholder="Search messages..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs italic outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-8">
                        <div>
                            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-4">Channels</p>
                            <div className="space-y-1">
                                {channels.map((ch) => (
                                    <button
                                        key={ch.name}
                                        onClick={() => setActiveChannel(ch.name)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold italic transition-all",
                                            activeChannel === ch.name ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-100"
                                        )}
                                    >
                                        <Hash size={16} /> {ch.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-4">Direct Messages</p>
                            <div className="space-y-1">
                                {contacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold italic text-gray-500 hover:bg-gray-100 transition-all group"
                                    >
                                        <div className="relative">
                                            <img src={contact.avatar} className="w-6 h-6 rounded-full" />
                                            <Circle size={8} className={cn("absolute -bottom-0.5 -right-0.5 fill-current", contact.status === 'online' ? "text-green-500" : "text-gray-300")} />
                                        </div>
                                        <span className="flex-1 text-left truncate">{contact.name}</span>
                                        <span className="text-[9px] opacity-0 group-hover:opacity-100 uppercase tracking-tighter text-blue-500">{contact.role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    <header className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Hash size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black italic text-gray-900">{activeChannel}</h3>
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Circle className="fill-current" size={6} /> Active Channel
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Video size={20} /></button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Users size={20} /></button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Info size={20} /></button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                                    <MessageSquare className="text-gray-300" size={32} />
                                </div>
                                <h4 className="text-xl font-black italic text-gray-900 mb-2">Welcome to {activeChannel}</h4>
                                <p className="text-sm text-gray-400 italic max-w-xs">Start messaging to begin the conversation in this workspace.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id} className={cn("flex gap-4 group", isMe ? "flex-row-reverse" : "flex-row")}>
                                        <img src={msg.senderAvatar} className="w-8 h-8 rounded-full shadow-sm" />
                                        <div className={cn("max-w-[60%] flex flex-col", isMe ? "items-end" : "items-start")}>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {!isMe && <span className="text-[10px] font-black text-gray-900 italic">{msg.senderName}</span>}
                                                <span className="text-[9px] text-gray-400 font-bold uppercase">{new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={cn(
                                                "px-5 py-3 rounded-3xl text-sm italic leading-relaxed",
                                                isMe ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100" : "bg-gray-100 text-gray-700 rounded-tl-none"
                                            )}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <footer className="p-6 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="bg-gray-50 p-2 rounded-2xl flex items-center gap-3">
                            <input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={`Message ${activeChannel}...`}
                                className="flex-1 bg-transparent border-none px-4 text-sm italic outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Sub-component imports for visual consistency
import { MessageSquare } from "lucide-react";
