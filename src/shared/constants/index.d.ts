export declare const API_ROUTES: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly REFRESH: "/auth/refresh";
        readonly LOGOUT: "/auth/logout";
        readonly PROFILE: "/auth/profile";
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
        readonly RESET_PASSWORD: "/auth/reset-password";
    };
    readonly USERS: {
        readonly BASE: "/users";
        readonly BY_ID: (id: number) => string;
        readonly PROFILE: "/users/profile";
        readonly CHANGE_PASSWORD: "/users/change-password";
    };
    readonly QUESTIONS: {
        readonly BASE: "/questions";
        readonly BY_ID: (id: number) => string;
        readonly BY_SUBJECT: (subject: string) => string;
        readonly RANDOM: "/questions/random";
        readonly SEARCH: "/questions/search";
    };
    readonly EXAMS: {
        readonly BASE: "/exams";
        readonly BY_ID: (id: number) => string;
        readonly START: (id: number) => string;
        readonly SUBMIT: (id: number) => string;
        readonly RESULTS: (id: number) => string;
        readonly ATTEMPTS: "/exams/attempts";
        readonly ATTEMPT_BY_ID: (id: number) => string;
    };
    readonly MATERIALS: {
        readonly BASE: "/materials";
        readonly BY_ID: (id: number) => string;
        readonly BY_SUBJECT: (subject: string) => string;
        readonly UPLOAD: "/materials/upload";
    };
    readonly ANALYTICS: {
        readonly BASE: "/analytics";
        readonly PERFORMANCE: "/analytics/performance";
        readonly PROGRESS: "/analytics/progress";
        readonly ADMIN: "/analytics/admin";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_CREDENTIALS: "Geçersiz email veya şifre";
    readonly UNAUTHORIZED: "Bu işlem için yetkiniz bulunmamaktadır";
    readonly TOKEN_EXPIRED: "Oturum süreniz dolmuştur";
    readonly TOKEN_INVALID: "Geçersiz token";
    readonly USER_NOT_FOUND: "Kullanıcı bulunamadı";
    readonly USER_ALREADY_EXISTS: "Bu email adresi zaten kullanımda";
    readonly WEAK_PASSWORD: "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam içermelidir";
    readonly QUESTION_NOT_FOUND: "Soru bulunamadı";
    readonly INVALID_QUESTION_DATA: "Geçersiz soru verisi";
    readonly EXAM_NOT_FOUND: "Sınav bulunamadı";
    readonly EXAM_NOT_ACTIVE: "Sınav aktif değil";
    readonly EXAM_ALREADY_COMPLETED: "Bu sınavı zaten tamamladınız";
    readonly EXAM_TIME_EXPIRED: "Sınav süresi dolmuştur";
    readonly FILE_TOO_LARGE: "Dosya boyutu çok büyük";
    readonly INVALID_FILE_TYPE: "Geçersiz dosya türü";
    readonly UPLOAD_FAILED: "Dosya yüklenemedi";
    readonly VALIDATION_ERROR: "Veri doğrulama hatası";
    readonly INTERNAL_ERROR: "Sunucu hatası";
    readonly NOT_FOUND: "Kaynak bulunamadı";
    readonly RATE_LIMIT_EXCEEDED: "Çok fazla istek gönderildi. Lütfen bekleyiniz";
};
export declare const SUCCESS_MESSAGES: {
    readonly USER_CREATED: "Kullanıcı başarıyla oluşturuldu";
    readonly USER_UPDATED: "Kullanıcı bilgileri güncellendi";
    readonly USER_DELETED: "Kullanıcı silindi";
    readonly PASSWORD_CHANGED: "Şifre başarıyla değiştirildi";
    readonly QUESTION_CREATED: "Soru başarıyla oluşturuldu";
    readonly QUESTION_UPDATED: "Soru güncellendi";
    readonly QUESTION_DELETED: "Soru silindi";
    readonly EXAM_CREATED: "Sınav başarıyla oluşturuldu";
    readonly EXAM_UPDATED: "Sınav güncellendi";
    readonly EXAM_STARTED: "Sınav başlatıldı";
    readonly EXAM_SUBMITTED: "Sınav teslim edildi";
    readonly MATERIAL_UPLOADED: "Dosya başarıyla yüklendi";
    readonly MATERIAL_DELETED: "Dosya silindi";
    readonly LOGIN_SUCCESS: "Başarıyla giriş yapıldı";
    readonly LOGOUT_SUCCESS: "Başarıyla çıkış yapıldı";
};
export declare const SUBJECTS: {
    readonly TURKCE: {
        readonly key: "turkce";
        readonly name: "Türkçe";
        readonly icon: "📚";
        readonly color: "#e74c3c";
    };
    readonly MATEMATIK: {
        readonly key: "matematik";
        readonly name: "Matematik";
        readonly icon: "🧮";
        readonly color: "#3498db";
    };
    readonly FEN_BILIMLERI: {
        readonly key: "fen_bilimleri";
        readonly name: "Fen Bilimleri";
        readonly icon: "🔬";
        readonly color: "#2ecc71";
    };
    readonly SOSYAL_BILGILER: {
        readonly key: "sosyal_bilgiler";
        readonly name: "Sosyal Bilgiler";
        readonly icon: "🌍";
        readonly color: "#f39c12";
    };
    readonly INGILIZCE: {
        readonly key: "ingilizce";
        readonly name: "İngilizce";
        readonly icon: "🇬🇧";
        readonly color: "#9b59b6";
    };
    readonly DIN_KULTURU: {
        readonly key: "din_kulturu";
        readonly name: "Din Kültürü ve Ahlak Bilgisi";
        readonly icon: "☪️";
        readonly color: "#34495e";
    };
};
export declare const DIFFICULTY_LEVELS: {
    readonly EASY: {
        readonly key: "easy";
        readonly name: "Kolay";
        readonly color: "#2ecc71";
        readonly points: 1;
    };
    readonly MEDIUM: {
        readonly key: "medium";
        readonly name: "Orta";
        readonly color: "#f39c12";
        readonly points: 2;
    };
    readonly HARD: {
        readonly key: "hard";
        readonly name: "Zor";
        readonly color: "#e74c3c";
        readonly points: 3;
    };
};
export declare const USER_ROLES: {
    readonly ADMIN: {
        readonly key: "admin";
        readonly name: "Yönetici";
        readonly permissions: readonly ["all"];
    };
    readonly TEACHER: {
        readonly key: "teacher";
        readonly name: "Öğretmen";
        readonly permissions: readonly ["manage_questions", "manage_exams", "view_analytics"];
    };
    readonly STUDENT: {
        readonly key: "student";
        readonly name: "Öğrenci";
        readonly permissions: readonly ["take_exams", "view_materials"];
    };
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const FILE_UPLOAD: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: {
        readonly IMAGE: readonly ["image/jpeg", "image/png", "image/gif", "image/webp"];
        readonly DOCUMENT: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        readonly VIDEO: readonly ["video/mp4", "video/webm", "video/ogg"];
        readonly AUDIO: readonly ["audio/mpeg", "audio/wav", "audio/ogg"];
    };
};
export declare const LGS_EXAM_CONFIG: {
    readonly TOTAL_QUESTIONS: 90;
    readonly DURATION_MINUTES: 120;
    readonly SUBJECTS_DISTRIBUTION: {
        readonly TURKCE: 20;
        readonly MATEMATIK: 20;
        readonly FEN_BILIMLERI: 20;
        readonly SOSYAL_BILGILER: 10;
        readonly INGILIZCE: 10;
        readonly DIN_KULTURU: 10;
    };
    readonly PASSING_SCORE: 250;
    readonly MAX_SCORE: 500;
};
//# sourceMappingURL=index.d.ts.map