import React from 'react'
import { Clock, Users, FileText, Play } from 'lucide-react'

export const Exams: React.FC = () => {
  const exams = [
    {
      id: 1,
      title: 'LGS Genel Deneme Sınavı 8',
      description: 'Tüm konuları kapsayan kapsamlı deneme sınavı',
      duration: 120,
      totalQuestions: 90,
      subjects: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Din Kültürü'],
      difficulty: 'Orta',
      participants: 1250,
      averageScore: 72.5,
      isActive: true,
      startDate: '2024-01-15T09:00:00Z',
      endDate: '2024-01-15T23:59:59Z'
    },
    {
      id: 2,
      title: 'Matematik Konu Tarama Sınavı',
      description: 'Matematik dersinin tüm konularından seçilmiş sorular',
      duration: 60,
      totalQuestions: 30,
      subjects: ['Matematik'],
      difficulty: 'Zor',
      participants: 850,
      averageScore: 65.8,
      isActive: true,
      startDate: '2024-01-18T10:00:00Z',
      endDate: '2024-01-18T22:00:00Z'
    },
    {
      id: 3,
      title: 'Türkçe ve Sosyal Bilgiler Karma Sınav',
      description: 'Türkçe ve Sosyal Bilgiler derslerinden karma sorular',
      duration: 45,
      totalQuestions: 25,
      subjects: ['Türkçe', 'Sosyal Bilgiler'],
      difficulty: 'Kolay',
      participants: 650,
      averageScore: 78.2,
      isActive: false,
      startDate: '2024-01-10T14:00:00Z',
      endDate: '2024-01-10T23:59:59Z'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'badge-success'
      case 'Orta': return 'badge-warning'
      case 'Zor': return 'badge-error'
      default: return 'badge-primary'
    }
  }

  const getSubjectColors = (subjects: string[]) => {
    const colors: Record<string, string> = {
      'Türkçe': 'bg-red-100 text-red-800',
      'Matematik': 'bg-blue-100 text-blue-800',
      'Fen Bilimleri': 'bg-green-100 text-green-800',
      'Sosyal Bilgiler': 'bg-orange-100 text-orange-800',
      'İngilizce': 'bg-purple-100 text-purple-800',
      'Din Kültürü': 'bg-gray-100 text-gray-800'
    }
    
    return subjects.map(subject => colors[subject] || 'bg-gray-100 text-gray-800')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sınavlar</h1>
        <p className="text-gray-600 mt-1">
          Deneme sınavları ile kendinizi test edin ve eksiklerinizi keşfedin
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Sınav</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Katılımcı</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.reduce((sum, exam) => sum + exam.participants, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(exams.reduce((sum, exam) => sum + exam.duration, 0) / exams.length)} dk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="card hover:shadow-lg transition-shadow">
            <div className="card-content">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {exam.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`badge ${getDifficultyColor(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                  {exam.isActive ? (
                    <span className="badge badge-success">Aktif</span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-600">Tamamlandı</span>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mb-4">
                {exam.subjects.map((subject, index) => (
                  <span
                    key={subject}
                    className={`badge ${getSubjectColors(exam.subjects)[index]}`}
                  >
                    {subject}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {exam.duration} dakika
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  {exam.totalQuestions} soru
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {exam.participants.toLocaleString()} katılımcı
                </div>
                <div className="flex items-center text-gray-600">
                  📊 Ortalama: {exam.averageScore}
                </div>
              </div>

              {/* Dates */}
              <div className="text-xs text-gray-500 mb-4">
                <div>
                  Başlangıç: {new Date(exam.startDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div>
                  Bitiş: {new Date(exam.endDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                {exam.isActive ? (
                  <button className="btn-primary">
                    <Play className="h-4 w-4 mr-2" />
                    Sınava Başla
                  </button>
                ) : (
                  <button className="btn-outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Sonuçları Gör
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {exams.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz sınav yok</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sınavlar eklendiğinde burada görünecek.
          </p>
        </div>
      )}
    </div>
  )
}