import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (userData: {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
    role?: string
    grade?: number
    school?: string
    parentEmail?: string
  }) => api.post('/auth/register', userData),

  getProfile: () => api.get('/auth/profile'),

  logout: () => api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
}

// Questions API
export const questionsApi = {
  getQuestions: (params?: {
    page?: number
    limit?: number
    subject?: string
    difficulty?: string
    topic?: string
    search?: string
  }) => api.get('/questions', { params }),

  getQuestion: (id: number) => api.get(`/questions/${id}`),

  createQuestion: (questionData: {
    subject: string
    topic: string
    difficulty: string
    content: string
    options: Array<{ text: string; isCorrect: boolean }>
    explanation?: string
    points?: number
    timeLimit?: number
  }) => api.post('/questions', questionData),

  updateQuestion: (id: number, questionData: any) =>
    api.put(`/questions/${id}`, questionData),

  deleteQuestion: (id: number) => api.delete(`/questions/${id}`),

  getRandomQuestions: (params?: {
    subject?: string
    difficulty?: string
    count?: number
  }) => api.get('/questions/random', { params }),
}

// Exams API
export const examsApi = {
  getExams: (params?: { page?: number; limit?: number }) =>
    api.get('/exams', { params }),

  getExam: (id: number) => api.get(`/exams/${id}`),

  createExam: (examData: any) => api.post('/exams', examData),

  updateExam: (id: number, examData: any) => api.put(`/exams/${id}`, examData),

  deleteExam: (id: number) => api.delete(`/exams/${id}`),

  startExam: (id: number) => api.post(`/exams/${id}/start`),

  submitExam: (id: number, answers: any) =>
    api.post(`/exams/${id}/submit`, { answers }),

  getExamResults: (id: number) => api.get(`/exams/${id}/results`),
}

export default api