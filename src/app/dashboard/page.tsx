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
    doc,
    getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CourseCard } from "@/components/course/CourseCard";
import {
    BookOpen,
    Clock,
    Award,
    Settings,
    PlusCircle,
    LayoutDashboard,
    User,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchEnrolledCourses = async () => {
            try {
                const enrollmentsRef = collection(db, "enrollments");
                const q = query(enrollmentsRef, where("userId", "==", user.id));
                const querySnapshot = await getDocs(q);

                const courses = await Promise.all(
                    querySnapshot.docs.map(async (enrollmentDoc) => {
                        const courseId = enrollmentDoc.data().courseId;
                        const courseSnap = await getDoc(doc(db, "courses", courseId));
                        if (courseSnap.exists()) {
                            return {
                                id: courseSnap.id,
                                ...courseSnap.data(),
                                progress: enrollmentDoc.data().progress || []
                            };
                        }
                        return null;
                    })
                );

                setEnrolledCourses(courses.filter(c => c !== null));
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold italic">Please sign in to access dashboard.</div>;

    return (
        <main className="min-h-screen bg-gray-50 pt-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Dashboard Sidebar */}
                    <aside className="lg:w-64 space-y-2">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8 text-center">
                            <img
                                src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                                alt={user.name}
                                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-100"
                            />
                            <h2 className="font-extrabold text-gray-900 italic">{user.name}</h2>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">{user.role}</p>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold italic">
                                <LayoutDashboard className="w-5 h-5" /> My Learning
                            </Link>
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white transition-colors italic">
                                <User className="w-5 h-5" /> Profile
                            </Link>
                            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white transition-colors italic">
                                <Settings className="w-5 h-5" /> Settings
                            </Link>
                            {user.role === "instructor" && (
                                <Link href="/instructor" className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors italic">
                                    <PlusCircle className="w-5 h-5" /> Instructor Panel
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors italic"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Dashboard Content */}
                    <div className="flex-1">
                        <header className="mb-12">
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 italic">Welcome back, {user.name.split(' ')[0]}!</h1>
                            <p className="text-gray-500 italic">You have {enrolledCourses.length} courses in progress. Keep up the great work!</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                                <p className="text-2xl font-extrabold text-gray-900 italic">{enrolledCourses.length}</p>
                                <p className="text-sm text-gray-500 italic">Enrolled Courses</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                <Award className="w-8 h-8 text-green-600 mx-auto mb-4" />
                                <p className="text-2xl font-extrabold text-gray-900 italic">0</p>
                                <p className="text-sm text-gray-500 italic">Certificates Earned</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                                <p className="text-2xl font-extrabold text-gray-900 italic">12h</p>
                                <p className="text-sm text-gray-500 italic">Learning Time</p>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-8 italic">My Courses</h2>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                                ))}
                            </div>
                        ) : enrolledCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {enrolledCourses.map((course) => (
                                    <div key={course.id} className="relative group">
                                        <CourseCard course={course} />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-blue-600 shadow-sm">
                                            {Math.round((course.progress?.length / 10) * 100) || 0}% Done
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No courses yet</h3>
                                <p className="text-gray-500 mb-8 italic">Start your learning journey by exploring our catalog.</p>
                                <Button>
                                    <Link href="/courses">Browse Courses</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
