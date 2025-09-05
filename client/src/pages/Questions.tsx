import React, { useState, useEffect } from 'react'
import { questionsApi } from '../lib/api'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface Question {
  id: number
  subject: string
  topic: string
  difficulty: string
  content: string
  options: Array<{ id: number; text: string; isCorrect: boolean }>
  explanation?: string
  points: number
  timeLimit: number
  createdBy: { firstName: string; lastName: string }
  createdAt: string
}

export const Questions: React.FC = () => {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    difficulty: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const subjects = [
    { value: 'turkce', label: 'Türkçe' },
    { value: 'matematik', label: 'Matematik' },
    { value: 'fen_bilimleri', label: 'Fen Bilimleri' },
    { value: 'sosyal_bilgiler', label: 'Sosyal Bilgiler' },
    { value: 'ingilizce', label: 'İngilizce' },
    { value: 'din_kulturu', label: 'Din Kültürü' }
  ]

  const difficulties = [
    { value: 'easy', label: 'Kolay' },
    { value: 'medium', label: 'Orta' },
    { value: 'hard', label: 'Zor' }
  ]

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await questionsApi.getQuestions(filters)
      setQuestions(response.data.data)
      setPagination(response.data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sorular yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [filters])

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'badge-success'
      case 'medium': return 'badge-warning'
      case 'hard': return 'badge-error'
      default: return 'badge-primary'
    }
  }

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      turkce: 'bg-red-100 text-red-800',
      matematik: 'bg-blue-100 text-blue-800',
      fen_bilimleri: 'bg-green-100 text-green-800',
      sosyal_bilgiler: 'bg-orange-100 text-orange-800',
      ingilizce: 'bg-purple-100 text-purple-800',
      din_kulturu: 'bg-gray-100 text-gray-800'
    }
    return colors[subject] || 'badge-primary'
  }

  if (loading && questions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Soru Bankası</h1>
          <p className="text-gray-600 mt-1">
            Tüm derslerden binlerce soru ile pratik yapın
          </p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Soru
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Soru ara..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <select
              className="input"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            >
              <option value="">Tüm Dersler</option>
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
            
            <select
              className="input"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">Tüm Zorluklar</option>
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
            
            <select
              className="input"
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            >
              <option value={10}>10 soru</option>
              <option value={20}>20 soru</option>
              <option value={50}>50 soru</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error-50 p-4 mb-6">
          <div className="text-sm text-error-700">{error}</div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="card hover:shadow-md transition-shadow">
            <div className="card-content">
              <div className="flex justify-between items-start mb-4">
                <div className="flex space-x-2">
                  <span className={`badge ${getSubjectColor(question.subject)}`}>
                    {subjects.find(s => s.value === question.subject)?.label}
                  </span>
                  <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                    {difficulties.find(d => d.value === question.difficulty)?.label}
                  </span>
                  <span className="badge badge-primary">
                    {question.points} puan
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="font-medium text-gray-900 mb-1">{question.topic}</h3>
                <p className="text-gray-700 mb-3">{question.content}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {question.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-2 rounded border text-sm ${
                      option.isCorrect
                        ? 'bg-success-50 border-success-200 text-success-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option.text}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {question.createdBy.firstName} {question.createdBy.lastName}
                </span>
                <span>
                  {new Date(question.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            className="btn-outline"
            disabled={pagination.page === 1}
            onClick={() => handleFilterChange('page', pagination.page - 1)}
          >
            Önceki
          </button>
          
          <span className="text-sm text-gray-600">
            Sayfa {pagination.page} / {pagination.totalPages}
          </span>
          
          <button
            className="btn-outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handleFilterChange('page', pagination.page + 1)}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  )
}