export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Avatar {
  id: string;
  userId: string;
  name: string;
  videoUrl: string;
  thumbnailUrl?: string;
  personalityTraits: PersonalityTraits;
  voiceCharacteristics: VoiceCharacteristics;
  relationshipMode: RelationshipMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalityTraits {
  tone: 'warm' | 'playful' | 'serious' | 'caring' | 'energetic';
  communicationStyle: 'formal' | 'casual' | 'intimate' | 'friendly';
  interests: string[];
  commonPhrases: string[];
  emotionalStyle: 'supportive' | 'encouraging' | 'humorous' | 'romantic';
}

export interface VoiceCharacteristics {
  pitch: 'high' | 'medium' | 'low';
  pace: 'slow' | 'medium' | 'fast';
  accent?: string;
  voiceId?: string; // ElevenLabs voice ID
}

export type RelationshipMode = 'family' | 'friend' | 'crush' | 'partner';

export interface Conversation {
  id: string;
  avatarId: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'avatar';
  timestamp: Date;
  audioUrl?: string;
  isVoiceMessage?: boolean;
}

export interface ProcessingStatus {
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  audio?: string;
}