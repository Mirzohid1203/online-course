"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/Button";
import { Search, Bell, Menu, X, LogOut, User, Video, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
    const { user, signIn, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">EduStream</span>
                    </Link>

                    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for anything..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 mr-4">
                        <Link href="/courses" className="hover:text-blue-600">Explore</Link>
                        {user?.role === "instructor" && (
                            <Link href="/instructor" className="hover:text-blue-600">Instructor</Link>
                        )}
                        {user?.role === "admin" && (
                            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <button className="text-gray-500 hover:text-gray-700 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2"
                                >
                                    <img
                                        src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border border-gray-200"
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Button onClick={signIn}>Sign In</Button>
                    )}

                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
                    <div className="relative bg-gray-100 rounded-full px-4 py-2">
                        <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full pl-6"
                        />
                    </div>
                    <div className="flex flex-col gap-4 text-sm font-medium text-gray-600">
                        <Link href="/courses">Explore</Link>
                        {user && (
                            <>
                                <Link href="/dashboard">Dashboard</Link>
                                {user.role === "instructor" && <Link href="/instructor">Instructor Panel</Link>}
                            </>
                        )}
                        {!user && <button onClick={signIn} className="text-blue-600 text-left">Sign In</button>}
                    </div>
                </div>
            )}
        </nav>
    );
};
