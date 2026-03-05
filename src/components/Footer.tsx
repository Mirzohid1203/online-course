import Link from "next/link";
import { Video, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">EduStream</span>
                    </Link>
                    <p className="text-sm leading-relaxed">
                        The world's leading online learning platform for students and instructors.
                        Empowering millions of learners to reach their goals.
                    </p>
                    <div className="flex gap-4">
                        <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 italic">Learning</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/courses" className="hover:text-white">All Courses</Link></li>
                        <li><Link href="#" className="hover:text-white">Learning Paths</Link></li>
                        <li><Link href="#" className="hover:text-white">Certifications</Link></li>
                        <li><Link href="#" className="hover:text-white">Corporate Training</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 italic">Instructors</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#" className="hover:text-white">Become an Instructor</Link></li>
                        <li><Link href="#" className="hover:text-white">Instructor Academy</Link></li>
                        <li><Link href="#" className="hover:text-white">Teaching Center</Link></li>
                        <li><Link href="#" className="hover:text-white">Resources</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 italic">Newsletter</h4>
                    <p className="text-sm mb-4">Get latest updates and offers directly to your inbox.</p>
                    <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-transparent border-none focus:ring-0 text-sm w-full px-2"
                        />
                        <button className="bg-blue-600 px-3 py-1.5 rounded-md text-white">
                            <Mail className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <p>&copy; 2024 EduStream Inc. All rights reserved.</p>
                <div className="flex gap-8">
                    <Link href="#" className="hover:text-white">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white">Terms of Service</Link>
                    <Link href="#" className="hover:text-white">Cookie Settings</Link>
                </div>
            </div>
        </footer>
    );
};
