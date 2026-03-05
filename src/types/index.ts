export type UserRole = "admin" | "instructor" | "student";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    createdAt: any;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    enrolledCourses: string[]; // List of course IDs
    progress: Record<string, number>; // courseId -> percentage
    createdAt: any;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    price: number;
    category: string;
    schedule: string; // e.g., "Mon, Wed, Fri 18:00"
    createdAt: any;
}

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrolledAt: any;
    progress: number;
    paymentStatus: "paid" | "partial" | "pending";
    amountPaid: number;
}

export interface Message {
    id: string;
    courseId?: string; // For group chats
    senderId: string;
    senderName: string;
    senderAvatar: string;
    message: string;
    timestamp: any;
    receiverId?: string; // For direct messages
}

export interface AnalyticsData {
    totalRevenue: number;
    totalStudents: number;
    totalInstructors: number;
    revenueByMonth: { month: string; amount: number }[];
    attendanceByCourse: { courseTitle: string; count: number }[];
}
