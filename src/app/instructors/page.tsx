"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useInstructors } from "@/hooks/useInstructors";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    Award,
    Trash2,
    Edit2,
    ExternalLink,
    Lock,
    UserCheck,
    Briefcase
} from "lucide-react";
import { useState } from "react";

export default function InstructorsPage() {
    const { instructors, loading, addInstructor, removeInstructor } = useInstructors();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInstructor, setNewInstructor] = useState({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        accessCode: ""
    });

    const filteredInstructors = instructors.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addInstructor(newInstructor);
        setNewInstructor({ name: "", email: "", phone: "", specialization: "", accessCode: "" });
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 italic mb-2 tracking-tighter">Faculty Management</h1>
                        <p className="text-gray-500 italic text-sm">Monitor and manage your professional teaching staff.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 rounded-2xl shadow-xl shadow-blue-100">
                        <Plus size={20} /> Onboard Instructor
                    </Button>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInstructors.map((instructor) => (
                            <div key={instructor.id} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black italic shadow-lg shadow-purple-100">
                                        {instructor.name.charAt(0)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => removeInstructor(instructor.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-gray-900 italic mb-1">{instructor.name}</h3>
                                <p className="text-xs font-bold text-purple-600 italic mb-6 flex items-center gap-1">
                                    <Briefcase size={12} /> {instructor.specialization}
                                </p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 italic">
                                        <Mail size={16} className="text-gray-400" /> {instructor.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 italic">
                                        <Phone size={16} className="text-gray-400" /> {instructor.phone}
                                    </div>
                                    {instructor.accessCode && (
                                        <div className="flex items-center gap-2 text-xs font-black text-orange-600 italic bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 w-fit">
                                            <Lock size={12} /> Key: {instructor.accessCode}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <UserCheck size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">Certified</span>
                                    </div>
                                    <button className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:bg-purple-600 hover:text-white transition-all transform group-hover:rotate-12">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Instructor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-2xl font-black italic text-gray-900">Onboard New Instructor</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Full Name</label>
                                    <input required value={newInstructor.name} onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-purple-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Email</label>
                                    <input required type="email" value={newInstructor.email} onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-purple-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Phone</label>
                                    <input required value={newInstructor.phone} onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-purple-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Specialization</label>
                                    <input required value={newInstructor.specialization} onChange={(e) => setNewInstructor({ ...newInstructor, specialization: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-purple-600" placeholder="e.g. FullStack JS" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Login Access Code</label>
                                    <input required value={newInstructor.accessCode} onChange={(e) => setNewInstructor({ ...newInstructor, accessCode: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl italic outline-none focus:ring-2 focus:ring-purple-600" placeholder="e.g. INST-100" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 italic hover:bg-gray-50 rounded-2xl transition-colors">Cancel</button>
                                <Button type="submit" className="flex-1 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100">Activate Account</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
