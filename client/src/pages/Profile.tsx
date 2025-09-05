import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, School, Calendar, Edit, Save, X } from 'lucide-react'

export const Profile: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
    })
    setIsEditing(false)
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      student: 'Öğrenci',
      teacher: 'Öğretmen',
      admin: 'Yönetici'
    }
    return roleMap[role] || role
  }

  const stats = [
    { label: 'Tamamlanan Sınavlar', value: '12' },
    { label: 'Çözülen Sorular', value: '1,247' },
    { label: 'Ortalama Puan', value: '85.2' },
    { label: 'Çalışma Saati', value: '42h' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-success"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    İptal
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soyad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kullanıcı Adı
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.username}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <span className="badge badge-primary">
                    {getRoleDisplayName(user?.role || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {user?.role === 'student' && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">İstatistikler</h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Profile Info */}
        {user?.profile && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">
                {user.role === 'student' ? 'Öğrenci Bilgileri' : 'Öğretmen Bilgileri'}
              </h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sınıf
                      </label>
                      <p className="text-gray-900">{user.profile.grade}. Sınıf</p>
                    </div>
                    
                    {user.profile.school && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Okul
                        </label>
                        <p className="text-gray-900">{user.profile.school}</p>
                      </div>
                    )}
                    
                    {user.profile.parentEmail && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Veli E-postası
                        </label>
                        <p className="text-gray-900">{user.profile.parentEmail}</p>
                      </div>
                    )}
                  </>
                )}

                {user.role === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branş
                      </label>
                      <p className="text-gray-900 capitalize">{user.profile.subject}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deneyim
                      </label>
                      <p className="text-gray-900">{user.profile.experienceYears} yıl</p>
                    </div>
                    
                    {user.profile.qualification && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nitelikler
                        </label>
                        <p className="text-gray-900">{user.profile.qualification}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Hesap Ayarları</h2>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <button className="btn-outline w-full md:w-auto">
                Şifre Değiştir
              </button>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Bildirim Tercihleri
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">E-posta bildirimleri</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">Sınav hatırlatmaları</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-sm text-gray-700">Haftalık rapor</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}