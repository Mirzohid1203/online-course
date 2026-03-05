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
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import {
    TrendingUp,
    Users,
    DollarSign,
    Target,
    Award,
    Filter,
    Download,
    Calendar
} from "lucide-react";
import { cn } from "@/components/ui/Button";

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AnalyticsPage() {
    const { data, loading } = useAnalytics();

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-[900] text-gray-900 italic tracking-tighter mb-2">Financial Intelligence</h1>
                        <p className="text-gray-500 italic text-sm font-medium">Deep dive into revenue streams, student growth, and course performance.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold italic text-gray-600 hover:bg-gray-50 transition-all">
                            <Calendar size={18} /> Date Range
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black italic shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
                            <Download size={18} /> Export Data
                        </button>
                    </div>
                </header>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Gross Revenue", value: "$0", icon: <DollarSign />, color: "bg-blue-500" },
                        { label: "Conversion Rate", value: "0%", icon: <Target />, color: "bg-purple-500" },
                        { label: "Avg. Student Value", value: "$0", icon: <Award />, color: "bg-emerald-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700", stat.color)} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Detailed Revenue Line Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black italic text-gray-900 tracking-tight flex items-center gap-3">
                                <TrendingUp className="text-blue-600" /> Revenue Trajectory
                            </h3>
                            <div className="flex bg-gray-50 p-1.5 rounded-xl">
                                <button className="px-4 py-1.5 bg-white text-[10px] font-black italic rounded-lg shadow-sm">Monthly</button>
                                <button className="px-4 py-1.5 text-[10px] font-black italic text-gray-400">Weekly</button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.revenue}>
                                    <defs>
                                        <linearGradient id="colorRevDetailed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorRevDetailed)" dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Distribution Pie Chart */}
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-black italic text-gray-900 tracking-tight mb-10">Market Share</h3>
                        <div className="h-[400px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.attendance}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="count"
                                    >
                                        {data.attendance.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                <p className="text-3xl font-black text-gray-900 italic">{data.stats.totalStudents}</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            {data.attendance.map((entry: any, index: number) => (
                                <div key={index} className="flex justify-between items-center italic">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-sm font-bold text-gray-600">{entry.course}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-900">{entry.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Secondary Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-black italic text-gray-900 tracking-tight mb-10 text-center">Efficiency Score</h3>
                        <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                                        <circle cx="96" cy="96" r="88" stroke="#2563eb" strokeWidth="12" fill="transparent"
                                            strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - 0.85)} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="text-5xl font-black italic text-gray-900">85%</span>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm font-bold text-gray-500 italic uppercase tracking-widest">System Optimization</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[48px] text-white shadow-2xl shadow-blue-200">
                        <h3 className="text-2xl font-black italic mb-6">Strategic AI Insights</h3>
                        <div className="space-y-6 italic">
                            <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                                <p className="text-sm font-bold mb-2 text-blue-200 uppercase tracking-widest">Opportunity</p>
                                <p>Enrollments for <span className="font-black underline mx-1">React Master</span> increased by 22% this week. Consider launching advanced module.</p>
                            </div>
                            <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                                <p className="text-sm font-bold mb-2 text-blue-200 uppercase tracking-widest">Alert</p>
                                <p>Revenue retention in <span className="font-black underline mx-1">UI Design</span> is slightly lower than usual. Check instructor feedback.</p>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-4 bg-white text-blue-600 rounded-2xl font-black italic text-sm hover:scale-[1.02] transition-transform">Download Quarterly Strategy Guide</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
