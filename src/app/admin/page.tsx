"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useStudents } from "@/hooks/useStudents";
import {
    Shield,
    Users,
    Settings,
    Lock,
    Unlock,
    MoreVertical,
    Mail,
    Filter,
    Search,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types";
import { toast } from "react-hot-toast";
import { cn } from "@/components/ui/Button";

export default function AdminPanel() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    if (currentUser?.role !== "admin") {
        return <div className="p-20 text-center font-black italic text-red-500">ACCESS DENIED. ADMIN ONLY.</div>;
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snap = await getDocs(collection(db, "users"));
                setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const changeRole = async (userId: string, newRole: string) => {
        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            toast.success(`Role updated to ${newRole}`);
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-gray-900 italic mb-2 flex items-center gap-3">
                        <Shield className="text-red-500" size={32} /> Admin Management
                    </h1>
                    <p className="text-gray-500 italic text-sm">Global system overrides, user permissions and security settings.</p>
                </header>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-xl font-black italic text-gray-900">User Access Control</h3>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input placeholder="Search employees..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs italic outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black italic">Sync Roles</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfdff] text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-4">Identity</th>
                                    <th className="px-8 py-4">Permissions</th>
                                    <th className="px-8 py-4">Account Status</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-20 text-center text-gray-400">Loading secure data...</td></tr>
                                ) : users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={u.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                                <div>
                                                    <p className="font-black text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12} /> {u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={u.role}
                                                onChange={(e) => changeRole(u.id, e.target.value)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider outline-none border-none cursor-pointer",
                                                    u.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                        u.role === 'instructor' ? 'bg-purple-50 text-purple-600' :
                                                            'bg-blue-50 text-blue-600'
                                                )}
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="flex items-center gap-2 text-green-600 font-black">
                                                <CheckCircle2 size={16} /> Verified
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600"><Lock size={18} /></button>
                                                <button className="p-2 text-gray-400 hover:text-red-500"><Settings size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[40px] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <h3 className="text-2xl font-black italic mb-4 relative z-10">Database Backup</h3>
                        <p className="text-gray-400 italic text-sm mb-12 relative z-10">Export all system data including enrollments, users and revenue records as a secure encrypted file.</p>
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black italic text-sm hover:translate-x-3 transition-transform relative z-10">Generate JSON Dump</button>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black italic text-gray-900 mb-6">System Health</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Cloud Firestore", status: "Operational", load: "12%" },
                                { label: "Firebase Auth", status: "Operational", load: "4%" },
                                { label: "Responsive Workers", status: "Operational", load: "0.2ms" },
                            ].map(s => (
                                <div key={s.label} className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    <div>
                                        <p className="font-bold text-gray-900 italic">{s.label}</p>
                                        <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">{s.status}</p>
                                    </div>
                                    <span className="text-sm font-black text-gray-400 italic">{s.load}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
