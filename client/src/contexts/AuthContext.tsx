import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../lib/api'

interface User {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  role: 'admin' | 'teacher' | 'student'
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await authApi.getProfile()
          setUser(response.data.data)
        } catch (error) {
          console.error('Failed to get user profile:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      const { user: userData, tokens } = response.data.data

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Giriş başarısız')
    }
  }

  const register = async (userData: any) => {
    try {
      await authApi.register(userData)
      // After successful registration, automatically log in
      await login(userData.email, userData.password)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Kayıt başarısız')
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    
    // Call logout endpoint (fire and forget)
    authApi.logout().catch(() => {
      // Ignore errors on logout
    })
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}