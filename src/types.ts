export type TabType = 
  | 'dashboard'
  | 'story'
  | 'wishes'
  | 'message'
  | 'surprise'
  | 'memories'
  | 'finale';

export interface Memory {
  id: string;
  title: string;
  caption: string;
  description?: string;
  imageUrl: string;
  date?: string;
  likes: number;
  tags?: string[];
}

export interface BirthdayWish {
  id: string;
  category: 'emotional' | 'cute' | 'funny' | 'heartfelt';
  text: string;
  theme: string;
  emoji: string;
}

export interface BirthdaySettings {
  friendName: string;
  senderName: string;
  birthdayDate: string; // YYYY-MM-DD
  customLetterPage1: string;
  customLetterPage2: string;
  musicEnabled: boolean;
}

export interface QuizStep {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  hint?: string;
}
