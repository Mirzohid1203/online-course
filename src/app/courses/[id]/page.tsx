"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Star, Clock, Globe, Shield, PlayCircle, CheckCircle, Share2, Heart, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, signIn } = useAuth();
    const { getCourseById, getLessons } = useCourses();

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const courseData = await getCourseById(id as string);
            if (courseData) {
                setCourse(courseData);
                const lessonsData = await getLessons(id as string);
                setLessons(lessonsData);

                if (user) {
                    const enrollmentSnap = await getDoc(doc(db, "enrollments", `${user.id}_${id}`));
                    setIsEnrolled(enrollmentSnap.exists());
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) {
            toast.error("Please sign in to enroll");
            signIn();
            return;
        }

        try {
            await setDoc(doc(db, "enrollments", `${user.id}_${id}`), {
                userId: user.id,
                courseId: id,
                progress: [],
                enrolledAt: serverTimestamp(),
            });
            setIsEnrolled(true);
            toast.success("Successfully enrolled!");
            router.push(`/player/${id}`);
        } catch (error) {
            toast.error("Failed to enroll. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-blue-600 font-bold">Loading course details...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center italic font-bold">Course not found</div>;

    return (
        <main className="min-h-screen bg-white pt-16">
            <Navbar />

            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-6 italic">
                            Courses {">"} {course.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight italic">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed italic">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                <span className="font-bold text-amber-400">{course.rating}</span>
                                <span className="text-gray-400">(2,456 ratings)</span>
                            </div>
                            <div className="text-gray-400">Created by <span className="text-blue-400 font-bold hover:underline cursor-pointer">Sarah Johnson</span></div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Globe className="w-4 h-4" />
                                English
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-2xl p-2 sticky top-24 border border-gray-100">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer">
                                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="text-3xl font-extrabold text-gray-900 mb-6 italic">
                                    {course.price === 0 ? "Free" : `$${course.price}`}
                                </div>

                                <div className="space-y-4">
                                    {isEnrolled ? (
                                        <Button className="w-full py-4 rounded-xl" size="lg" onClick={() => router.push(`/player/${id}`)}>
                                            Continue Learning
                                        </Button>
                                    ) : (
                                        <Button className="w-full py-4 rounded-xl" size="lg" onClick={handleEnroll}>
                                            Enroll Now
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full py-4 rounded-xl font-bold italic">Add to Wishlist</Button>
                                </div>

                                <div className="mt-8 space-y-4 text-sm text-gray-600">
                                    <p className="font-bold text-gray-900 italic">This course includes:</p>
                                    <div className="flex items-center gap-3">
                                        <PlayCircle className="w-4 h-4" />
                                        <span>12 hours on-demand video</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4" />
                                        <span>Life-time access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="w-4 h-4" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="lg:w-2/3">
                    <section className="mb-16">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 italic">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 italic">Core principles and practical implementation of industry standard patterns.</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 italic">Curriculum</h2>
                        <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200">
                            {lessons.length > 0 ? lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                                            <p className="text-sm text-gray-500">{lesson.description.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                    <PlayCircle className="w-5 h-5 text-gray-400" />
                                </div>
                            )) : (
                                <div className="p-12 text-center text-gray-500 italic">No lessons available for this course yet.</div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
