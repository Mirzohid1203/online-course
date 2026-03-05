export type UserRole = "student" | "instructor" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    createdAt: any; // Firestore Timestamp
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructorId: string;
    instructorName?: string;
    category: string;
    price: number;
    rating: number;
    createdAt: any;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    description: string;
    videoUrl: string;
    order: number;
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    progress: string[]; // IDs of completed lessons
    enrolledAt: any;
}

export interface Review {
    id: string;
    userId: string;
    courseId: string;
    rating: number;
    comment: string;
    userName?: string;
    userAvatar?: string;
}

export interface Message {
    id: string;
    courseId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    message: string;
    timestamp: any;
}

export interface Certificate {
    id: string;
    userId: string;
    courseId: string;
    courseTitle: string;
    userName: string;
    issueDate: any;
    certificateUrl: string;
}
