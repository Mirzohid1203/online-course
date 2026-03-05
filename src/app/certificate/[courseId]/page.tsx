"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Award, Download, Share2, Youtube, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CertificatePage() {
    const { courseId } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            try {
                const courseSnap = await getDoc(doc(db, "courses", courseId as string));
                const enrollmentSnap = await getDoc(doc(db, "enrollments", `${user.id}_${courseId}`));

                if (courseSnap.exists()) {
                    setCourse(courseSnap.data());

                    // Check if all lessons completed (mocking with a simple check)
                    const progress = enrollmentSnap.data()?.progress || [];
                    // In a real app we'd compare progress length with lessons length
                    setIsCompleted(progress.length > 0);
                }
            } catch (error) {
                console.error("Error loading certificate:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, user]);

    const handleDownload = () => {
        toast.success("Generating your PDF certificate...");
        // Mock download
        setTimeout(() => {
            window.print();
        }, 1000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold italic text-blue-600">Verifying completion...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center font-bold italic">Course not found.</div>;

    return (
        <main className="min-h-screen bg-gray-50 pt-16 print:pt-0">
            <div className="print:hidden">
                <Navbar />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-20">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row print:shadow-none print:border-0">
                    {/* Certificate UI */}
                    <div className="flex-1 p-12 md:p-20 relative bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                        {/* Corner patterns */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-blue-600 rounded-tl-[40px] opacity-20" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-blue-600 rounded-br-[40px] opacity-20" />

                        <div className="text-center space-y-12">
                            <div className="flex justify-center">
                                <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200">
                                    <Award className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-blue-600 font-extrabold uppercase tracking-[0.3em] text-sm">Certificate of Completion</h3>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 italic leading-tight">
                                    This is to certify that
                                </h1>
                                <h2 className="text-5xl md:text-7xl font-[900] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 underline decoration-blue-500 decoration-4 underline-offset-8">
                                    {user?.name}
                                </h2>
                            </div>

                            <p className="text-xl text-gray-600 italic leading-relaxed max-w-2xl mx-auto">
                                has successfully completed all requirements for the professional online course
                                <br />
                                <span className="text-gray-900 font-bold group hover:text-blue-600 transition-colors cursor-default block mt-4">
                                    "{course.title}"
                                </span>
                            </p>

                            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-200">
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="font-bold text-gray-900 italic">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Certificate ID</p>
                                    <p className="font-bold text-gray-900 italic">CERT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-2 pt-8">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                                <span className="text-sm font-bold text-gray-500 italic">Verified by EduStream Education Authority</span>
                            </div>
                        </div>
                    </div>

                    {/* Action sidebar */}
                    <div className="md:w-80 bg-gray-900 text-white p-12 flex flex-col justify-center print:hidden">
                        <h3 className="text-2xl font-extrabold italic mb-8">Great Achievement!</h3>
                        <p className="text-gray-400 text-sm mb-12 italic leading-relaxed">
                            Your dedication and hard work have paid off. Share your success with your professional network.
                        </p>

                        <div className="space-y-4">
                            <Button onClick={handleDownload} className="w-full py-4 rounded-xl flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" /> Download PDF
                            </Button>
                            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800 py-4 rounded-xl flex items-center justify-center gap-2">
                                <Share2 className="w-5 h-5" /> Share on LinkedIn
                            </Button>
                        </div>

                        <div className="mt-12 pt-12 border-t border-gray-800">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-bold italic">Skills Validated</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["React", "TypeScript", "Next.js", "Web Dev"].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-gray-800 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="print:hidden">
                <Footer />
            </div>
        </main>
    );
}
