"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Filter,
    Trash2,
    Edit2,
    ExternalLink,
    Users
} from "lucide-react";
import { useState } from "react";

export default function StudentsPage() {
    const { students, loading, addStudent, removeStudent } = useStudents();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", phone: "" });

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addStudent(newStudent);
        setNewStudent({ name: "", email: "", phone: "" });
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 italic mb-2">Student Directory</h1>
                        <p className="text-gray-500 italic text-sm">Manage enrolled students and their detailed records.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 rounded-2xl shadow-xl shadow-blue-100">
                        <Plus size={20} /> Add New Student
                    </Button>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm italic outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[32px]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black italic shadow-lg shadow-blue-100">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => removeStudent(student.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-gray-900 italic mb-4">{student.name}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 italic">
                                        <Mail size={16} className="text-blue-500" /> {student.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 italic">
                                        <Phone size={16} className="text-blue-500" /> {student.phone}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-1">Status</span>
                                        <span className="text-xs font-bold text-green-600 italic">Active Student</span>
                                    </div>
                                    <button className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform group-hover:rotate-12">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredStudents.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black italic text-gray-900 mb-2">No students found</h3>
                        <p className="text-gray-500 italic text-sm">Try adjusting your search or add a new student.</p>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-2xl font-black italic text-gray-900">Add New Student</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Full Name</label>
                                    <input
                                        required
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={newStudent.email}
                                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Phone Number</label>
                                    <input
                                        required
                                        value={newStudent.phone}
                                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 italic hover:bg-gray-50 rounded-2xl transition-colors">Cancel</button>
                                <Button type="submit" className="flex-1 py-4 rounded-2xl shadow-lg shadow-blue-100">Register Student</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
