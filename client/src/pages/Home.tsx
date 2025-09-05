import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Users, Award, TrendingUp, CheckCircle, Star } from 'lucide-react'

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: 'Kapsamlı Soru Bankası',
      description: 'Tüm LGS konularını kapsayan binlerce güncel soru ile pratik yapın.'
    },
    {
      icon: Award,
      title: 'Gerçekçi Sınav Deneyimi',
      description: 'LGS formatına uygun deneme sınavları ile kendinizi test edin.'
    },
    {
      icon: TrendingUp,
      title: 'Performans Analizi',
      description: 'Detaylı istatistikler ile güçlü ve zayıf yönlerinizi keşfedin.'
    },
    {
      icon: Users,
      title: 'Uzman Öğretmen Desteği',
      description: 'Deneyimli öğretmenler tarafından hazırlanan kaliteli içerik.'
    }
  ]

  const subjects = [
    { name: 'Türkçe', icon: '📚', color: 'bg-red-100 text-red-800' },
    { name: 'Matematik', icon: '🧮', color: 'bg-blue-100 text-blue-800' },
    { name: 'Fen Bilimleri', icon: '🔬', color: 'bg-green-100 text-green-800' },
    { name: 'Sosyal Bilgiler', icon: '🌍', color: 'bg-orange-100 text-orange-800' },
    { name: 'İngilizce', icon: '🇬🇧', color: 'bg-purple-100 text-purple-800' },
    { name: 'Din Kültürü', icon: '☪️', color: 'bg-gray-100 text-gray-800' }
  ]

  const stats = [
    { label: 'Aktif Öğrenci', value: '10,000+' },
    { label: 'Soru Bankası', value: '50,000+' },
    { label: 'Başarı Oranı', value: '%95' },
    { label: 'Uzman Öğretmen', value: '100+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              LGS'de Başarının
              <span className="block text-yellow-300">Anahtarı</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Türkiye'nin en kapsamlı LGS hazırlık platformu ile hedeflediğin liseye adım at. 
              Uzman öğretmenler eşliğinde hazırlanmış sorular ve deneme sınavları ile farkı yakala.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Dashboard'a Git
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Ücretsiz Başla
                  </Link>
                  <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden LGS Eğitim Platformu?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Başarılı öğrencilerin tercihi olan platformumuzda seni bekleyen avantajları keşfet.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tüm LGS Dersleri
            </h2>
            <p className="text-lg text-gray-600">
              6 ana derste binlerce soru ile eksiksiz hazırlık
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{subject.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                <span className={`badge ${subject.color}`}>
                  1000+ Soru
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hayalindeki Liseye Giden Yol Burada Başlıyor
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Binlerce öğrenci gibi sen de başarı hikayenin kahramanı ol.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Hemen Başla - Ücretsiz
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LGS Eğitim</h3>
              <p className="text-gray-400">
                Türkiye'nin en güvenilir LGS hazırlık platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/questions" className="hover:text-white">Sorular</Link></li>
                <li><Link to="/exams" className="hover:text-white">Sınavlar</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hesap</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Giriş Yap</Link></li>
                <li><Link to="/register" className="hover:text-white">Kayıt Ol</Link></li>
                <li><Link to="/profile" className="hover:text-white">Profil</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:info@lgs-egitim.com" className="hover:text-white">İletişim</a></li>
                <li><a href="#" className="hover:text-white">Yardım</a></li>
                <li><a href="#" className="hover:text-white">SSS</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LGS Eğitim Platformu. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}