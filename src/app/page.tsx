"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/course/CourseCard";
import { Play, TrendingUp, Award, Users, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const MOCK_COURSES = [
  {
    id: "1",
    title: "Mastering React 19 & Next.js 15: The Complete Guide",
    description: "Learn advanced React patterns and the latest Next.js features with real-world projects.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    instructorId: "inst1",
    category: "Development",
    price: 99.99,
    rating: 4.8,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "The Ultimate UI/UX Design Masterclass 2024",
    description: "Design stunning interfaces and master user experience through practical design systems.",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?w=800",
    instructorId: "inst2",
    category: "Design",
    price: 84.99,
    rating: 4.9,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "AI & Machine Learning: Zero to Mastery",
    description: "A comprehensive journey into AI, Python, and neural networks for absolute beginners.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    instructorId: "inst3",
    category: "Data Science",
    price: 129.99,
    rating: 4.7,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Digital Marketing Strategy: Growth Hacking",
    description: "Scale your business with advanced SEO, PPC, and content marketing strategies.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    instructorId: "inst4",
    category: "Marketing",
    price: 49.99,
    rating: 4.6,
    createdAt: new Date(),
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden py-24">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                Revolutionizing Education
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
                Master New Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">EduStream</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl">
                Join 50 million+ learners around the world and start learning today.
                Expert-led courses, real-time mentorship, and industry-recognized certificates.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto px-10">
                  <Link href="/courses">Get Started</Link>
                </Button>
                <button className="flex items-center gap-3 text-gray-900 font-bold hover:text-blue-600 transition-colors group">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-600 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  Watch Overview
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-500">Expert Instructors</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">200K+</p>
                  <p className="text-sm text-gray-500">Courses</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
                alt="Students learning"
                className="rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-gray-100 max-w-[240px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="text-green-600 w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Career Growth</p>
                </div>
                <p className="text-xs text-gray-500">Boost your salary by up to 40% after completing our paths.</p>
              </div>
              <div className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-gray-100 max-w-[240px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="text-blue-600 w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Certified Experts</p>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-bold text-gray-500">+12k</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 italic">Popular Courses</h2>
            <p className="text-gray-600">Hand-picked selections from our best instructors.</p>
          </div>
          <Link href="/courses" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            Browse All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course as any} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 italic">Why Choose EduStream?</h2>
            <p className="text-gray-600 italic">We provide the most effective learning experience with features designed for student success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Expert Mentors",
                desc: "Learn from industry professionals who have years of experience at top companies."
              },
              {
                icon: <Play className="w-8 h-8 text-purple-600" />,
                title: "Interactive Learning",
                desc: "Go beyond videos with hands-on projects, real-time chat, and collaborative tools."
              },
              {
                icon: <Award className="w-8 h-8 text-amber-600" />,
                title: "Global Recognition",
                desc: "Our certificates are recognized by leading tech companies and added to your LinkedIn."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed italic">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
