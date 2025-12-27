// Detailed lesson content
// Lesson 1: Sound A - Topic 1

export type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  image?: string;
  audio?: string;
  syllables: string[];
};

export type GameQuestion = {
  id: string;
  type: 'image-select' | 'sound-match' | 'blend' | 'fill-blank' | 'drag-drop' | 'trace';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  image?: string;
  audio?: string;
};

export type LessonContent = {
  id: string;
  topicId: number;
  lessonId: number;
  title: string;
  objectives: string[];
  targetSound: {
    letter: string;
    displayName: string;
    pronunciation: string;
    description: string;
  };
  vocabulary: VocabularyItem[];
  games: {
    game1: GameQuestion[];
    game2: GameQuestion[];
    game3?: GameQuestion[];
  };
  sentences: {
    text: string;
    highlight: string[];
    translation?: string;
  }[];
  writingPractice: {
    letter: string;
    strokeOrder: string[];
    guideImage?: string;
  };
};

// ===== BÀI 1: ÂM A =====
export const lesson1_SoundA: LessonContent = {
  id: 'topic1-lesson1-a',
  topicId: 1,
  lessonId: 1,
  title: 'Sound A',
  objectives: [
    'Recognize the letter A, a',
    'Pronounce the sound "a" correctly',
    'Read and write the letter A, a',
    'Identify words containing the sound "a"'
  ],
  targetSound: {
    letter: 'a',
    displayName: 'A a',
    pronunciation: '/a/',
    description: 'The sound "a" is the first vowel in the Vietnamese alphabet. Open your mouth wide and keep your tongue low when pronouncing.'
  },
  vocabulary: [
    {
      id: 'v1',
      word: 'ba',
      meaning: 'father, dad',
      syllables: ['b', 'a'],
      image: '/images/vocab/ba.png'
    },
    {
      id: 'v2',
      word: 'ca',
      meaning: 'cup / to sing',
      syllables: ['c', 'a'],
      image: '/images/vocab/ca.png'
    },
    {
      id: 'v3',
      word: 'lá',
      meaning: 'leaf',
      syllables: ['l', 'á'],
      image: '/images/vocab/la.png'
    },
    {
      id: 'v4',
      word: 'hoa',
      meaning: 'flower',
      syllables: ['h', 'o', 'a'],
      image: '/images/vocab/hoa.png'
    },
    {
      id: 'v5',
      word: 'cá',
      meaning: 'fish',
      syllables: ['c', 'á'],
      image: '/images/vocab/ca-fish.png'
    },
    {
      id: 'v6',
      word: 'nhà',
      meaning: 'house, home',
      syllables: ['nh', 'à'],
      image: '/images/vocab/nha.png'
    },
    {
      id: 'v7',
      word: 'quả',
      meaning: 'fruit',
      syllables: ['qu', 'ả'],
      image: '/images/vocab/qua.png'
    },
    {
      id: 'v8',
      word: 'bà',
      meaning: 'grandmother',
      syllables: ['b', 'à'],
      image: '/images/vocab/ba-grandma.png'
    }
  ],
  games: {
    // Game 1: Select images with sound 'a'
    game1: [
      {
        id: 'g1q1',
        type: 'image-select',
        question: 'Select images with the sound "a"',
        options: ['🌸 hoa', '🌙 mặt trăng', '☀️ mặt trời', '🍎 táo'],
        correctAnswer: ['🌸 hoa', '🍎 táo'],
        hint: 'Look for words containing the letter "a"'
      },
      {
        id: 'g1q2',
        type: 'image-select',
        question: 'Select images with the sound "a"',
        options: ['🐟 cá', '🐦 chim', '🏠 nhà', '🌲 cây'],
        correctAnswer: ['🐟 cá', '🏠 nhà'],
        hint: 'Listen for the "a" sound in each word'
      },
      {
        id: 'g1q3',
        type: 'image-select',
        question: 'Select images with the sound "a"',
        options: ['👴 ba', '👵 bà', '👦 em', '🐕 chó'],
        correctAnswer: ['👴 ba', '👵 bà'],
        hint: 'Both "ba" and "bà" contain the "a" sound'
      },
      {
        id: 'g1q4',
        type: 'image-select',
        question: 'Select ALL images with the sound "a"',
        options: ['🍃 lá', '🍊 cam', '🥛 sữa', '📖 sách'],
        correctAnswer: ['🍃 lá', '🍊 cam', '📖 sách'],
        hint: 'There are 3 words with the "a" sound!'
      }
    ],
    // Game 2: Blend sounds to make words
    game2: [
      {
        id: 'g2q1',
        type: 'blend',
        question: 'Blend "b" + "a" = ?',
        options: ['ba', 'ca', 'la', 'ma'],
        correctAnswer: 'ba',
        hint: 'This word means "father"'
      },
      {
        id: 'g2q2',
        type: 'blend',
        question: 'Blend "c" + "a" = ?',
        options: ['ca', 'ba', 'da', 'ga'],
        correctAnswer: 'ca',
        hint: 'This word means "cup" or "to sing"'
      },
      {
        id: 'g2q3',
        type: 'blend',
        question: 'Blend "l" + "á" = ?',
        options: ['lá', 'là', 'la', 'lả'],
        correctAnswer: 'lá',
        hint: 'This word means "leaf" (with rising tone)'
      },
      {
        id: 'g2q4',
        type: 'blend',
        question: 'Blend "c" + "á" = ?',
        options: ['cá', 'ca', 'cà', 'cả'],
        correctAnswer: 'cá',
        hint: 'This animal lives in water'
      },
      {
        id: 'g2q5',
        type: 'blend',
        question: 'Which sounds make "bà"?',
        options: ['b + à', 'b + a', 'p + à', 'd + à'],
        correctAnswer: 'b + à',
        hint: '"Bà" has the falling tone (grave accent)'
      }
    ],
    // Game 3: Fill in missing letters
    game3: [
      {
        id: 'g3q1',
        type: 'fill-blank',
        question: 'Fill in the blank: b_ (father)',
        options: ['a', 'e', 'o', 'u'],
        correctAnswer: 'a',
        hint: 'The male parent in a family'
      },
      {
        id: 'g3q2',
        type: 'fill-blank',
        question: 'Fill in the blank: c_ (cup)',
        options: ['a', 'e', 'i', 'o'],
        correctAnswer: 'a',
        hint: 'Used for drinking'
      },
      {
        id: 'g3q3',
        type: 'fill-blank',
        question: 'Fill in the blank: l_ (leaf)',
        options: ['á', 'é', 'í', 'ó'],
        correctAnswer: 'á',
        hint: 'Green part of a plant'
      },
      {
        id: 'g3q4',
        type: 'fill-blank',
        question: 'Fill in the blank: nh_ (house)',
        options: ['à', 'a', 'ă', 'â'],
        correctAnswer: 'à',
        hint: 'Where you live'
      }
    ]
  },
  sentences: [
    {
      text: 'Grandma has butter.',
      highlight: ['Grandma', 'butter'],
      translation: 'Grandma has butter.'
    },
    {
      text: 'Dad goes far away.',
      highlight: ['Dad', 'far'],
      translation: 'Dad goes far away.'
    },
    {
      text: 'Fish is in the lake.',
      highlight: ['Fish'],
      translation: 'Fish is in the lake.'
    },
    {
      text: 'The leaf is green.',
      highlight: ['leaf'],
      translation: 'The leaf is green.'
    },
    {
      text: 'The flower smells so good!',
      highlight: ['flower', 'good'],
      translation: 'The flower smells so good!'
    }
  ],
  writingPractice: {
    letter: 'A a',
    strokeOrder: [
      'Start from the bottom left, draw a diagonal line up to the top',
      'From the top, draw a diagonal line down to the right',
      'Draw a horizontal line in the middle, connecting the two diagonal lines'
    ],
    guideImage: '/images/writing/a-stroke.png'
  }
};

// ===== TOPIC 2 - LESSON 5: REVIEW & STORYTELLING =====
export type ReviewLesson = {
  id: string;
  topicId: number;
  lessonId: number;
  title: string;
  summary: {
    soundsLearned: string[];
    combinationTable: {
      consonant: string;
      vowels: { vowel: string; result: string }[];
    }[];
  };
  story: {
    title: string;
    content: string[];
    images?: string[];
    audio?: string;
    comprehensionQuestions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }[];
  };
  practiceExercises: GameQuestion[];
};

export const topic2_Lesson5_Review: ReviewLesson = {
  id: 'topic2-lesson5-review',
  topicId: 2,
  lessonId: 5,
  title: 'Review & Storytelling: The Child and Grandma',
  summary: {
    // Sounds learned in Topic 2
    soundsLearned: ['e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm'],
    // Combination table with vowels from Topic 1
    combinationTable: [
      {
        consonant: 'b',
        vowels: [
          { vowel: 'a', result: 'ba' },
          { vowel: 'e', result: 'be' },
          { vowel: 'ê', result: 'bê' },
          { vowel: 'i', result: 'bi' },
          { vowel: 'o', result: 'bo' },
          { vowel: 'ô', result: 'bô' }
        ]
      },
      {
        consonant: 'c',
        vowels: [
          { vowel: 'a', result: 'ca' },
          { vowel: 'e', result: 'ce' },
          { vowel: 'ô', result: 'cô' },
          { vowel: 'o', result: 'co' }
        ]
      },
      {
        consonant: 'd',
        vowels: [
          { vowel: 'a', result: 'da' },
          { vowel: 'e', result: 'de' },
          { vowel: 'ê', result: 'dê' },
          { vowel: 'i', result: 'di' },
          { vowel: 'o', result: 'do' }
        ]
      },
      {
        consonant: 'đ',
        vowels: [
          { vowel: 'a', result: 'đa' },
          { vowel: 'e', result: 'đe' },
          { vowel: 'ê', result: 'đê' },
          { vowel: 'i', result: 'đi' },
          { vowel: 'o', result: 'đo' },
          { vowel: 'ô', result: 'đô' }
        ]
      },
      {
        consonant: 'g',
        vowels: [
          { vowel: 'a', result: 'ga' },
          { vowel: 'e', result: 'ge' },
          { vowel: 'ô', result: 'gô' },
          { vowel: 'o', result: 'go' }
        ]
      },
      {
        consonant: 'h',
        vowels: [
          { vowel: 'a', result: 'ha' },
          { vowel: 'e', result: 'he' },
          { vowel: 'ê', result: 'hê' },
          { vowel: 'i', result: 'hi' },
          { vowel: 'o', result: 'ho' },
          { vowel: 'ô', result: 'hô' }
        ]
      },
      {
        consonant: 'k',
        vowels: [
          { vowel: 'e', result: 'ke' },
          { vowel: 'ê', result: 'kê' },
          { vowel: 'i', result: 'ki' }
        ]
      },
      {
        consonant: 'l',
        vowels: [
          { vowel: 'a', result: 'la' },
          { vowel: 'e', result: 'le' },
          { vowel: 'ê', result: 'lê' },
          { vowel: 'i', result: 'li' },
          { vowel: 'o', result: 'lo' },
          { vowel: 'ô', result: 'lô' }
        ]
      },
      {
        consonant: 'm',
        vowels: [
          { vowel: 'a', result: 'ma' },
          { vowel: 'e', result: 'me' },
          { vowel: 'ê', result: 'mê' },
          { vowel: 'i', result: 'mi' },
          { vowel: 'o', result: 'mo' },
          { vowel: 'ô', result: 'mô' }
        ]
      }
    ]
  },
  story: {
    title: 'The Child and Grandma',
    content: [
      'The child stays at home with grandma.',
      'Grandma feeds the child rice.',
      'The child helps grandma sweep the house.',
      'Grandma tells stories for the child to listen.',
      'The child loves grandma very much.'
    ],
    images: [
      '/images/stories/be-va-ba-1.png',
      '/images/stories/be-va-ba-2.png',
      '/images/stories/be-va-ba-3.png',
      '/images/stories/be-va-ba-4.png',
      '/images/stories/be-va-ba-5.png'
    ],
    audio: '/audio/stories/be-va-ba.mp3',
    comprehensionQuestions: [
      {
        id: 'cq1',
        question: 'Who does the child stay at home with?',
        options: ['Với mẹ', 'Với bà', 'Với ba', 'Một mình'],
        correctAnswer: 'Với bà',
        explanation: 'The first sentence says: "The child stays at home with grandma."'
      },
      {
        id: 'cq2',
        question: 'What does grandma give the child?',
        options: ['Đi chơi', 'Xem tivi', 'Ăn cơm', 'Đi ngủ'],
        correctAnswer: 'Ăn cơm',
        explanation: 'The second sentence says: "Grandma feeds the child rice."'
      },
      {
        id: 'cq3',
        question: 'How does the child help grandma?',
        options: ['Nấu cơm', 'Quét nhà', 'Giặt đồ', 'Tưới cây'],
        correctAnswer: 'Quét nhà',
        explanation: 'The third sentence says: "The child helps grandma sweep the house."'
      }
    ]
  },
  practiceExercises: [
    {
      id: 'pe1',
      type: 'sound-match',
      question: 'Blend consonant "l" with vowel "ê" = ?',
      options: ['lê', 'le', 'la', 'li'],
      correctAnswer: 'lê',
      hint: 'This is a type of fruit (pear)'
    },
    {
      id: 'pe2',
      type: 'image-select',
      question: 'Select the word with the "ê" sound',
      options: ['🦌 bê', '🐄 bò', '🐖 lợn', '🐔 gà'],
      correctAnswer: '🦌 bê',
      hint: 'A baby cow'
    },
    {
      id: 'pe3',
      type: 'fill-blank',
      question: 'Fill in the blank: B_ stays home with grandma.',
      options: ['é', 'ê', 'e', 'i'],
      correctAnswer: 'é',
      hint: 'A young child'
    },
    {
      id: 'pe4',
      type: 'blend',
      question: 'Which sounds make "me" (tamarind)?',
      options: ['m + e', 'm + ê', 'n + e', 'l + e'],
      correctAnswer: 'm + e',
      hint: 'A sour fruit'
    }
  ]
};

// ===== BÀI 2: ÂM B =====
export const lesson2_SoundB: LessonContent = {
  id: 'topic1-lesson2-b',
  topicId: 1,
  lessonId: 2,
  title: 'Sound B',
  objectives: [
    'Recognize the letter B, b',
    'Pronounce the sound "b" correctly',
    'Read and write the letter B, b',
    'Identify words containing the sound "b"'
  ],
  targetSound: {
    letter: 'b',
    displayName: 'B b',
    pronunciation: '/b/',
    description: 'The sound "b" is a consonant made by pressing your lips together.'
  },
  vocabulary: [
    {
      id: 'v1',
      word: 'ba',
      meaning: 'father, dad',
      syllables: ['b', 'a'],
      image: '/images/vocab/ba.png'
    },
    {
      id: 'v2',
      word: 'bà',
      meaning: 'grandmother',
      syllables: ['b', 'à'],
      image: '/images/vocab/ba-grandma.png'
    },
    {
      id: 'v3',
      word: 'bánh',
      meaning: 'cake',
      syllables: ['b', 'á', 'nh'],
      image: '/images/vocab/banh.png'
    },
    {
      id: 'v4',
      word: 'biển',
      meaning: 'sea',
      syllables: ['b', 'i', 'ê', 'n'],
      image: '/images/vocab/bien.png'
    }
  ],
  games: {
    game1: [
      {
        id: 'g1q1',
        type: 'image-select',
        question: 'Select images with the sound "b"',
        options: ['👴 ba', '👵 bà', '🍰 bánh', '🌊 biển'],
        correctAnswer: ['👴 ba', '👵 bà', '🍰 bánh', '🌊 biển'],
        hint: 'All these words start with "b"'
      }
    ],
    game2: [
      {
        id: 'g2q1',
        type: 'blend',
        question: 'Blend "b" + "a" = ?',
        options: ['ba', 'ca', 'da', 'ga'],
        correctAnswer: 'ba',
        hint: 'This word means "father"'
      }
    ],
    game3: [
      {
        id: 'g3q1',
        type: 'fill-blank',
        question: 'Fill in the blank: b_ (father)',
        options: ['a', 'e', 'o', 'u'],
        correctAnswer: 'a',
        hint: 'The male parent'
      }
    ]
  },
  sentences: [
    {
      text: 'Ba tôi thích ăn bánh.',
      highlight: ['ba', 'bánh'],
      translation: 'My father likes to eat cake.'
    },
    {
      text: 'Bà đi biển.',
      highlight: ['bà', 'biển'],
      translation: 'Grandmother goes to the sea.'
    }
  ],
  writingPractice: {
    letter: 'b',
    strokeOrder: ['Start at top left', 'Curve down to bottom', 'Go up to middle', 'Curve to right']
  }
};

// ===== BÀI 3: ÂM O =====
export const lesson3_SoundO: LessonContent = {
  id: 'topic1-lesson3-o',
  topicId: 1,
  lessonId: 3,
  title: 'Sound O',
  objectives: [
    'Recognize the letter O, o',
    'Pronounce the sound "o" correctly',
    'Read and write the letter O, o',
    'Identify words containing the sound "o"'
  ],
  targetSound: {
    letter: 'o',
    displayName: 'O o',
    pronunciation: '/o/',
    description: 'The sound "o" is a vowel with rounded lips.'
  },
  vocabulary: [
    {
      id: 'v1',
      word: 'ông',
      meaning: 'grandfather',
      syllables: ['ô', 'ng'],
      image: '/images/vocab/ong.png'
    },
    {
      id: 'v2',
      word: 'ông',
      meaning: 'mister',
      syllables: ['ô', 'ng'],
      image: '/images/vocab/ong.png'
    }
  ],
  games: {
    game1: [
      {
        id: 'g1q1',
        type: 'image-select',
        question: 'Select images with the sound "o"',
        options: ['👴 ông', '👵 bà', '🐕 chó', '🐱 mèo'],
        correctAnswer: ['👴 ông', '🐕 chó'],
        hint: 'Look for words with "o" sound'
      }
    ],
    game2: [
      {
        id: 'g2q1',
        type: 'blend',
        question: 'Blend "c" + "o" = ?',
        options: ['co', 'ca', 'cu', 'ce'],
        correctAnswer: 'co',
        hint: 'This word means "to scratch"'
      }
    ],
    game3: []
  },
  sentences: [
    {
      text: 'Ông đi chợ.',
      highlight: ['ông', 'chợ'],
      translation: 'Grandfather goes to market.'
    }
  ],
  writingPractice: {
    letter: 'o',
    strokeOrder: ['Start at top', 'Curve clockwise', 'Close the circle']
  }
};

// ===== BÀI 4: ÂM Ô =====
export const lesson4_SoundOHat: LessonContent = {
  id: 'topic1-lesson4-o-hat',
  topicId: 1,
  lessonId: 4,
  title: 'Sound Ô',
  objectives: [
    'Recognize the letter Ô, ô',
    'Pronounce the sound "ô" correctly',
    'Read and write the letter Ô, ô',
    'Identify words containing the sound "ô"'
  ],
  targetSound: {
    letter: 'ô',
    displayName: 'Ô ô',
    pronunciation: '/ô/',
    description: 'The sound "ô" is a vowel with higher tongue position.'
  },
  vocabulary: [
    {
      id: 'v1',
      word: 'ông',
      meaning: 'grandfather',
      syllables: ['ô', 'ng'],
      image: '/images/vocab/ong.png'
    }
  ],
  games: {
    game1: [
      {
        id: 'g1q1',
        type: 'image-select',
        question: 'Select images with the sound "ô"',
        options: ['👴 ông', '🌳 cây', '🏠 nhà', '🍎 táo'],
        correctAnswer: ['👴 ông'],
        hint: 'Only one word has "ô"'
      }
    ],
    game2: [],
    game3: []
  },
  sentences: [
    {
      text: 'Ông thích uống nước.',
      highlight: ['ông'],
      translation: 'Grandfather likes to drink water.'
    }
  ],
  writingPractice: {
    letter: 'ô',
    strokeOrder: ['Write "o"', 'Add circumflex accent']
  }
};

// ===== BÀI 5: ÔN TẬP =====
export const lesson5_Review: LessonContent = {
  id: 'topic1-lesson5-review',
  topicId: 1,
  lessonId: 5,
  title: 'Review & Story',
  objectives: [
    'Review all sounds learned',
    'Practice reading and writing',
    'Listen to the story',
    'Answer questions about the story'
  ],
  targetSound: {
    letter: 'A, B, O, Ô',
    displayName: 'Review',
    pronunciation: '',
    description: 'Review of all sounds: A, B, O, Ô'
  },
  vocabulary: [
    {
      id: 'v1',
      word: 'ba',
      meaning: 'father',
      syllables: ['b', 'a']
    },
    {
      id: 'v2',
      word: 'ông',
      meaning: 'grandfather',
      syllables: ['ô', 'ng']
    }
  ],
  games: {
    game1: [
      {
        id: 'g1q1',
        type: 'image-select',
        question: 'Which word starts with "b"?',
        options: ['ba', 'ông', 'cá', 'hoa'],
        correctAnswer: ['ba'],
        hint: 'Father starts with "b"'
      }
    ],
    game2: [],
    game3: []
  },
  sentences: [
    {
      text: 'Ba và ông đi chơi.',
      highlight: ['ba', 'ông'],
      translation: 'Father and grandfather go play.'
    }
  ],
  writingPractice: {
    letter: 'A B O Ô',
    strokeOrder: ['Practice all letters']
  }
};

// Export all lessons
export const lessonsContent = {
  'topic1-lesson1': lesson1_SoundA,
  'topic1-lesson2': lesson2_SoundB,
  'topic1-lesson3': lesson3_SoundO,
  'topic1-lesson4': lesson4_SoundOHat,
  'topic1-lesson5': lesson5_Review,
  'topic2-lesson5': topic2_Lesson5_Review
};
