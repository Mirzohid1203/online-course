"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { Button, cn } from "@/components/ui/Button";
import {
    CreditCard,
    Search,
    MoreHorizontal,
    Clock,
    ChevronRight,
    TrendingUp,
    Filter,
    ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { formatDate, formatCurrency } from "@/utils/formatDate";

export default function EnrollmentsPage() {
    const { enrollments, loading, updatePayment } = useEnrollments();
    const { students } = useStudents();
    const { courses } = useCourses();
    const [searchTerm, setSearchTerm] = useState("");

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || "Unknown";
    const getCourseTitle = (id: string) => courses.find(c => c.id === id)?.title || "Unknown";

    const stats = [
        { label: "Active Enrollments", value: enrollments.length },
        { label: "Total Recieved", value: formatCurrency(enrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0)) },
        { label: "Pending Dues", value: enrollments.filter(e => e.paymentStatus !== "paid").length },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 italic mb-2">Finance & Enrollments</h1>
                        <p className="text-gray-500 italic text-sm">Track student payments, course progress, and active enrollments.</p>
                    </div>
                    <Button className="flex items-center gap-2 px-8 rounded-2xl shadow-xl shadow-blue-100">
                        <CreditCard size={20} /> Process Payment
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-gray-900 italic">{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-black italic text-gray-900">Transaction History</h3>
                        <div className="relative w-full md:w-96">
                            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs italic outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                <tr>
                                    <th className="px-8 py-4">Student & Course</th>
                                    <th className="px-8 py-4">Enrolled Date</th>
                                    <th className="px-8 py-4">Progress</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Amount</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400">Syncing data...</td></tr>
                                ) : enrollments.map((en) => (
                                    <tr key={en.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-gray-900">{getStudentName(en.studentId)}</p>
                                            <p className="text-xs text-blue-600 font-bold">{getCourseTitle(en.courseId)}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500">
                                            {formatDate(en.enrolledAt)}
                                        </td>
                                        <td className="px-8 py-6 w-48">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 transition-all duration-1000"
                                                        style={{ width: `${en.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-900">{en.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                                en.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' :
                                                    en.paymentStatus === 'partial' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                            )}>
                                                {en.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-gray-900">
                                            {formatCurrency(en.amountPaid)}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {enrollments.length === 0 && !loading && (
                        <div className="text-center py-20 italic">
                            <CreditCard size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400">No enrollment records found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
