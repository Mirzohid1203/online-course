"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/course/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { Search, Filter, ChevronDown, Rocket, BookOpen, Heart, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["All", "Development", "Design", "Data Science", "Marketing", "Business", "Personal Development"];

export default function CoursesPage() {
    const { courses, loading, fetchCourses } = useCourses();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCourses(selectedCategory);
    }, [selectedCategory]);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white pt-16">
            <Navbar />

            <header className="bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Find the Perfect Course for You
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
                        Over 200,000 courses in development, business, design, and more.
                        Taught by experts from top-tier companies.
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 space-y-8 flex-shrink-0">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Categories
                            </h3>
                            <div className="space-y-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
                            <Rocket className="w-10 h-10 mb-4 mx-auto" />
                            <h4 className="font-bold mb-2">Advance Your Career</h4>
                            <p className="text-xs text-blue-100 mb-4">Get unlimited access to top courses with Pro membership.</p>
                            <Button variant="secondary" size="sm" className="w-full">Upgrade Now</Button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none italic"
                                />
                            </div>

                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                                <span>Sort by:</span>
                                <button className="flex items-center gap-1 text-gray-900 font-bold">
                                    Newest First <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
                                ))}
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-4">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No courses found</h3>
                                <p className="text-gray-500 italic">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
