"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Search,
    BookOpen,
    User,
    Clock,
    Tag,
    DollarSign,
    MoreVertical,
    Edit,
    Trash2,
    Calendar
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatDate";

export default function CoursesPage() {
    const { courses, loading, addCourse, removeCourse } = useCourses();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        instructorId: "",
        price: 0,
        category: "Development",
        schedule: ""
    });

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCourse(newCourse);
        setIsModalOpen(false);
        setNewCourse({ title: "", description: "", instructorId: "", price: 0, category: "Development", schedule: "" });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 italic mb-2">Course Management</h1>
                        <p className="text-gray-500 italic text-sm">Curate curriculum, set pricing, and assign instructors.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 rounded-2xl shadow-xl shadow-blue-100">
                        <Plus size={20} /> Create New Course
                    </Button>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm italic outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
                                <div className="p-8 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-blue-50 p-4 rounded-[20px]">
                                            <BookOpen className="text-blue-600" size={24} />
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => removeCourse(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 italic mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-gray-500 italic mb-6 line-clamp-2">{course.description}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                                            <Tag size={14} className="text-blue-500" /> {course.category}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                                            <Calendar size={14} className="text-blue-500" /> {course.schedule || "TBD"}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Tuition Fee</span>
                                        <span className="text-xl font-black text-gray-900 italic">{formatCurrency(course.price)}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Instructor</span>
                                        <span className="text-xs font-bold text-blue-600 italic">Sarah Johnson</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredCourses.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 italic font-bold">No active courses found.</p>
                    </div>
                )}
            </div>

            {/* Add Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-2xl font-black italic text-gray-900">Configure New Course</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Course Title</label>
                                    <input
                                        required
                                        value={newCourse.title}
                                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="e.g. Advanced English I"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Category</label>
                                    <select
                                        required
                                        value={newCourse.category}
                                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option>Development</option>
                                        <option>Languages</option>
                                        <option>Design</option>
                                        <option>Mathematics</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Brief Description</label>
                                <textarea
                                    required
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600 h-24"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Tuition Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        value={newCourse.price}
                                        onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Weekly Schedule</label>
                                    <input
                                        required
                                        value={newCourse.schedule}
                                        onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="e.g. Mon, Wed, Fri 18:00"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 italic hover:bg-gray-50 rounded-2xl transition-colors">Discard</button>
                                <Button type="submit" className="flex-1 py-4 rounded-2xl shadow-lg shadow-blue-100">Publish Course</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
