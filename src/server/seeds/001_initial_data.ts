import { Knex } from 'knex';
import { AuthUtils } from '../utils/auth';
import config from '../config';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('admin_permissions').del();
  await knex('teacher_profiles').del();
  await knex('student_profiles').del();
  await knex('users').del();

  // Create admin user
  const adminPasswordHash = await AuthUtils.hashPassword(config.admin.password);
  
  const [adminId] = await knex('users').insert({
    email: config.admin.email,
    username: 'admin',
    password_hash: adminPasswordHash,
    first_name: 'System',
    last_name: 'Administrator',
    role: 'admin',
    is_active: true
  });

  // Add admin permissions
  const adminPermissions = [
    'manage_users',
    'manage_questions', 
    'manage_exams',
    'view_analytics',
    'manage_content'
  ];

  for (const permission of adminPermissions) {
    await knex('admin_permissions').insert({
      user_id: adminId,
      permission
    });
  }

  // Create sample teacher
  const teacherPasswordHash = await AuthUtils.hashPassword('teacher123');
  
  const [teacherId] = await knex('users').insert({
    email: 'ogretmen@lgs-egitim.com',
    username: 'matematik_ogretmeni',
    password_hash: teacherPasswordHash,
    first_name: 'Ahmet',
    last_name: 'Yılmaz',
    role: 'teacher',
    is_active: true
  });

  await knex('teacher_profiles').insert({
    user_id: teacherId,
    subject: 'matematik',
    experience_years: 10,
    qualification: 'Matematik Öğretmenliği Lisans, Eğitim Yönetimi Yüksek Lisans'
  });

  // Create sample student
  const studentPasswordHash = await AuthUtils.hashPassword('ogrenci123');
  
  const [studentId] = await knex('users').insert({
    email: 'ogrenci@lgs-egitim.com',
    username: 'test_ogrenci',
    password_hash: studentPasswordHash,
    first_name: 'Ayşe',
    last_name: 'Demir',
    role: 'student',
    is_active: true
  });

  await knex('student_profiles').insert({
    user_id: studentId,
    grade: 8,
    school: 'Atatürk Ortaokulu',
    parent_email: 'veli@example.com',
    total_exams_taken: 0,
    average_score: 0
  });

  console.log('✅ Initial users created:');
  console.log(`   Admin: ${config.admin.email} / ${config.admin.password}`);
  console.log('   Teacher: ogretmen@lgs-egitim.com / teacher123');
  console.log('   Student: ogrenci@lgs-egitim.com / ogrenci123');
}