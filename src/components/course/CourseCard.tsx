"use client";

import Link from "next/link";
import { Star, Clock, Users, PlayCircle } from "lucide-react";
import { Course } from "@/types";

interface CourseCardProps {
    course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Link href={`/courses/${course.id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {course.category}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{course.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">(1.2k reviews)</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <PlayCircle className="w-4 h-4" />
                            <span>12 Lessons</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
