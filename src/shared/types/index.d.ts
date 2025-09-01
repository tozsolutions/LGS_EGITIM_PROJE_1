export interface User {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Student extends User {
    grade: number;
    school?: string;
    parentEmail?: string;
    totalExamsTaken: number;
    averageScore: number;
}
export interface Teacher extends User {
    subject: string;
    experience: number;
    qualification: string;
}
export interface Admin extends User {
    permissions: AdminPermission[];
}
export declare enum UserRole {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student"
}
export declare enum AdminPermission {
    MANAGE_USERS = "manage_users",
    MANAGE_QUESTIONS = "manage_questions",
    MANAGE_EXAMS = "manage_exams",
    VIEW_ANALYTICS = "view_analytics",
    MANAGE_CONTENT = "manage_content"
}
export interface Question {
    id: number;
    subject: Subject;
    topic: string;
    difficulty: Difficulty;
    content: string;
    options: QuestionOption[];
    correctAnswers: number[];
    explanation: string;
    points: number;
    timeLimit: number;
    createdBy: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface QuestionOption {
    id: number;
    text: string;
    isCorrect: boolean;
}
export declare enum Subject {
    TURKCE = "turkce",
    MATEMATIK = "matematik",
    FEN_BILIMLERI = "fen_bilimleri",
    SOSYAL_BILGILER = "sosyal_bilgiler",
    INGILIZCE = "ingilizce",
    DIN_KULTURU = "din_kulturu"
}
export declare enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export interface Exam {
    id: number;
    title: string;
    description: string;
    duration: number;
    totalQuestions: number;
    questions: Question[];
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExamAttempt {
    id: number;
    examId: number;
    studentId: number;
    answers: ExamAnswer[];
    score: number;
    percentage: number;
    timeSpent: number;
    completedAt: Date;
    createdAt: Date;
}
export interface ExamAnswer {
    questionId: number;
    selectedOptions: number[];
    isCorrect: boolean;
    points: number;
    timeSpent: number;
}
export interface StudyMaterial {
    id: number;
    title: string;
    subject: Subject;
    type: MaterialType;
    content: string;
    filePath?: string;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum MaterialType {
    TEXT = "text",
    PDF = "pdf",
    VIDEO = "video",
    AUDIO = "audio",
    IMAGE = "image"
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    grade?: number;
    school?: string;
    parentEmail?: string;
}
export interface Performance {
    subject: Subject;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
    improvementTrend: number;
}
export interface Analytics {
    totalUsers: number;
    totalExams: number;
    totalQuestions: number;
    averageScore: number;
    mostDifficultSubject: Subject;
    topPerformers: Student[];
    recentActivity: ActivityLog[];
}
export interface ActivityLog {
    id: number;
    userId: number;
    action: string;
    details: string;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map