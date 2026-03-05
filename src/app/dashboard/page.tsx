"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";
import {
    Users,
    DollarSign,
    BookOpen,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export default function CRMDashboard() {
    const { data, loading } = useAnalytics();

    if (loading) return null;

    const cards = [
        { label: "Total Revenue", value: `$${data.stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-green-600" />, change: "+12.5%", isUp: true },
        { label: "Total Students", value: data.stats.totalStudents, icon: <Users className="text-blue-600" />, change: "+4.2%", isUp: true },
        { label: "Instructors", value: data.stats.totalInstructors, icon: <BookOpen className="text-purple-600" />, change: "+1", isUp: true },
        { label: "Pending Payments", value: data.stats.pendingPayments, icon: <AlertCircle className="text-amber-600" />, change: "-2", isUp: false },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-[900] text-gray-900 italic mb-2">Platform Overview</h1>
                    <p className="text-gray-500 italic text-sm">Real-time performance metrics and financial tracking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-gray-50 p-3 rounded-2xl">{card.icon}</div>
                                <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {card.change} {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 italic">{card.label}</p>
                            <p className="text-3xl font-black text-gray-900 italic">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black italic text-gray-900 flex items-center gap-2">
                                <TrendingUp className="text-blue-600" /> Revenue Growth
                            </h3>
                            <select className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.revenue}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Attendance Chart */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black italic text-gray-900 mb-8">Popular Courses</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.attendance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="course"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 800 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none' }}
                                    />
                                    <Bar dataKey="count" fill="#2563eb" radius={[0, 8, 8, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-black italic text-gray-900">Recent Enrollments</h3>
                        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                <tr>
                                    <th className="px-8 py-4">Student</th>
                                    <th className="px-8 py-4">Course</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3].map((entry) => (
                                    <tr key={entry} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">JD</div>
                                                <div>
                                                    <p className="font-bold text-gray-900 italic">John Doe</p>
                                                    <p className="text-xs text-gray-500">john@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-gray-600 italic">Fullstack Developer</td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-lg">Paid</span>
                                        </td>
                                        <td className="px-8 py-5 font-black text-gray-900">$499.00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
