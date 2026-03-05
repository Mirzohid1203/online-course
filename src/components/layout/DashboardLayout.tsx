"use client";

import { Sidebar } from "./Sidebar";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 italic font-bold text-blue-600">Loading system...</div>;
    if (!user) return null;

    return (
        <div className="flex bg-gray-50 min-h-screen text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 italic">Central Management System</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">+12</div>
                        </div>
                        <div className="w-px h-6 bg-gray-200 mx-2" />
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-900 italic">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">System Operational</p>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
