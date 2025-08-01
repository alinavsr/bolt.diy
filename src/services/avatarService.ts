import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from './firebase';
import { Avatar, PersonalityTraits, VoiceCharacteristics, RelationshipMode } from '../types';

export const createAvatar = async (
  userId: string,
  name: string,
  videoUri: string,
  relationshipMode: RelationshipMode,
  personalityTraits: PersonalityTraits,
  voiceCharacteristics: VoiceCharacteristics,
  thumbnailUri?: string
): Promise<string> => {
  try {
    // Upload video to Firebase Storage
    const videoResponse = await fetch(videoUri);
    const videoBlob = await videoResponse.blob();
    const videoRef = ref(storage, `avatars/${userId}/${Date.now()}_video.mp4`);
    await uploadBytes(videoRef, videoBlob);
    const videoUrl = await getDownloadURL(videoRef);

    // Upload thumbnail if provided
    let thumbnailUrl: string | undefined;
    if (thumbnailUri) {
      const thumbnailResponse = await fetch(thumbnailUri);
      const thumbnailBlob = await thumbnailResponse.blob();
      const thumbnailRef = ref(storage, `avatars/${userId}/${Date.now()}_thumbnail.jpg`);
      await uploadBytes(thumbnailRef, thumbnailBlob);
      thumbnailUrl = await getDownloadURL(thumbnailRef);
    }

    // Create avatar document
    const avatarData = {
      userId,
      name,
      videoUrl,
      thumbnailUrl,
      personalityTraits,
      voiceCharacteristics,
      relationshipMode,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(firestore, 'avatars'), avatarData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
};

export const getAvatarsForUser = async (userId: string): Promise<Avatar[]> => {
  try {
    const q = query(
      collection(firestore, 'avatars'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const avatars: Avatar[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      avatars.push({
        id: doc.id,
        userId: data.userId,
        name: data.name,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        personalityTraits: data.personalityTraits,
        voiceCharacteristics: data.voiceCharacteristics,
        relationshipMode: data.relationshipMode,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return avatars;
  } catch (error) {
    console.error('Error getting avatars:', error);
    throw error;
  }
};

export const getAvatarById = async (avatarId: string): Promise<Avatar | null> => {
  try {
    const docRef = doc(firestore, 'avatars', avatarId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        name: data.name,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        personalityTraits: data.personalityTraits,
        voiceCharacteristics: data.voiceCharacteristics,
        relationshipMode: data.relationshipMode,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting avatar:', error);
    throw error;
  }
};

export const updateAvatar = async (
  avatarId: string,
  updates: Partial<Omit<Avatar, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(firestore, 'avatars', avatarId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

export const deleteAvatar = async (avatarId: string): Promise<void> => {
  try {
    // Get avatar data first to delete associated files
    const avatar = await getAvatarById(avatarId);
    
    if (avatar) {
      // Delete video file from storage
      if (avatar.videoUrl) {
        try {
          const videoRef = ref(storage, avatar.videoUrl);
          await deleteObject(videoRef);
        } catch (error) {
          console.warn('Error deleting video file:', error);
        }
      }
      
      // Delete thumbnail file from storage
      if (avatar.thumbnailUrl) {
        try {
          const thumbnailRef = ref(storage, avatar.thumbnailUrl);
          await deleteObject(thumbnailRef);
        } catch (error) {
          console.warn('Error deleting thumbnail file:', error);
        }
      }
    }
    
    // Delete avatar document
    const docRef = doc(firestore, 'avatars', avatarId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw error;
  }
};

// Mock data for development/testing
export const createMockAvatars = async (userId: string): Promise<void> => {
  const mockAvatars = [
    {
      name: 'Sarah',
      relationshipMode: 'family' as RelationshipMode,
      personalityTraits: {
        tone: 'warm' as const,
        communicationStyle: 'caring' as const,
        interests: ['cooking', 'gardening', 'reading'],
        commonPhrases: ['How was your day?', 'I love you', 'Take care of yourself'],
        emotionalStyle: 'supportive' as const,
      },
      voiceCharacteristics: {
        pitch: 'medium' as const,
        pace: 'medium' as const,
        accent: 'american',
      },
    },
    {
      name: 'Alex',
      relationshipMode: 'friend' as RelationshipMode,
      personalityTraits: {
        tone: 'playful' as const,
        communicationStyle: 'casual' as const,
        interests: ['gaming', 'movies', 'sports'],
        commonPhrases: ['Hey buddy!', 'That\'s awesome!', 'Let\'s hang out'],
        emotionalStyle: 'encouraging' as const,
      },
      voiceCharacteristics: {
        pitch: 'medium' as const,
        pace: 'fast' as const,
        accent: 'neutral',
      },
    },
  ];

  for (const mockAvatar of mockAvatars) {
    try {
      const avatarData = {
        userId,
        name: mockAvatar.name,
        videoUrl: 'https://example.com/mock-video.mp4', // Mock URL
        thumbnailUrl: undefined,
        personalityTraits: mockAvatar.personalityTraits,
        voiceCharacteristics: mockAvatar.voiceCharacteristics,
        relationshipMode: mockAvatar.relationshipMode,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(firestore, 'avatars'), avatarData);
    } catch (error) {
      console.error('Error creating mock avatar:', error);
    }
  }
};