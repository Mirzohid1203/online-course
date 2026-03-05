"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    Users,
    Shield,
    Settings,
    Database,
    Search,
    CheckCircle,
    XCircle,
    MoreVertical
} from "lucide-react";

export default function AdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "admin") return;

        const fetchAdminData = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const coursesSnap = await getDocs(collection(db, "courses"));
                const enrollmentsSnap = await getDocs(collection(db, "enrollments"));

                setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setStats({
                    totalUsers: usersSnap.size,
                    totalCourses: coursesSnap.size,
                    totalEnrollments: enrollmentsSnap.size,
                    revenue: 124500 // Mock revenue
                });
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user]);

    if (!user || user.role !== "admin") {
        return <div className="min-h-screen flex items-center justify-center font-bold italic">Unauthorized access. Admins only.</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 italic mb-2">Admin Control Center</h1>
                    <p className="text-gray-500 italic">Global platform management and system monitoring.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Platform Users", value: stats.totalUsers, icon: <Users className="text-blue-600" /> },
                        { label: "Total Courses", value: stats.totalCourses, icon: <Database className="text-purple-600" /> },
                        { label: "Enrollments", value: stats.totalEnrollments, icon: <CheckCircle className="text-green-600" /> },
                        { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <Shield className="text-amber-600" /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                {stat.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900 italic">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 italic">User Management</h2>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-[900] text-gray-500 uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Loading users...</td></tr>
                                        ) : users.map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.avatar || "https://ui-avatars.com/api/?name=" + u.name} className="w-10 h-10 rounded-full border border-gray-100" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                                            <p className="text-xs text-gray-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                            u.role === 'instructor' ? 'bg-purple-50 text-purple-600' :
                                                                'bg-blue-50 text-blue-600'
                                                        }`}>{u.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                                        <div className="w-2 h-2 rounded-full bg-green-500" /> Active
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 italic mb-6">System Health</h2>
                            <div className="space-y-6">
                                {[
                                    { label: "Firebase Database", status: "Operational", color: "text-green-500" },
                                    { label: "Storage Engine", status: "Operational", color: "text-green-500" },
                                    { label: "Auth Services", status: "Operational", color: "text-green-500" },
                                    { label: "Payment Gateway", status: "Maintenance", color: "text-amber-500" },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 italic font-medium">{s.label}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>{s.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-xl font-extrabold italic mb-4 relative z-10">Export Reports</h3>
                            <p className="text-gray-400 text-sm italic mb-8 relative z-10 leading-relaxed">Generate detailed financial and usage reports for the past 30 days.</p>
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-black italic text-sm hover:translate-x-2 transition-transform relative z-10">Download .CSV</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
