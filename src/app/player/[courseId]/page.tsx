"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/Button";
import {
    ChevronLeft,
    ChevronRight,
    Menu,
    PlayCircle,
    CheckCircle,
    MessageSquare,
    FileText,
    Award,
    Video
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function PlayerPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { getCourseById, getLessons } = useCourses();

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            const courseData = await getCourseById(courseId as string);
            const lessonsData = await getLessons(courseId as string);

            if (courseData) {
                setCourse(courseData);
                setLessons(lessonsData);

                // Fetch enrollments to get progress
                const enrollmentSnap = await getDoc(doc(db, "enrollments", `${user.id}_${courseId}`));
                if (enrollmentSnap.exists()) {
                    setCompletedLessons(enrollmentSnap.data().progress || []);
                } else {
                    router.push(`/courses/${courseId}`);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [courseId, user]);

    const handleLessonComplete = async (lessonId: string) => {
        if (completedLessons.includes(lessonId)) return;

        try {
            const enrollmentRef = doc(db, "enrollments", `${user?.id}_${courseId}`);
            await updateDoc(enrollmentRef, {
                progress: arrayUnion(lessonId)
            });
            setCompletedLessons([...completedLessons, lessonId]);
            toast.success("Lesson marked as completed!");

            // If last lesson, show certificate toast
            if (completedLessons.length + 1 === lessons.length) {
                toast.success("Congratulations! You've completed the course!", { duration: 10000 });
            }
        } catch (error) {
            toast.error("Failed to update progress");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold italic text-blue-600">Initializing player...</div>;
    if (lessons.length === 0) return <div className="min-h-screen flex items-center justify-center font-bold italic">No lessons found for this course.</div>;

    const currentLesson = lessons[currentLessonIdx];

    const getYoutubeEmbedUrl = (url: string) => {
        if (url.includes("youtube.com/watch?v=")) {
            return url.replace("watch?v=", "embed/");
        }
        if (url.includes("youtu.be/")) {
            return url.replace("youtu.be/", "youtube.com/embed/");
        }
        return url;
    };

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/* Navbar */}
            <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 pr-4 border-r border-gray-200">
                        <ChevronLeft />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-gray-900 truncate max-w-md italic">{course.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 mr-4">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-600 italic">
                            {Math.round((completedLessons.length / lessons.length) * 100)}% Complete
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/certificate/${courseId}`)}
                        disabled={completedLessons.length < lessons.length}
                        className="hidden sm:flex items-center gap-2"
                    >
                        <Award className="w-4 h-4" />
                        Claim Certificate
                    </Button>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden"
                    >
                        <Menu />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-12">
                            <iframe
                                src={getYoutubeEmbedUrl(currentLesson.videoUrl)}
                                className="w-full h-full"
                                allowFullScreen
                                title={currentLesson.title}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 italic">{currentLesson.title}</h2>
                                <p className="text-gray-500 text-sm">Lesson {currentLessonIdx + 1} of {lessons.length}</p>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    disabled={currentLessonIdx === 0}
                                    onClick={() => setCurrentLessonIdx(prev => prev - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleLessonComplete(currentLesson.id);
                                        if (currentLessonIdx < lessons.length - 1) {
                                            setCurrentLessonIdx(prev => prev + 1);
                                        }
                                    }}
                                >
                                    {completedLessons.includes(currentLesson.id) ? "Next Lesson" : "Complete & Next"}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <div className="flex gap-8 mb-8 border-b border-gray-100">
                                <button className="pb-4 border-b-2 border-blue-600 text-blue-600 font-bold italic">Overview</button>
                                <button onClick={() => router.push(`/chat/${courseId}`)} className="pb-4 text-gray-500 font-medium hover:text-blue-600 italic flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Discussion
                                </button>
                                <button className="pb-4 text-gray-500 font-medium hover:text-blue-600 italic flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Resources
                                </button>
                            </div>

                            <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                                {currentLesson.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lesson Sidebar */}
                <aside
                    className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 border-l border-gray-200 transition-all duration-300 overflow-y-auto flex-shrink-0`}
                >
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-extrabold text-gray-900 italic">Course Content</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {lessons.map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                onClick={() => setCurrentLessonIdx(idx)}
                                className={`w-full p-4 flex gap-4 text-left transition-colors ${currentLessonIdx === idx ? 'bg-white border-l-4 border-blue-600' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {completedLessons.includes(lesson.id) ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <PlayCircle className={`w-5 h-5 ${currentLessonIdx === idx ? 'text-blue-600' : 'text-gray-400'}`} />
                                    )}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${currentLessonIdx === idx ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {idx + 1}. {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 italic">10:45</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
