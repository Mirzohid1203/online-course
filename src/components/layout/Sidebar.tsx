"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/components/ui/Button";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["admin", "instructor"] },
    { icon: Users, label: "Students", href: "/students", roles: ["admin", "instructor"] },
    { icon: BookOpen, label: "Courses", href: "/courses", roles: ["admin", "instructor", "student"] },
    { icon: CreditCard, label: "Enrollments", href: "/enrollments", roles: ["admin"] },
    { icon: MessageSquare, label: "Chat", href: "/chat", roles: ["admin", "instructor", "student"] },
    { icon: BarChart3, label: "Analytics", href: "/analytics", roles: ["admin"] },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

    return (
        <aside
            className={cn(
                "h-screen bg-gray-900 text-gray-400 flex flex-col transition-all duration-300 border-r border-gray-800",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <span className="text-xl font-black text-white italic tracking-tighter">CRM<span className="text-blue-500">PRO</span></span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-8">
                {filteredMenu.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-blue-400")} />
                            {!isCollapsed && <span className="font-bold italic text-sm">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-800">
                <div className={cn("flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-800/50", isCollapsed && "justify-center")}>
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name}
                        className="w-8 h-8 rounded-full ring-2 ring-gray-700"
                        alt="avatar"
                    />
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate italic">{user?.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{user?.role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 mt-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-bold italic text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
};
