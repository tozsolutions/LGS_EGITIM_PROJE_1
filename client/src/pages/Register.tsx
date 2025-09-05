import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student',
    grade: 8,
    school: '',
    parentEmail: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...userData } = formData
      await register(userData)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <UserPlus className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Hesap oluştur
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Giriş yap
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-error-50 p-4">
              <div className="text-sm text-error-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="input mt-1"
                  placeholder="Adınız"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Soyad
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="input mt-1"
                  placeholder="Soyadınız"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input mt-1"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Kullanıcı adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input mt-1"
                placeholder="kullanici_adi"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Hesap türü
              </label>
              <select
                id="role"
                name="role"
                className="input mt-1"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Öğrenci</option>
                <option value="teacher">Öğretmen</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Sınıf
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    className="input mt-1"
                    value={formData.grade}
                    onChange={handleChange}
                  >
                    {[6, 7, 8, 9].map(grade => (
                      <option key={grade} value={grade}>{grade}. Sınıf</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                    Okul (İsteğe bağlı)
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    className="input mt-1"
                    placeholder="Okul adınız"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                    Veli E-postası (İsteğe bağlı)
                  </label>
                  <input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    className="input mt-1"
                    placeholder="veli@email.com"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-10"
                  placeholder="En az 8 karakter"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input mt-1"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Hesap oluşturuluyor...
                </div>
              ) : (
                'Hesap Oluştur'
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Hesap oluşturarak{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Kullanım Koşulları
            </a>
            {' '}ve{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Gizlilik Politikası
            </a>
            'nı kabul etmiş olursunuz.
          </div>
        </form>
      </div>
    </div>
  )
}