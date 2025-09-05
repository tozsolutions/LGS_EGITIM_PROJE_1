import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('question_options').del();
  await knex('questions').del();

  // Get teacher user ID for creating questions
  const teacher = await knex('users').where({ role: 'teacher' }).first();
  const admin = await knex('users').where({ role: 'admin' }).first();
  
  const teacherId = teacher?.id || admin?.id;

  if (!teacherId) {
    console.log('⚠️ No teacher or admin user found, skipping sample questions');
    return;
  }

  // Sample Mathematics Questions
  const mathQuestions = [
    {
      subject: 'matematik',
      topic: 'Cebirsel İfadeler',
      difficulty: 'easy',
      content: '3x + 5 = 14 denkleminde x değeri kaçtır?',
      explanation: '3x + 5 = 14 denkleminde önce 5\'i karşı tarafa geçiririz: 3x = 14 - 5 = 9. Sonra her iki tarafı 3\'e böleriz: x = 9/3 = 3',
      points: 1,
      time_limit: 60,
      options: [
        { text: '2', is_correct: false },
        { text: '3', is_correct: true },
        { text: '4', is_correct: false },
        { text: '5', is_correct: false }
      ]
    },
    {
      subject: 'matematik',
      topic: 'Geometri',
      difficulty: 'medium',
      content: 'Kenar uzunlukları 3 cm, 4 cm ve 5 cm olan üçgenin alanı kaç cm²\'dir?',
      explanation: 'Bu bir dik üçgendir (3²+4²=5²). Dik üçgende alan = (taban × yükseklik) / 2 = (3 × 4) / 2 = 6 cm²',
      points: 2,
      time_limit: 90,
      options: [
        { text: '6', is_correct: true },
        { text: '7', is_correct: false },
        { text: '8', is_correct: false },
        { text: '12', is_correct: false }
      ]
    },
    {
      subject: 'matematik',
      topic: 'Sayılar',
      difficulty: 'hard',
      content: 'Bir sayının %25\'i 60 ise, bu sayının %40\'ı kaçtır?',
      explanation: 'Sayıyı x diyelim. x\'in %25\'i = x/4 = 60, dolayısıyla x = 240. Bu sayının %40\'ı = 240 × 0.4 = 96',
      points: 3,
      time_limit: 120,
      options: [
        { text: '80', is_correct: false },
        { text: '90', is_correct: false },
        { text: '96', is_correct: true },
        { text: '100', is_correct: false }
      ]
    }
  ];

  // Sample Turkish Questions
  const turkishQuestions = [
    {
      subject: 'turkce',
      topic: 'Sözcükte Anlam',
      difficulty: 'easy',
      content: '"Kitabı okuduktan sonra çok etkilendim." cümlesinde "etkilendim" sözcüğünün anlamı aşağıdakilerden hangisidir?',
      explanation: '"Etkilendim" sözcüğü burada "duygulandım, tesir altında kaldım" anlamında kullanılmıştır.',
      points: 1,
      time_limit: 60,
      options: [
        { text: 'Sıkıldım', is_correct: false },
        { text: 'Duygulandım', is_correct: true },
        { text: 'Yoruldum', is_correct: false },
        { text: 'Şaşırdım', is_correct: false }
      ]
    },
    {
      subject: 'turkce',
      topic: 'Cümle Bilgisi',
      difficulty: 'medium',
      content: '"Öğretmenimiz, derse geç kalan öğrencileri uyardı." cümlesinde özne hangisidir?',
      explanation: 'Cümlede "kim?" sorusunun cevabı öznedir. "Kim uyardı?" sorusunun cevabı "öğretmenimiz"dir.',
      points: 2,
      time_limit: 75,
      options: [
        { text: 'öğretmenimiz', is_correct: true },
        { text: 'derse geç kalan öğrencileri', is_correct: false },
        { text: 'öğrencileri', is_correct: false },
        { text: 'uyardı', is_correct: false }
      ]
    }
  ];

  // Sample Science Questions
  const scienceQuestions = [
    {
      subject: 'fen_bilimleri',
      topic: 'Hücre ve Bölünmeler',
      difficulty: 'easy',
      content: 'İnsan vücudundaki en küçük yaşayan birim hangisidir?',
      explanation: 'Hücre, tüm canlıların yapısal ve işlevsel temel birimidir. İnsan vücudundaki en küçük yaşayan birimdir.',
      points: 1,
      time_limit: 45,
      options: [
        { text: 'Organ', is_correct: false },
        { text: 'Doku', is_correct: false },
        { text: 'Hücre', is_correct: true },
        { text: 'Sistem', is_correct: false }
      ]
    },
    {
      subject: 'fen_bilimleri',
      topic: 'Kuvvet ve Hareket',
      difficulty: 'medium',
      content: 'Bir cismin hızı sabit iken, bu cisim üzerindeki net kuvvet kaçtır?',
      explanation: 'Newton\'un birinci yasasına göre, bir cisim sabit hızla hareket ediyorsa veya durgun ise, üzerindeki net kuvvet sıfırdır.',
      points: 2,
      time_limit: 90,
      options: [
        { text: '0 N', is_correct: true },
        { text: '1 N', is_correct: false },
        { text: 'Hızla orantılı', is_correct: false },
        { text: 'Kütleyle orantılı', is_correct: false }
      ]
    }
  ];

  // Sample Social Studies Questions
  const socialQuestions = [
    {
      subject: 'sosyal_bilgiler',
      topic: 'Türk Tarihi',
      difficulty: 'easy',
      content: 'Türkiye Cumhuriyeti hangi yıl kurulmuştur?',
      explanation: 'Türkiye Cumhuriyeti, Mustafa Kemal Atatürk önderliğinde 29 Ekim 1923 tarihinde ilan edilmiştir.',
      points: 1,
      time_limit: 45,
      options: [
        { text: '1920', is_correct: false },
        { text: '1921', is_correct: false },
        { text: '1922', is_correct: false },
        { text: '1923', is_correct: true }
      ]
    }
  ];

  // Insert all questions
  const allQuestions = [...mathQuestions, ...turkishQuestions, ...scienceQuestions, ...socialQuestions];

  for (const questionData of allQuestions) {
    const { options, ...questionInfo } = questionData;
    
    // Insert question
    const [questionId] = await knex('questions').insert({
      ...questionInfo,
      created_by: teacherId,
      is_active: true
    });

    // Insert options
    for (let i = 0; i < options.length; i++) {
      await knex('question_options').insert({
        question_id: questionId,
        text: options[i].text,
        is_correct: options[i].is_correct,
        order_index: i
      });
    }
  }

  console.log(`✅ Created ${allQuestions.length} sample questions`);
}