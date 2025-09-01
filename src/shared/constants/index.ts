export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password'
  },
  QUESTIONS: {
    BASE: '/questions',
    BY_ID: (id: number) => `/questions/${id}`,
    BY_SUBJECT: (subject: string) => `/questions/subject/${subject}`,
    RANDOM: '/questions/random',
    SEARCH: '/questions/search'
  },
  EXAMS: {
    BASE: '/exams',
    BY_ID: (id: number) => `/exams/${id}`,
    START: (id: number) => `/exams/${id}/start`,
    SUBMIT: (id: number) => `/exams/${id}/submit`,
    RESULTS: (id: number) => `/exams/${id}/results`,
    ATTEMPTS: '/exams/attempts',
    ATTEMPT_BY_ID: (id: number) => `/exams/attempts/${id}`
  },
  MATERIALS: {
    BASE: '/materials',
    BY_ID: (id: number) => `/materials/${id}`,
    BY_SUBJECT: (subject: string) => `/materials/subject/${subject}`,
    UPLOAD: '/materials/upload'
  },
  ANALYTICS: {
    BASE: '/analytics',
    PERFORMANCE: '/analytics/performance',
    PROGRESS: '/analytics/progress',
    ADMIN: '/analytics/admin'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Geçersiz email veya şifre',
  UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır',
  TOKEN_EXPIRED: 'Oturum süreniz dolmuştur',
  TOKEN_INVALID: 'Geçersiz token',
  
  // User errors
  USER_NOT_FOUND: 'Kullanıcı bulunamadı',
  USER_ALREADY_EXISTS: 'Bu email adresi zaten kullanımda',
  WEAK_PASSWORD: 'Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam içermelidir',
  
  // Question errors
  QUESTION_NOT_FOUND: 'Soru bulunamadı',
  INVALID_QUESTION_DATA: 'Geçersiz soru verisi',
  
  // Exam errors
  EXAM_NOT_FOUND: 'Sınav bulunamadı',
  EXAM_NOT_ACTIVE: 'Sınav aktif değil',
  EXAM_ALREADY_COMPLETED: 'Bu sınavı zaten tamamladınız',
  EXAM_TIME_EXPIRED: 'Sınav süresi dolmuştur',
  
  // File upload errors
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük',
  INVALID_FILE_TYPE: 'Geçersiz dosya türü',
  UPLOAD_FAILED: 'Dosya yüklenemedi',
  
  // General errors
  VALIDATION_ERROR: 'Veri doğrulama hatası',
  INTERNAL_ERROR: 'Sunucu hatası',
  NOT_FOUND: 'Kaynak bulunamadı',
  RATE_LIMIT_EXCEEDED: 'Çok fazla istek gönderildi. Lütfen bekleyiniz'
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Kullanıcı başarıyla oluşturuldu',
  USER_UPDATED: 'Kullanıcı bilgileri güncellendi',
  USER_DELETED: 'Kullanıcı silindi',
  PASSWORD_CHANGED: 'Şifre başarıyla değiştirildi',
  
  QUESTION_CREATED: 'Soru başarıyla oluşturuldu',
  QUESTION_UPDATED: 'Soru güncellendi',
  QUESTION_DELETED: 'Soru silindi',
  
  EXAM_CREATED: 'Sınav başarıyla oluşturuldu',
  EXAM_UPDATED: 'Sınav güncellendi',
  EXAM_STARTED: 'Sınav başlatıldı',
  EXAM_SUBMITTED: 'Sınav teslim edildi',
  
  MATERIAL_UPLOADED: 'Dosya başarıyla yüklendi',
  MATERIAL_DELETED: 'Dosya silindi',
  
  LOGIN_SUCCESS: 'Başarıyla giriş yapıldı',
  LOGOUT_SUCCESS: 'Başarıyla çıkış yapıldı'
} as const;

export const SUBJECTS = {
  TURKCE: { 
    key: 'turkce', 
    name: 'Türkçe',
    icon: '📚',
    color: '#e74c3c'
  },
  MATEMATIK: { 
    key: 'matematik', 
    name: 'Matematik',
    icon: '🧮',
    color: '#3498db'
  },
  FEN_BILIMLERI: { 
    key: 'fen_bilimleri', 
    name: 'Fen Bilimleri',
    icon: '🔬',
    color: '#2ecc71'
  },
  SOSYAL_BILGILER: { 
    key: 'sosyal_bilgiler', 
    name: 'Sosyal Bilgiler',
    icon: '🌍',
    color: '#f39c12'
  },
  INGILIZCE: { 
    key: 'ingilizce', 
    name: 'İngilizce',
    icon: '🇬🇧',
    color: '#9b59b6'
  },
  DIN_KULTURU: { 
    key: 'din_kulturu', 
    name: 'Din Kültürü ve Ahlak Bilgisi',
    icon: '☪️',
    color: '#34495e'
  }
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: { key: 'easy', name: 'Kolay', color: '#2ecc71', points: 1 },
  MEDIUM: { key: 'medium', name: 'Orta', color: '#f39c12', points: 2 },
  HARD: { key: 'hard', name: 'Zor', color: '#e74c3c', points: 3 }
} as const;

export const USER_ROLES = {
  ADMIN: { key: 'admin', name: 'Yönetici', permissions: ['all'] },
  TEACHER: { key: 'teacher', name: 'Öğretmen', permissions: ['manage_questions', 'manage_exams', 'view_analytics'] },
  STUDENT: { key: 'student', name: 'Öğrenci', permissions: ['take_exams', 'view_materials'] }
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
} as const;

export const LGS_EXAM_CONFIG = {
  TOTAL_QUESTIONS: 90,
  DURATION_MINUTES: 120,
  SUBJECTS_DISTRIBUTION: {
    TURKCE: 20,
    MATEMATIK: 20,
    FEN_BILIMLERI: 20,
    SOSYAL_BILGILER: 10,
    INGILIZCE: 10,
    DIN_KULTURU: 10
  },
  PASSING_SCORE: 250,
  MAX_SCORE: 500
} as const;