"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    Users,
    DollarSign,
    BookOpen,
    Plus,
    MoreVertical,
    Edit,
    Trash,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function InstructorDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New Course State
    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        category: "Development",
        price: 0,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
    });

    useEffect(() => {
        if (!user || (user.role !== "instructor" && user.role !== "admin")) return;

        const fetchInstructorCourses = async () => {
            try {
                const coursesRef = collection(db, "courses");
                const q = query(coursesRef, where("instructorId", "==", user.id));
                const querySnapshot = await getDocs(q);
                const fetchedCourses = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCourses(fetchedCourses);
            } catch (error) {
                toast.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorCourses();
    }, [user]);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const docRef = await addDoc(collection(db, "courses"), {
                ...newCourse,
                instructorId: user.id,
                rating: 0,
                createdAt: serverTimestamp(),
            });

            setCourses([{ id: docRef.id, ...newCourse, rating: 0 }, ...courses]);
            setShowCreateModal(false);
            toast.success("Course created successfully! Now add some lessons.");
        } catch (error) {
            toast.error("Failed to create course");
        }
    };

    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
        return <div className="min-h-screen flex items-center justify-center font-bold italic">Unauthorized access. Instructors only.</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 italic mb-2">Instructor Dashboard</h1>
                        <p className="text-gray-500 italic">Manage your courses, track earnings, and engage with students.</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-8">
                        <Plus className="w-5 h-5" /> Create New Course
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Students", value: "2,450", icon: <Users className="text-blue-600" />, bg: "bg-blue-50" },
                        { label: "Total Revenue", value: "$42,500", icon: <DollarSign className="text-green-600" />, bg: "bg-green-50" },
                        { label: "Active Courses", value: courses.length.toString(), icon: <BookOpen className="text-purple-600" />, bg: "bg-purple-50" },
                        { label: "Course Rating", value: "4.8", icon: <LayoutDashboard className="text-amber-600" />, bg: "bg-amber-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900 italic">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 italic">My Courses</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 italic">Course</th>
                                    <th className="px-6 py-4 italic">Category</th>
                                    <th className="px-6 py-4 italic">Price</th>
                                    <th className="px-6 py-4 italic">Students</th>
                                    <th className="px-6 py-4 italic">Rating</th>
                                    <th className="px-6 py-4 italic text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {courses.length > 0 ? courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={course.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
                                                <span className="font-bold text-gray-900 truncate max-w-xs">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{course.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">${course.price}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-600">892</td>
                                        <td className="px-6 py-4 text-sm font-bold text-amber-500">{course.rating || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                            You haven't created any courses yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-extrabold text-gray-900 italic">Create New Course</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 italic">Course Title</label>
                                    <input
                                        required
                                        value={newCourse.title}
                                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                        type="text"
                                        placeholder="e.g. Master React 19"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 italic">Category</label>
                                    <select
                                        value={newCourse.category}
                                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Business</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 italic">Description</label>
                                <textarea
                                    required
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                    rows={4}
                                    placeholder="Describe what students will learn..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 italic">Price ($)</label>
                                    <input
                                        required
                                        value={newCourse.price}
                                        onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 italic">Thumbnail URL</label>
                                    <input
                                        value={newCourse.thumbnail}
                                        onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1">Create Course</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
