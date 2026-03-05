"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useStudents } from "@/hooks/useStudents";
import {
    Users,
    Video,
    Plus,
    TrendingUp,
    Calendar,
    CheckCircle,
    MoreVertical,
    ArrowRight,
    BookOpen,
    Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatDate";

export default function InstructorDashboard() {
    const { user } = useAuth();
    const { courses, loading: coursesLoading } = useCourses();
    const { students, loading: studentsLoading } = useStudents();

    if (user?.role !== "instructor" && user?.role !== "admin") {
        return <div className="p-20 text-center font-black italic text-red-500">INSTRUCTOR PRIVILEGES REQUIRED.</div>;
    }

    const instructorCourses = courses.filter(c => c.instructorId === user.id || user.role === 'admin');

    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 italic mb-2 tracking-tighter">Academic Portal</h1>
                        <p className="text-gray-500 italic text-sm">Welcome back, Professor {user.name.split(' ')[1] || user.name.split(' ')[0]}. Here is your agenda.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-2xl border-2 border-gray-100 italic">View Schedule</Button>
                        <Button className="rounded-2xl shadow-xl shadow-blue-100 flex items-center gap-2">
                            <Video size={18} /> Start Session
                        </Button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Active Students", value: students.length, icon: <Users className="text-blue-600" />, trend: "+8.2%" },
                        { label: "Assigned Courses", value: instructorCourses.length, icon: <BookOpen className="text-purple-600" />, trend: "Stable" },
                        { label: "Lessons Conducted", value: "142", icon: <Video className="text-green-600" />, trend: "+14h" },
                        { label: "Student Success", value: "98%", icon: <TrendingUp className="text-amber-600" />, trend: "+2%" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-transform hover:-translate-y-2 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div className="bg-gray-50 p-4 rounded-3xl">{stat.icon}</div>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Course Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                                <h3 className="text-2xl font-black italic text-gray-900 tracking-tight">Active Curriculum</h3>
                                <button className="text-blue-600 font-black italic text-sm hover:underline">Manage All</button>
                            </div>

                            <div className="p-10 grid grid-cols-1 gap-8">
                                {instructorCourses.length > 0 ? instructorCourses.slice(0, 3).map((course) => (
                                    <div key={course.id} className="group relative flex items-center gap-6 p-6 rounded-[32px] hover:bg-blue-50/50 transition-all duration-500">
                                        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black italic shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                            {course.title.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-gray-900 italic mb-1 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                                                <span className="flex items-center gap-1"><Users size={12} /> 24 Students</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {course.schedule}</span>
                                            </div>
                                        </div>
                                        <button className="bg-white p-4 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 border border-gray-100">
                                            <ArrowRight className="text-blue-600" size={20} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 italic text-gray-400">No courses assigned to you yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Students / Progress */}
                    <div className="space-y-8">
                        <div className="bg-gray-900 p-10 rounded-[48px] text-white overflow-hidden relative group">
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                            <h3 className="text-2xl font-black italic mb-8 relative z-10">High Achievers</h3>
                            <div className="space-y-6 relative z-10">
                                {students.slice(0, 4).map((s, i) => (
                                    <div key={s.id} className="flex items-center justify-between group/item">
                                        <div className="flex items-center gap-4">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-gray-800" />
                                            <div>
                                                <p className="text-sm font-black italic">{s.name.split(' ')[0]}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">9{i}% Progress</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-700 group-hover/item:text-blue-400 transition-colors"><Mail size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-[28px] font-black italic text-sm hover:bg-white/10 transition-colors relative z-10">Review All Grades</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
