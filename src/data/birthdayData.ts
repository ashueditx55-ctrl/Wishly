import { BirthdayWish, Memory, QuizStep } from '../types';

export const INITIAL_WISHES: BirthdayWish[] = [
  // Heartfelt
  {
    id: 'w-1',
    category: 'heartfelt',
    theme: 'Pure Gratitude',
    emoji: '🌸',
    text: "Having someone like you in my life is the greatest gift. You bring calm to chaos and joy to every ordinary day. May this year bring you all the warmth, peace, and dreams your beautiful soul deserves.",
  },
  {
    id: 'w-2',
    category: 'heartfelt',
    theme: 'Always by Your Side',
    emoji: '✨',
    text: "Happy Birthday! Through every high and low, you have been my favorite person to laugh with, vent to, and grow beside. I'm endlessly proud of the person you are becoming.",
  },
  {
    id: 'w-3',
    category: 'heartfelt',
    theme: 'Cherished Bond',
    emoji: '🤍',
    text: "No matter where life takes us, remember that you will always hold a permanent, tender place in my heart. Happy birthday to the one who makes the world infinitely softer.",
  },

  // Cute
  {
    id: 'w-4',
    category: 'cute',
    theme: 'Sweetest Human',
    emoji: '🧁',
    text: "Happy Birthday to the human equivalent of warm sunshine, fresh strawberries, and morning coffee! May your day be filled with cuddles, sweet treats, and everything pink.",
  },
  {
    id: 'w-5',
    category: 'cute',
    theme: 'Cutie Pie Level 100',
    emoji: '🎀',
    text: "Wishing a truly magical birthday to my absolute favorite cutie! Eat as much cake as you want today—birthday calories are officially illegal by cosmic law!",
  },
  {
    id: 'w-6',
    category: 'cute',
    theme: 'Pocket Full of Smiles',
    emoji: '🧸',
    text: "You radiate so much kindness and sweetness wherever you go. I hope today brings you as many smiles as you effortlessly give everyone else.",
  },

  // Emotional
  {
    id: 'w-7',
    category: 'emotional',
    theme: 'Tears of Joy',
    emoji: '🥺',
    text: "I was looking back at old photos and memories of us today. My eyes welled up with happy tears realizing how precious every second with you has been. Thank you for being my anchor.",
  },
  {
    id: 'w-8',
    category: 'emotional',
    theme: 'Unspoken Words',
    emoji: '💌',
    text: "Sometimes words fail to express how deeply you touch my life. Today, I just want you to know how deeply loved, valued, and irreplaceable you are to me.",
  },
  {
    id: 'w-9',
    category: 'emotional',
    theme: 'A Lifetime Wish',
    emoji: '🕯️',
    text: "When you blow out your birthday candles today, please know that my wish for you has already come true simply by having you in this world.",
  },

  // Funny
  {
    id: 'w-10',
    category: 'funny',
    theme: 'Level Up',
    emoji: '🎮',
    text: "Happy Birthday! You aren't getting older, you're just leveling up and becoming an even rarer, high-level legendary companion!",
  },
  {
    id: 'w-11',
    category: 'funny',
    theme: 'Best Gift Award',
    emoji: '🎁',
    text: "I was going to buy you the most extravagant, perfect gift in the universe, but then I realized: you already have my friendship, so you've already peaked.",
  },
  {
    id: 'w-12',
    category: 'funny',
    theme: 'Forever Young',
    emoji: '🎂',
    text: "Happy Birthday! Let's celebrate the day you blessed the world with your sass, charm, and questionable taste in music. Cheers to another year of surviving me!",
  },
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'm-1',
    title: 'Our Beautiful Friendship',
    caption: 'Our Beautiful Friendship',
    description: 'Some friendships make ordinary moments feel like the most beautiful memories.',
    imageUrl: '/memories/our_beautiful_friendship.svg',
    date: 'Golden Sunset',
    likes: 48,
    tags: ['Best Friends', 'Sunset Walk'],
  },
  {
    id: 'm-2',
    title: 'Our Crazy Moments',
    caption: 'Our Crazy Moments',
    description: 'Every silly moment with you becomes another memory worth smiling about.',
    imageUrl: '/memories/crazy_funny_moments.svg',
    date: 'Laughter & Smiles',
    likes: 62,
    tags: ['Inside Jokes', 'Pure Fun'],
  },
  {
    id: 'm-3',
    title: 'Little Things, Big Memories',
    caption: 'Little Things, Big Memories',
    description: "It's the little moments that make our friendship so special.",
    imageUrl: '/memories/little_things_big_memories.svg',
    date: 'Sweet Little Things',
    likes: 39,
    tags: ['Letters & Keepsakes', 'Memories'],
  },
  {
    id: 'm-4',
    title: 'Birthday Sparkles',
    caption: 'Birthday Sparkles',
    description: 'Wishing you a birthday filled with happiness, laughter and beautiful surprises.',
    imageUrl: '/memories/birthday_sparkles.svg',
    date: 'Birthday Magic',
    likes: 74,
    tags: ['Celebration', 'Make a Wish'],
  },
  {
    id: 'm-5',
    title: 'Forever Best Friends',
    caption: 'Forever Best Friends',
    description: 'No matter where life takes us, our friendship will always be special.',
    imageUrl: '/memories/forever_best_friends.svg',
    date: 'Always & Forever',
    likes: 88,
    tags: ['Soul Sisters', 'Cherished Bond'],
  },
];

export const BIRTHDAY_QUIZ: QuizStep[] = [
  {
    id: 1,
    question: 'What makes our friendship special?',
    options: [
      'Endless Laughter',
      'Trust & Understanding',
      'Crazy Memories',
      'All of These',
    ],
    correctAnswer: 'D',
    correctAnswers: ['D', 'All of These'],
  },
  {
    id: 2,
    question: 'Who is more likely to start a random conversation?',
    options: [
      'Me',
      'You',
      'Both of Us',
      'Depends on the Mood',
    ],
    correctAnswer: 'B',
    correctAnswers: ['B', 'You'],
  },
  {
    id: 3,
    question: "What is our friendship's biggest superpower?",
    options: [
      'Making Each Other Laugh',
      'Understanding Without Words',
      'Always Having Fun',
      'Everything Together',
    ],
    correctAnswer: 'D',
    correctAnswers: ['D', 'Everything Together'],
  },
  {
    id: 4,
    question: 'Which memory deserves a replay?',
    options: [
      'Our Funniest Moments',
      'Our Long Conversations',
      'Our Random Adventures',
      'Every Single One',
    ],
    correctAnswer: 'D',
    correctAnswers: ['D', 'Every Single One'],
  },
  {
    id: 5,
    question: 'What does our friendship spell?',
    options: [
      'KMW',
      'BFF',
      'LOL',
      'BF',
    ],
    correctAnswer: 'B',
    correctAnswers: ['B', 'D', 'BFF', 'BF'],
  },
];
