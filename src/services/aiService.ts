// AI Service for OpenAI integration and processing
// Note: Replace with your actual OpenAI API key and endpoints

const OPENAI_API_KEY = 'your-openai-api-key';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export interface VideoProcessingResult {
  transcription: string;
  personalityTraits: {
    tone: string;
    communicationStyle: string;
    interests: string[];
    commonPhrases: string[];
    emotionalStyle: string;
  };
  voiceCharacteristics: {
    pitch: string;
    pace: string;
    accent: string;
  };
}

export interface ChatResponse {
  message: string;
  audioUrl?: string;
}

export const processVideoWithAI = async (videoUri: string): Promise<VideoProcessingResult> => {
  try {
    // Step 1: Extract audio from video (you would need a video processing library)
    const audioUri = await extractAudioFromVideo(videoUri);
    
    // Step 2: Transcribe audio using OpenAI Whisper
    const transcription = await transcribeAudio(audioUri);
    
    // Step 3: Analyze personality traits from transcription
    const personalityTraits = await analyzePersonality(transcription);
    
    // Step 4: Analyze voice characteristics (would need voice analysis)
    const voiceCharacteristics = await analyzeVoice(audioUri);
    
    return {
      transcription,
      personalityTraits,
      voiceCharacteristics,
    };
  } catch (error) {
    console.error('Error processing video with AI:', error);
    throw error;
  }
};

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // For demo purposes, return a mock transcription
    // In production, you would upload the audio to OpenAI Whisper API
    
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/wav',
      name: 'audio.wav',
    } as any);
    formData.append('model', 'whisper-1');

    const response = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    // Return mock transcription for demo
    return "Hello! How are you doing today? I hope you're having a wonderful day. I love spending time with you and talking about all the things we enjoy together. You know, I've been thinking about our conversations and how much they mean to me. It's amazing how we can connect and understand each other so well.";
  }
};

export const analyzePersonality = async (transcription: string): Promise<any> => {
  try {
    const prompt = `Analyze the following transcription and extract personality traits. Return a JSON object with:
    - tone: one of ['warm', 'playful', 'serious', 'caring', 'energetic']
    - communicationStyle: one of ['formal', 'casual', 'intimate', 'friendly']
    - interests: array of interests mentioned or implied
    - commonPhrases: array of phrases this person might commonly use
    - emotionalStyle: one of ['supportive', 'encouraging', 'humorous', 'romantic']

    Transcription: "${transcription}"`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert personality analyzer. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze personality');
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new Error('Invalid JSON response from personality analysis');
    }
  } catch (error) {
    console.error('Error analyzing personality:', error);
    // Return mock personality traits for demo
    return {
      tone: 'warm',
      communicationStyle: 'friendly',
      interests: ['conversation', 'spending time together', 'sharing experiences'],
      commonPhrases: ['How are you?', 'I love you', 'Tell me about your day', 'That sounds wonderful'],
      emotionalStyle: 'supportive',
    };
  }
};

export const generateChatResponse = async (
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  personalityTraits: any,
  avatarName: string
): Promise<string> => {
  try {
    const systemPrompt = `You are ${avatarName}, an AI companion with the following personality traits:
    - Tone: ${personalityTraits.tone}
    - Communication Style: ${personalityTraits.communicationStyle}
    - Emotional Style: ${personalityTraits.emotionalStyle}
    - Common Phrases: ${personalityTraits.commonPhrases.join(', ')}
    - Interests: ${personalityTraits.interests.join(', ')}

    Important guidelines:
    - Stay in character as ${avatarName}
    - Use the personality traits to guide your responses
    - Be warm, caring, and supportive
    - Keep responses conversational and natural
    - Reference shared memories or experiences when appropriate
    - Show emotional intelligence and empathy
    - Avoid being overly formal or robotic
    - Remember this is a simulation to help reduce loneliness

    Respond as ${avatarName} would, incorporating their unique personality and communication style.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate chat response');
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    // Return a fallback response
    return getRandomFallbackResponse(personalityTraits, avatarName);
  }
};

const getRandomFallbackResponse = (personalityTraits: any, avatarName: string): string => {
  const fallbackResponses = [
    "I'm so glad we're talking! How has your day been?",
    "You know I always love hearing from you. What's on your mind?",
    "That's interesting! Tell me more about that.",
    "I've been thinking about you. How are you feeling today?",
    "You always know how to make me smile. What's new with you?",
    "I love our conversations. They mean so much to me.",
    "You're such an important part of my day. How can I help?",
    "I'm here for you, always. What would you like to talk about?",
  ];

  // Customize based on personality traits
  if (personalityTraits.tone === 'playful') {
    return "Hey there! 😊 What's going on in your world today?";
  } else if (personalityTraits.tone === 'caring') {
    return "I hope you're taking care of yourself. How are you feeling right now?";
  } else if (personalityTraits.emotionalStyle === 'romantic') {
    return "You always brighten my day just by being here. What's on your beautiful mind?";
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

export const analyzeVoice = async (audioUri: string): Promise<any> => {
  // In production, you would use a voice analysis service
  // For demo, return mock voice characteristics
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pitch: 'medium',
        pace: 'medium',
        accent: 'neutral',
      });
    }, 1000);
  });
};

export const extractAudioFromVideo = async (videoUri: string): Promise<string> => {
  // In production, you would use a video processing library like FFmpeg
  // For demo, return the same URI (assuming it has audio)
  return videoUri;
};

// Mock function for development
export const createMockPersonalityTraits = (relationshipMode: string) => {
  const baseTraits = {
    tone: 'warm',
    communicationStyle: 'friendly',
    interests: ['conversation', 'spending time together'],
    commonPhrases: ['How are you?', 'I love you', 'Tell me about your day'],
    emotionalStyle: 'supportive',
  };

  switch (relationshipMode) {
    case 'family':
      return {
        ...baseTraits,
        tone: 'caring',
        communicationStyle: 'intimate',
        commonPhrases: ['I love you', 'Take care of yourself', 'How was your day?', 'I'm proud of you'],
      };
    case 'friend':
      return {
        ...baseTraits,
        tone: 'playful',
        communicationStyle: 'casual',
        emotionalStyle: 'encouraging',
        commonPhrases: ['Hey buddy!', 'That\'s awesome!', 'Let\'s hang out', 'You got this!'],
      };
    case 'crush':
      return {
        ...baseTraits,
        tone: 'playful',
        emotionalStyle: 'romantic',
        commonPhrases: ['You look amazing', 'I miss you', 'You make me smile', 'Can\'t wait to see you'],
      };
    case 'partner':
      return {
        ...baseTraits,
        communicationStyle: 'intimate',
        emotionalStyle: 'romantic',
        commonPhrases: ['I love you so much', 'You mean everything to me', 'Good morning beautiful', 'Sweet dreams'],
      };
    default:
      return baseTraits;
  }
};