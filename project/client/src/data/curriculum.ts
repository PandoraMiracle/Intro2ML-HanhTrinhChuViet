// Vietnamese Learning Curriculum - "Tiếng Việt 1 - Chân Trời Sáng Tạo" textbook
// 18 Topics, each topic has 5 lessons (Lesson 1-4: Learn sounds/rhymes, Lesson 5: Review & Storytelling)
// Designed for foreigners learning Vietnamese

export type Sound = {
  id: string;
  name: string;
  displayName: string;
  type: 'vowel' | 'consonant' | 'rhyme';
  description: string;
  descriptionEn?: string;
};

export type Lesson = {
  id: number;
  title: string;
  titleEn?: string;
  sounds: Sound[];
  isReview: boolean;
  storyTitle?: string;
  storyTitleEn?: string;
};

export type Topic = {
  id: number;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  lessons: Lesson[];
  color: string;
};

export type Curriculum = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  topics: Topic[];
};

// 18 Topics Curriculum
export const curriculum: Curriculum = {
  title: 'Tiếng Việt 1 - Chân Trời Sáng Tạo',
  titleEn: 'Vietnamese Level 1 - Creative Horizons',
  description: 'Chương trình học tiếng Việt với phương pháp tương tác',
  descriptionEn: 'Interactive Vietnamese learning program for beginners - Based on Grade 1 textbook',
  topics: [
    // TOPIC 1: My School
    {
      id: 1,
      name: 'My School',
      nameEn: 'My School',
      description: 'Get familiar with school and learn the first sounds',
      descriptionEn: 'Get familiar with school and learn the first sounds',
      color: '#4ca76f',
      lessons: [
        {
          id: 1,
          title: 'Âm A',
          titleEn: 'Sound A',
          isReview: false,
          sounds: [
            { id: 'a', name: 'a', displayName: 'A a', type: 'vowel', description: 'Nguyên âm A', descriptionEn: 'Vowel A' }
          ]
        },
        {
          id: 2,
          title: 'Âm B - C',
          titleEn: 'Sounds B - C',
          isReview: false,
          sounds: [
            { id: 'b', name: 'b', displayName: 'B b', type: 'consonant', description: 'Phụ âm B', descriptionEn: 'Consonant B' },
            { id: 'c', name: 'c', displayName: 'C c', type: 'consonant', description: 'Phụ âm C', descriptionEn: 'Consonant C' }
          ]
        },
        {
          id: 3,
          title: 'Âm O - Ô',
          titleEn: 'Sounds O - Ô',
          isReview: false,
          sounds: [
            { id: 'o', name: 'o', displayName: 'O o', type: 'vowel', description: 'Nguyên âm O', descriptionEn: 'Vowel O' },
            { id: 'ô', name: 'ô', displayName: 'Ô ô', type: 'vowel', description: 'Nguyên âm Ô', descriptionEn: 'Vowel Ô (closed O)' }
          ]
        },
        {
          id: 4,
          title: 'Âm D - Đ',
          titleEn: 'Sounds D - Đ',
          isReview: false,
          sounds: [
            { id: 'd', name: 'd', displayName: 'D d', type: 'consonant', description: 'Phụ âm D', descriptionEn: 'Consonant D (like "z")' },
            { id: 'đ', name: 'đ', displayName: 'Đ đ', type: 'consonant', description: 'Phụ âm Đ', descriptionEn: 'Consonant Đ (like "d")' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          titleEn: 'Review & Story',
          isReview: true,
          storyTitle: 'Bé vào lớp Một',
          storyTitleEn: 'Starting First Grade',
          sounds: []
        }
      ]
    },
    // TOPIC 2: Family
    {
      id: 2,
      name: 'Family',
      nameEn: 'Family',
      description: 'Learn about family and new sounds',
      descriptionEn: 'Learn about family and new sounds',
      color: '#f7c27d',
      lessons: [
        {
          id: 1,
          title: 'Âm E - Ê',
          isReview: false,
          sounds: [
            { id: 'e', name: 'e', displayName: 'E e', type: 'vowel', description: 'Nguyên âm E' },
            { id: 'ê', name: 'ê', displayName: 'Ê ê', type: 'vowel', description: 'Nguyên âm Ê' }
          ]
        },
        {
          id: 2,
          title: 'Âm G - H',
          isReview: false,
          sounds: [
            { id: 'g', name: 'g', displayName: 'G g', type: 'consonant', description: 'Phụ âm G' },
            { id: 'h', name: 'h', displayName: 'H h', type: 'consonant', description: 'Phụ âm H' }
          ]
        },
        {
          id: 3,
          title: 'Âm I - K',
          isReview: false,
          sounds: [
            { id: 'i', name: 'i', displayName: 'I i', type: 'vowel', description: 'Nguyên âm I' },
            { id: 'k', name: 'k', displayName: 'K k', type: 'consonant', description: 'Phụ âm K' }
          ]
        },
        {
          id: 4,
          title: 'Âm L - M',
          isReview: false,
          sounds: [
            { id: 'l', name: 'l', displayName: 'L l', type: 'consonant', description: 'Phụ âm L' },
            { id: 'm', name: 'm', displayName: 'M m', type: 'consonant', description: 'Phụ âm M' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Bé và bà',
          sounds: []
        }
      ]
    },
    // TOPIC 3: Nature
    {
      id: 3,
      name: 'Nature',
      nameEn: 'Nature',
      description: 'Explore nature through new sounds',
      descriptionEn: 'Explore nature through new sounds',
      color: '#8fd9b4',
      lessons: [
        {
          id: 1,
          title: 'Âm N - Ơ',
          isReview: false,
          sounds: [
            { id: 'n', name: 'n', displayName: 'N n', type: 'consonant', description: 'Phụ âm N' },
            { id: 'ơ', name: 'ơ', displayName: 'Ơ ơ', type: 'vowel', description: 'Nguyên âm Ơ' }
          ]
        },
        {
          id: 2,
          title: 'Âm P - Q',
          isReview: false,
          sounds: [
            { id: 'p', name: 'p', displayName: 'P p', type: 'consonant', description: 'Phụ âm P' },
            { id: 'q', name: 'q', displayName: 'Q q', type: 'consonant', description: 'Phụ âm Q' }
          ]
        },
        {
          id: 3,
          title: 'Âm R - S',
          isReview: false,
          sounds: [
            { id: 'r', name: 'r', displayName: 'R r', type: 'consonant', description: 'Phụ âm R' },
            { id: 's', name: 's', displayName: 'S s', type: 'consonant', description: 'Phụ âm S' }
          ]
        },
        {
          id: 4,
          title: 'Âm T - U',
          isReview: false,
          sounds: [
            { id: 't', name: 't', displayName: 'T t', type: 'consonant', description: 'Phụ âm T' },
            { id: 'u', name: 'u', displayName: 'U u', type: 'vowel', description: 'Nguyên âm U' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Cò và cá',
          sounds: []
        }
      ]
    },
    // TOPIC 4: Animals
    {
      id: 4,
      name: 'Animals',
      nameEn: 'Animals',
      description: 'Discover the world of animals',
      descriptionEn: 'Discover the world of animals',
      color: '#f8c8d8',
      lessons: [
        {
          id: 1,
          title: 'Âm Ư - V',
          isReview: false,
          sounds: [
            { id: 'ư', name: 'ư', displayName: 'Ư ư', type: 'vowel', description: 'Nguyên âm Ư' },
            { id: 'v', name: 'v', displayName: 'V v', type: 'consonant', description: 'Phụ âm V' }
          ]
        },
        {
          id: 2,
          title: 'Âm X - Y',
          isReview: false,
          sounds: [
            { id: 'x', name: 'x', displayName: 'X x', type: 'consonant', description: 'Phụ âm X' },
            { id: 'y', name: 'y', displayName: 'Y y', type: 'vowel', description: 'Nguyên âm/Bán nguyên âm Y' }
          ]
        },
        {
          id: 3,
          title: 'Âm CH - TR',
          isReview: false,
          sounds: [
            { id: 'ch', name: 'ch', displayName: 'Ch ch', type: 'consonant', description: 'Phụ âm kép CH' },
            { id: 'tr', name: 'tr', displayName: 'Tr tr', type: 'consonant', description: 'Phụ âm kép TR' }
          ]
        },
        {
          id: 4,
          title: 'Âm GI - NH',
          isReview: false,
          sounds: [
            { id: 'gi', name: 'gi', displayName: 'Gi gi', type: 'consonant', description: 'Phụ âm kép GI' },
            { id: 'nh', name: 'nh', displayName: 'Nh nh', type: 'consonant', description: 'Phụ âm kép NH' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Gà con và vịt con',
          sounds: []
        }
      ]
    },
    // TOPIC 5: Objects
    {
      id: 5,
      name: 'Objects',
      nameEn: 'Objects',
      description: 'Learn about surrounding objects',
      descriptionEn: 'Learn about surrounding objects',
      color: '#f6f0b3',
      lessons: [
        {
          id: 1,
          title: 'Âm NG - NGH',
          isReview: false,
          sounds: [
            { id: 'ng', name: 'ng', displayName: 'Ng ng', type: 'consonant', description: 'Phụ âm kép NG' },
            { id: 'ngh', name: 'ngh', displayName: 'Ngh ngh', type: 'consonant', description: 'Phụ âm kép NGH' }
          ]
        },
        {
          id: 2,
          title: 'Âm PH - TH',
          isReview: false,
          sounds: [
            { id: 'ph', name: 'ph', displayName: 'Ph ph', type: 'consonant', description: 'Phụ âm kép PH' },
            { id: 'th', name: 'th', displayName: 'Th th', type: 'consonant', description: 'Phụ âm kép TH' }
          ]
        },
        {
          id: 3,
          title: 'Âm KH - GH',
          isReview: false,
          sounds: [
            { id: 'kh', name: 'kh', displayName: 'Kh kh', type: 'consonant', description: 'Phụ âm kép KH' },
            { id: 'gh', name: 'gh', displayName: 'Gh gh', type: 'consonant', description: 'Phụ âm kép GH' }
          ]
        },
        {
          id: 4,
          title: 'Âm QU - Ă',
          isReview: false,
          sounds: [
            { id: 'qu', name: 'qu', displayName: 'Qu qu', type: 'consonant', description: 'Phụ âm kép QU' },
            { id: 'ă', name: 'ă', displayName: 'Ă ă', type: 'vowel', description: 'Nguyên âm Ă' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Bạn nhỏ và chiếc bút',
          sounds: []
        }
      ]
    },
    // TOPIC 6: Occupations
    {
      id: 6,
      name: 'Occupations',
      nameEn: 'Occupations',
      description: 'Learn about jobs and new rhymes',
      descriptionEn: 'Learn about jobs and new rhymes',
      color: '#2e7a55',
      lessons: [
        {
          id: 1,
          title: 'Vần IA - UA - ƯA',
          isReview: false,
          sounds: [
            { id: 'ia', name: 'ia', displayName: 'ia', type: 'rhyme', description: 'Vần IA' },
            { id: 'ua', name: 'ua', displayName: 'ua', type: 'rhyme', description: 'Vần UA' },
            { id: 'ưa', name: 'ưa', displayName: 'ưa', type: 'rhyme', description: 'Vần ƯA' }
          ]
        },
        {
          id: 2,
          title: 'Vần OI - ÔI - ƠI',
          isReview: false,
          sounds: [
            { id: 'oi', name: 'oi', displayName: 'oi', type: 'rhyme', description: 'Vần OI' },
            { id: 'ôi', name: 'ôi', displayName: 'ôi', type: 'rhyme', description: 'Vần ÔI' },
            { id: 'ơi', name: 'ơi', displayName: 'ơi', type: 'rhyme', description: 'Vần ƠI' }
          ]
        },
        {
          id: 3,
          title: 'Vần AI - AY - ÂY',
          isReview: false,
          sounds: [
            { id: 'ai', name: 'ai', displayName: 'ai', type: 'rhyme', description: 'Vần AI' },
            { id: 'ay', name: 'ay', displayName: 'ay', type: 'rhyme', description: 'Vần AY' },
            { id: 'ây', name: 'ây', displayName: 'ây', type: 'rhyme', description: 'Vần ÂY' }
          ]
        },
        {
          id: 4,
          title: 'Vần EO - AO - AU',
          isReview: false,
          sounds: [
            { id: 'eo', name: 'eo', displayName: 'eo', type: 'rhyme', description: 'Vần EO' },
            { id: 'ao', name: 'ao', displayName: 'ao', type: 'rhyme', description: 'Vần AO' },
            { id: 'au', name: 'au', displayName: 'au', type: 'rhyme', description: 'Vần AU' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Bác sĩ và cô giáo',
          sounds: []
        }
      ]
    },
    // TOPIC 7: Food
    {
      id: 7,
      name: 'Food',
      nameEn: 'Food',
      description: 'Learn about food and new rhymes',
      descriptionEn: 'Learn about food and new rhymes',
      color: '#f8d1a3',
      lessons: [
        {
          id: 1,
          title: 'Vần ÂU - IU - ƯU',
          isReview: false,
          sounds: [
            { id: 'âu', name: 'âu', displayName: 'âu', type: 'rhyme', description: 'Vần ÂU' },
            { id: 'iu', name: 'iu', displayName: 'iu', type: 'rhyme', description: 'Vần IU' },
            { id: 'ưu', name: 'ưu', displayName: 'ưu', type: 'rhyme', description: 'Vần ƯU' }
          ]
        },
        {
          id: 2,
          title: 'Vần ƯƠI - ƯƠU - UÔI',
          isReview: false,
          sounds: [
            { id: 'ươi', name: 'ươi', displayName: 'ươi', type: 'rhyme', description: 'Vần ƯƠI' },
            { id: 'ươu', name: 'ươu', displayName: 'ươu', type: 'rhyme', description: 'Vần ƯƠU' },
            { id: 'uôi', name: 'uôi', displayName: 'uôi', type: 'rhyme', description: 'Vần UÔI' }
          ]
        },
        {
          id: 3,
          title: 'Vần AN - ÂN - ƠN',
          isReview: false,
          sounds: [
            { id: 'an', name: 'an', displayName: 'an', type: 'rhyme', description: 'Vần AN' },
            { id: 'ân', name: 'ân', displayName: 'ân', type: 'rhyme', description: 'Vần ÂN' },
            { id: 'ơn', name: 'ơn', displayName: 'ơn', type: 'rhyme', description: 'Vần ƠN' }
          ]
        },
        {
          id: 4,
          title: 'Vần ON - ÔN - UN',
          isReview: false,
          sounds: [
            { id: 'on', name: 'on', displayName: 'on', type: 'rhyme', description: 'Vần ON' },
            { id: 'ôn', name: 'ôn', displayName: 'ôn', type: 'rhyme', description: 'Vần ÔN' },
            { id: 'un', name: 'un', displayName: 'un', type: 'rhyme', description: 'Vần UN' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Bữa cơm gia đình',
          sounds: []
        }
      ]
    },
    // TOPIC 8: Transportation
    {
      id: 8,
      name: 'Transportation',
      nameEn: 'Transportation',
      description: 'Learn about means of transportation',
      descriptionEn: 'Learn about means of transportation',
      color: '#4ca76f',
      lessons: [
        {
          id: 1,
          title: 'Vần EN - ÊN - IN',
          isReview: false,
          sounds: [
            { id: 'en', name: 'en', displayName: 'en', type: 'rhyme', description: 'Vần EN' },
            { id: 'ên', name: 'ên', displayName: 'ên', type: 'rhyme', description: 'Vần ÊN' },
            { id: 'in', name: 'in', displayName: 'in', type: 'rhyme', description: 'Vần IN' }
          ]
        },
        {
          id: 2,
          title: 'Vần IÊN - YÊN - UÔN',
          isReview: false,
          sounds: [
            { id: 'iên', name: 'iên', displayName: 'iên', type: 'rhyme', description: 'Vần IÊN' },
            { id: 'yên', name: 'yên', displayName: 'yên', type: 'rhyme', description: 'Vần YÊN' },
            { id: 'uôn', name: 'uôn', displayName: 'uôn', type: 'rhyme', description: 'Vần UÔN' }
          ]
        },
        {
          id: 3,
          title: 'Vần ƯƠN - OAN - OĂN',
          isReview: false,
          sounds: [
            { id: 'ươn', name: 'ươn', displayName: 'ươn', type: 'rhyme', description: 'Vần ƯƠN' },
            { id: 'oan', name: 'oan', displayName: 'oan', type: 'rhyme', description: 'Vần OAN' },
            { id: 'oăn', name: 'oăn', displayName: 'oăn', type: 'rhyme', description: 'Vần OĂN' }
          ]
        },
        {
          id: 4,
          title: 'Vần AM - ĂM - ÂM',
          isReview: false,
          sounds: [
            { id: 'am', name: 'am', displayName: 'am', type: 'rhyme', description: 'Vần AM' },
            { id: 'ăm', name: 'ăm', displayName: 'ăm', type: 'rhyme', description: 'Vần ĂM' },
            { id: 'âm', name: 'âm', displayName: 'âm', type: 'rhyme', description: 'Vần ÂM' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Đi xe buýt',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 9: Thời tiết
    {
      id: 9,
        name: 'Thời tiết',
        nameEn: 'Weather',
        description: 'Học về thời tiết và mùa',
        descriptionEn: 'Learn about weather and seasons',
      color: '#f7c27d',
      lessons: [
        {
          id: 1,
          title: 'Vần EM - ÊM - IM',
          isReview: false,
          sounds: [
            { id: 'em', name: 'em', displayName: 'em', type: 'rhyme', description: 'Vần EM' },
            { id: 'êm', name: 'êm', displayName: 'êm', type: 'rhyme', description: 'Vần ÊM' },
            { id: 'im', name: 'im', displayName: 'im', type: 'rhyme', description: 'Vần IM' }
          ]
        },
        {
          id: 2,
          title: 'Vần OM - ÔM - ƠM',
          isReview: false,
          sounds: [
            { id: 'om', name: 'om', displayName: 'om', type: 'rhyme', description: 'Vần OM' },
            { id: 'ôm', name: 'ôm', displayName: 'ôm', type: 'rhyme', description: 'Vần ÔM' },
            { id: 'ơm', name: 'ơm', displayName: 'ơm', type: 'rhyme', description: 'Vần ƠM' }
          ]
        },
        {
          id: 3,
          title: 'Vần UM - IÊM - YÊM',
          isReview: false,
          sounds: [
            { id: 'um', name: 'um', displayName: 'um', type: 'rhyme', description: 'Vần UM' },
            { id: 'iêm', name: 'iêm', displayName: 'iêm', type: 'rhyme', description: 'Vần IÊM' },
            { id: 'yêm', name: 'yêm', displayName: 'yêm', type: 'rhyme', description: 'Vần YÊM' }
          ]
        },
        {
          id: 4,
          title: 'Vần UÔM - ƯƠM - OAM',
          isReview: false,
          sounds: [
            { id: 'uôm', name: 'uôm', displayName: 'uôm', type: 'rhyme', description: 'Vần UÔM' },
            { id: 'ươm', name: 'ươm', displayName: 'ươm', type: 'rhyme', description: 'Vần ƯƠM' },
            { id: 'oam', name: 'oam', displayName: 'oam', type: 'rhyme', description: 'Vần OAM' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Ngày mưa',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 10: Cây cối
    {
      id: 10,
        name: 'Cây cối',
        nameEn: 'Plants',
        description: 'Khám phá thế giới thực vật',
        descriptionEn: 'Explore the world of plants',
      color: '#8fd9b4',
      lessons: [
        {
          id: 1,
          title: 'Vần AP - ĂP - ÂP',
          isReview: false,
          sounds: [
            { id: 'ap', name: 'ap', displayName: 'ap', type: 'rhyme', description: 'Vần AP' },
            { id: 'ăp', name: 'ăp', displayName: 'ăp', type: 'rhyme', description: 'Vần ĂP' },
            { id: 'âp', name: 'âp', displayName: 'âp', type: 'rhyme', description: 'Vần ÂP' }
          ]
        },
        {
          id: 2,
          title: 'Vần OP - ÔP - ƠP',
          isReview: false,
          sounds: [
            { id: 'op', name: 'op', displayName: 'op', type: 'rhyme', description: 'Vần OP' },
            { id: 'ôp', name: 'ôp', displayName: 'ôp', type: 'rhyme', description: 'Vần ÔP' },
            { id: 'ơp', name: 'ơp', displayName: 'ơp', type: 'rhyme', description: 'Vần ƠP' }
          ]
        },
        {
          id: 3,
          title: 'Vần EP - ÊP - IP',
          isReview: false,
          sounds: [
            { id: 'ep', name: 'ep', displayName: 'ep', type: 'rhyme', description: 'Vần EP' },
            { id: 'êp', name: 'êp', displayName: 'êp', type: 'rhyme', description: 'Vần ÊP' },
            { id: 'ip', name: 'ip', displayName: 'ip', type: 'rhyme', description: 'Vần IP' }
          ]
        },
        {
          id: 4,
          title: 'Vần UP - IÊP - ƯƠP',
          isReview: false,
          sounds: [
            { id: 'up', name: 'up', displayName: 'up', type: 'rhyme', description: 'Vần UP' },
            { id: 'iêp', name: 'iêp', displayName: 'iêp', type: 'rhyme', description: 'Vần IÊP' },
            { id: 'ươp', name: 'ươp', displayName: 'ươp', type: 'rhyme', description: 'Vần ƯƠP' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Cây xanh trong vườn',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 11: Ngày lễ
    {
      id: 11,
        name: 'Ngày lễ',
        nameEn: 'Holidays',
        description: 'Học về các ngày lễ Việt Nam',
        descriptionEn: 'Learn about Vietnamese holidays',
      color: '#f8c8d8',
      lessons: [
        {
          id: 1,
          title: 'Vần AT - ĂT - ÂT',
          isReview: false,
          sounds: [
            { id: 'at', name: 'at', displayName: 'at', type: 'rhyme', description: 'Vần AT' },
            { id: 'ăt', name: 'ăt', displayName: 'ăt', type: 'rhyme', description: 'Vần ĂT' },
            { id: 'ât', name: 'ât', displayName: 'ât', type: 'rhyme', description: 'Vần ÂT' }
          ]
        },
        {
          id: 2,
          title: 'Vần OT - ÔT - ƠT',
          isReview: false,
          sounds: [
            { id: 'ot', name: 'ot', displayName: 'ot', type: 'rhyme', description: 'Vần OT' },
            { id: 'ôt', name: 'ôt', displayName: 'ôt', type: 'rhyme', description: 'Vần ÔT' },
            { id: 'ơt', name: 'ơt', displayName: 'ơt', type: 'rhyme', description: 'Vần ƠT' }
          ]
        },
        {
          id: 3,
          title: 'Vần ET - ÊT - IT',
          isReview: false,
          sounds: [
            { id: 'et', name: 'et', displayName: 'et', type: 'rhyme', description: 'Vần ET' },
            { id: 'êt', name: 'êt', displayName: 'êt', type: 'rhyme', description: 'Vần ÊT' },
            { id: 'it', name: 'it', displayName: 'it', type: 'rhyme', description: 'Vần IT' }
          ]
        },
        {
          id: 4,
          title: 'Vần UT - ƯT - UÔT',
          isReview: false,
          sounds: [
            { id: 'ut', name: 'ut', displayName: 'ut', type: 'rhyme', description: 'Vần UT' },
            { id: 'ưt', name: 'ưt', displayName: 'ưt', type: 'rhyme', description: 'Vần ƯT' },
            { id: 'uôt', name: 'uôt', displayName: 'uôt', type: 'rhyme', description: 'Vần UÔT' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Tết Nguyên Đán',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 12: Vui chơi
    {
      id: 12,
        name: 'Vui chơi',
        nameEn: 'Playtime',
        description: 'Các hoạt động vui chơi',
        descriptionEn: 'Fun activities',
      color: '#f6f0b3',
      lessons: [
        {
          id: 1,
          title: 'Vần IÊT - ƯƠT - OAT',
          isReview: false,
          sounds: [
            { id: 'iêt', name: 'iêt', displayName: 'iêt', type: 'rhyme', description: 'Vần IÊT' },
            { id: 'ươt', name: 'ươt', displayName: 'ươt', type: 'rhyme', description: 'Vần ƯƠT' },
            { id: 'oat', name: 'oat', displayName: 'oat', type: 'rhyme', description: 'Vần OAT' }
          ]
        },
        {
          id: 2,
          title: 'Vần OĂT - AC - ĂC',
          isReview: false,
          sounds: [
            { id: 'oăt', name: 'oăt', displayName: 'oăt', type: 'rhyme', description: 'Vần OĂT' },
            { id: 'ac', name: 'ac', displayName: 'ac', type: 'rhyme', description: 'Vần AC' },
            { id: 'ăc', name: 'ăc', displayName: 'ăc', type: 'rhyme', description: 'Vần ĂC' }
          ]
        },
        {
          id: 3,
          title: 'Vần ÂC - OC - ÔC',
          isReview: false,
          sounds: [
            { id: 'âc', name: 'âc', displayName: 'âc', type: 'rhyme', description: 'Vần ÂC' },
            { id: 'oc', name: 'oc', displayName: 'oc', type: 'rhyme', description: 'Vần OC' },
            { id: 'ôc', name: 'ôc', displayName: 'ôc', type: 'rhyme', description: 'Vần ÔC' }
          ]
        },
        {
          id: 4,
          title: 'Vần ƯC - UC - IC',
          isReview: false,
          sounds: [
            { id: 'ưc', name: 'ưc', displayName: 'ưc', type: 'rhyme', description: 'Vần ƯC' },
            { id: 'uc', name: 'uc', displayName: 'uc', type: 'rhyme', description: 'Vần UC' },
            { id: 'ic', name: 'ic', displayName: 'ic', type: 'rhyme', description: 'Vần IC' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Chơi đùa cùng bạn',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 13: Sức khỏe
    {
      id: 13,
        name: 'Sức khỏe',
        nameEn: 'Health',
        description: 'Học về sức khỏe và vệ sinh',
        descriptionEn: 'Learn about health and hygiene',
      color: '#2e7a55',
      lessons: [
        {
          id: 1,
          title: 'Vần ÊC - IÊC - UÔC',
          isReview: false,
          sounds: [
            { id: 'êc', name: 'êc', displayName: 'êc', type: 'rhyme', description: 'Vần ÊC' },
            { id: 'iêc', name: 'iêc', displayName: 'iêc', type: 'rhyme', description: 'Vần IÊC' },
            { id: 'uôc', name: 'uôc', displayName: 'uôc', type: 'rhyme', description: 'Vần UÔC' }
          ]
        },
        {
          id: 2,
          title: 'Vần ƯƠC - OAC - ANG',
          isReview: false,
          sounds: [
            { id: 'ươc', name: 'ươc', displayName: 'ươc', type: 'rhyme', description: 'Vần ƯƠC' },
            { id: 'oac', name: 'oac', displayName: 'oac', type: 'rhyme', description: 'Vần OAC' },
            { id: 'ang', name: 'ang', displayName: 'ang', type: 'rhyme', description: 'Vần ANG' }
          ]
        },
        {
          id: 3,
          title: 'Vần ĂNG - ÂNG - ONG',
          isReview: false,
          sounds: [
            { id: 'ăng', name: 'ăng', displayName: 'ăng', type: 'rhyme', description: 'Vần ĂNG' },
            { id: 'âng', name: 'âng', displayName: 'âng', type: 'rhyme', description: 'Vần ÂNG' },
            { id: 'ong', name: 'ong', displayName: 'ong', type: 'rhyme', description: 'Vần ONG' }
          ]
        },
        {
          id: 4,
          title: 'Vần ÔNG - UNG - ƯNG',
          isReview: false,
          sounds: [
            { id: 'ông', name: 'ông', displayName: 'ông', type: 'rhyme', description: 'Vần ÔNG' },
            { id: 'ung', name: 'ung', displayName: 'ung', type: 'rhyme', description: 'Vần UNG' },
            { id: 'ưng', name: 'ưng', displayName: 'ưng', type: 'rhyme', description: 'Vần ƯNG' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Vệ sinh sạch sẽ',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 14: Quê hương
    {
      id: 14,
        name: 'Quê hương',
        nameEn: 'Homeland',
        description: 'Tìm hiểu về quê hương đất nước',
        descriptionEn: 'Discover your homeland and country',
      color: '#f8d1a3',
      lessons: [
        {
          id: 1,
          title: 'Vần ENG - IÊNG - ANH',
          isReview: false,
          sounds: [
            { id: 'eng', name: 'eng', displayName: 'eng', type: 'rhyme', description: 'Vần ENG' },
            { id: 'iêng', name: 'iêng', displayName: 'iêng', type: 'rhyme', description: 'Vần IÊNG' },
            { id: 'anh', name: 'anh', displayName: 'anh', type: 'rhyme', description: 'Vần ANH' }
          ]
        },
        {
          id: 2,
          title: 'Vần ÊNH - INH - OONG',
          isReview: false,
          sounds: [
            { id: 'ênh', name: 'ênh', displayName: 'ênh', type: 'rhyme', description: 'Vần ÊNH' },
            { id: 'inh', name: 'inh', displayName: 'inh', type: 'rhyme', description: 'Vần INH' },
            { id: 'oong', name: 'oong', displayName: 'oong', type: 'rhyme', description: 'Vần OONG' }
          ]
        },
        {
          id: 3,
          title: 'Vần OANG - OANH - UÂNG',
          isReview: false,
          sounds: [
            { id: 'oang', name: 'oang', displayName: 'oang', type: 'rhyme', description: 'Vần OANG' },
            { id: 'oanh', name: 'oanh', displayName: 'oanh', type: 'rhyme', description: 'Vần OANH' },
            { id: 'uâng', name: 'uâng', displayName: 'uâng', type: 'rhyme', description: 'Vần UÂNG' }
          ]
        },
        {
          id: 4,
          title: 'Vần ƯƠNG - ACH - ÊCH',
          isReview: false,
          sounds: [
            { id: 'ương', name: 'ương', displayName: 'ương', type: 'rhyme', description: 'Vần ƯƠNG' },
            { id: 'ach', name: 'ach', displayName: 'ach', type: 'rhyme', description: 'Vần ACH' },
            { id: 'êch', name: 'êch', displayName: 'êch', type: 'rhyme', description: 'Vần ÊCH' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Làng quê em',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 15: Bạn bè
    {
      id: 15,
        name: 'Bạn bè',
        nameEn: 'Friends',
        description: 'Tình bạn và kết nối',
        descriptionEn: 'Friendship and connection',
      color: '#4ca76f',
      lessons: [
        {
          id: 1,
          title: 'Vần ICH - OACH - IAU',
          isReview: false,
          sounds: [
            { id: 'ich', name: 'ich', displayName: 'ich', type: 'rhyme', description: 'Vần ICH' },
            { id: 'oach', name: 'oach', displayName: 'oach', type: 'rhyme', description: 'Vần OACH' },
            { id: 'iau', name: 'iau', displayName: 'iau', type: 'rhyme', description: 'Vần IAU' }
          ]
        },
        {
          id: 2,
          title: 'Vần YÊU - UAY - UÂY',
          isReview: false,
          sounds: [
            { id: 'yêu', name: 'yêu', displayName: 'yêu', type: 'rhyme', description: 'Vần YÊU' },
            { id: 'uay', name: 'uay', displayName: 'uay', type: 'rhyme', description: 'Vần UAY' },
            { id: 'uây', name: 'uây', displayName: 'uây', type: 'rhyme', description: 'Vần UÂY' }
          ]
        },
        {
          id: 3,
          title: 'Thanh hỏi - ngã',
          isReview: false,
          sounds: [
            { id: 'thanh-hoi', name: 'thanh hỏi', displayName: '? (hỏi)', type: 'rhyme', description: 'Thanh hỏi' },
            { id: 'thanh-nga', name: 'thanh ngã', displayName: '~ (ngã)', type: 'rhyme', description: 'Thanh ngã' }
          ]
        },
        {
          id: 4,
          title: 'Thanh sắc - nặng',
          isReview: false,
          sounds: [
            { id: 'thanh-sac', name: 'thanh sắc', displayName: '´ (sắc)', type: 'rhyme', description: 'Thanh sắc' },
            { id: 'thanh-nang', name: 'thanh nặng', displayName: '. (nặng)', type: 'rhyme', description: 'Thanh nặng' }
          ]
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Tình bạn đẹp',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 16: Mùa xuân
    {
      id: 16,
        name: 'Mùa xuân',
        nameEn: 'Spring',
        description: 'Chào đón mùa xuân',
        descriptionEn: 'Welcome spring',
      color: '#f7c27d',
      lessons: [
        {
          id: 1,
          title: 'Thanh huyền - không',
          isReview: false,
          sounds: [
            { id: 'thanh-huyen', name: 'thanh huyền', displayName: '` (huyền)', type: 'rhyme', description: 'Thanh huyền' },
            { id: 'thanh-khong', name: 'thanh không', displayName: '(không dấu)', type: 'rhyme', description: 'Thanh không' }
          ]
        },
        {
          id: 2,
          title: 'Ôn tập 6 thanh',
          isReview: false,
          sounds: []
        },
        {
          id: 3,
          title: 'Luyện đọc văn bản',
          isReview: false,
          sounds: []
        },
        {
          id: 4,
          title: 'Luyện viết câu',
          isReview: false,
          sounds: []
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Hoa đào mùa xuân',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 17: Biển đảo
    {
      id: 17,
        name: 'Biển đảo',
        nameEn: 'Sea and Islands',
        description: 'Khám phá biển và đảo Việt Nam',
        descriptionEn: 'Explore Vietnamese seas and islands',
      color: '#8fd9b4',
      lessons: [
        {
          id: 1,
          title: 'Luyện đọc - hiểu 1',
          isReview: false,
          sounds: []
        },
        {
          id: 2,
          title: 'Luyện đọc - hiểu 2',
          isReview: false,
          sounds: []
        },
        {
          id: 3,
          title: 'Luyện viết đoạn văn 1',
          isReview: false,
          sounds: []
        },
        {
          id: 4,
          title: 'Luyện viết đoạn văn 2',
          isReview: false,
          sounds: []
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Biển quê em',
          sounds: []
        }
      ]
    },
    // CHỦ ĐỀ 18: Ước mơ
    {
      id: 18,
        name: 'Ước mơ',
        nameEn: 'Dreams',
        description: 'Những ước mơ tuổi thơ',
        descriptionEn: 'Childhood dreams',
      color: '#f8c8d8',
      lessons: [
        {
          id: 1,
          title: 'Đọc văn bản dài 1',
          isReview: false,
          sounds: []
        },
        {
          id: 2,
          title: 'Đọc văn bản dài 2',
          isReview: false,
          sounds: []
        },
        {
          id: 3,
          title: 'Viết sáng tạo 1',
          isReview: false,
          sounds: []
        },
        {
          id: 4,
          title: 'Viết sáng tạo 2',
          isReview: false,
          sounds: []
        },
        {
          id: 5,
          title: 'Ôn tập & Kể chuyện',
          isReview: true,
          storyTitle: 'Em có ước mơ',
          sounds: []
        }
      ]
    }
  ]
};

// Export summary for quick reference
export const curriculumSummary = curriculum.topics.map(topic => ({
  id: topic.id,
  name: topic.name,
  sounds: topic.lessons
    .filter(l => !l.isReview)
    .flatMap(l => l.sounds.map(s => s.displayName))
    .join(', '),
  reviewStory: topic.lessons.find(l => l.isReview)?.storyTitle || ''
}));
