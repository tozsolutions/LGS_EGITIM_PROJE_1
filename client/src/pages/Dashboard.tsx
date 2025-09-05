import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Tamamlanan Sınavlar',
      value: '12',
      change: '+2 bu hafta',
      changeType: 'positive',
      icon: CheckCircle,
    },
    {
      name: 'Ortalama Puan',
      value: '85.2',
      change: '+5.4 geçen aya göre',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Çözülen Sorular',
      value: '1,247',
      change: '+89 bu hafta',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Çalışma Saati',
      value: '42h',
      change: '+3h bu hafta',
      changeType: 'positive',
      icon: Clock,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'exam',
      title: 'Matematik Deneme Sınavı 5',
      score: 88,
      date: '2 saat önce',
      status: 'completed'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Türkçe - Sözcükte Anlam',
      score: 92,
      date: '1 gün önce',
      status: 'completed'
    },
    {
      id: 3,
      type: 'exam',
      title: 'Fen Bilimleri Deneme Sınavı 3',
      score: 76,
      date: '2 gün önce',
      status: 'completed'
    },
  ]

  const upcomingExams = [
    {
      id: 1,
      title: 'LGS Genel Deneme 8',
      date: '2024-01-15',
      duration: '120 dakika',
      subjects: ['Tüm Dersler']
    },
    {
      id: 2,
      title: 'Matematik Konu Tarama',
      date: '2024-01-18',
      duration: '60 dakika',
      subjects: ['Matematik']
    },
  ]

  const subjectProgress = [
    { name: 'Matematik', progress: 85, color: 'bg-blue-500' },
    { name: 'Türkçe', progress: 78, color: 'bg-red-500' },
    { name: 'Fen Bilimleri', progress: 92, color: 'bg-green-500' },
    { name: 'Sosyal Bilgiler', progress: 67, color: 'bg-orange-500' },
    { name: 'İngilizce', progress: 73, color: 'bg-purple-500' },
    { name: 'Din Kültürü', progress: 81, color: 'bg-gray-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldin, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Bugün nasıl bir başarı hikayesi yazacaksın?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Progress */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Ders Bazında İlerleme</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {subjectProgress.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                      <span>{subject.name}</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${subject.color}`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Yaklaşan Sınavlar</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <p className="text-sm text-gray-600">{exam.date}</p>
                    <p className="text-sm text-gray-500">{exam.duration}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exam.subjects.map((subject) => (
                        <span key={subject} className="badge-primary text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
          </div>
          <div className="card-content">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'exam' ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            {activity.type === 'exam' ? (
                              <FileText className="h-4 w-4 text-white" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {activity.title}{' '}
                              <span className="font-medium text-gray-900">
                                - {activity.score} puan
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Soru Çöz</h3>
              <p className="text-sm text-gray-600">Rastgele sorularla pratik yap</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Sınav Başlat</h3>
              <p className="text-sm text-gray-600">Deneme sınavına katıl</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">İstatistikler</h3>
              <p className="text-sm text-gray-600">Performansını analiz et</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}