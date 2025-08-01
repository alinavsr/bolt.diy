import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  ProgressBar,
  Card,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../theme/theme';
import { createAvatar } from '../services/avatarService';
import { processVideoWithAI } from '../services/aiService';
import { PersonalityTraits, VoiceCharacteristics, RelationshipMode } from '../types';

interface ProcessingScreenProps {
  navigation: any;
  route: {
    params: {
      videoUri: string;
      name: string;
      relationshipMode: RelationshipMode;
      userId: string;
    };
  };
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  progress: number;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ navigation, route }) => {
  const { videoUri, name, relationshipMode, userId } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'upload',
      title: 'Uploading Video',
      description: 'Securely uploading your video to our servers',
      icon: 'cloud-upload',
      completed: false,
      progress: 0,
    },
    {
      id: 'transcribe',
      title: 'Analyzing Speech',
      description: 'Using AI to understand speech patterns and tone',
      icon: 'mic',
      completed: false,
      progress: 0,
    },
    {
      id: 'personality',
      title: 'Extracting Personality',
      description: 'Identifying unique personality traits and communication style',
      icon: 'person',
      completed: false,
      progress: 0,
    },
    {
      id: 'voice',
      title: 'Voice Analysis',
      description: 'Analyzing voice characteristics for natural synthesis',
      icon: 'volume-high',
      completed: false,
      progress: 0,
    },
    {
      id: 'create',
      title: 'Creating Your Heart',
      description: 'Finalizing your AI companion with all learned traits',
      icon: 'heart',
      completed: false,
      progress: 0,
    },
  ]);

  useEffect(() => {
    startProcessing();
  }, []);

  const updateStepProgress = (stepIndex: number, progress: number, completed: boolean = false) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, progress, completed }
        : step
    ));
    
    // Update overall progress
    const newOverallProgress = ((stepIndex + progress) / steps.length) * 100;
    setOverallProgress(newOverallProgress);
  };

  const startProcessing = async () => {
    try {
      // Step 1: Upload Video
      setCurrentStep(0);
      await simulateProgress(0, 1000);
      updateStepProgress(0, 1, true);

      // Step 2: Transcribe Audio
      setCurrentStep(1);
      const transcription = await processVideoTranscription(videoUri);
      updateStepProgress(1, 1, true);

      // Step 3: Extract Personality
      setCurrentStep(2);
      const personalityTraits = await extractPersonalityTraits(transcription, relationshipMode);
      updateStepProgress(2, 1, true);

      // Step 4: Analyze Voice
      setCurrentStep(3);
      const voiceCharacteristics = await analyzeVoiceCharacteristics(videoUri);
      updateStepProgress(3, 1, true);

      // Step 5: Create Avatar
      setCurrentStep(4);
      const newAvatarId = await createAvatar(
        userId,
        name,
        videoUri,
        relationshipMode,
        personalityTraits,
        voiceCharacteristics
      );
      updateStepProgress(4, 1, true);
      setAvatarId(newAvatarId);

      // Complete
      setTimeout(() => {
        navigation.replace('MainTabs', {
          screen: 'Home',
          params: { newAvatarId }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Processing error:', error);
      setError(error.message || 'Failed to process video');
    }
  };

  const simulateProgress = (stepIndex: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        updateStepProgress(stepIndex, Math.min(progress, 0.9));
        
        if (progress >= 0.9) {
          clearInterval(interval);
          resolve();
        }
      }, duration / 10);
    });
  };

  const processVideoTranscription = async (videoUri: string): Promise<string> => {
    // Simulate AI transcription
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "Hello! How are you doing today? I hope you're having a wonderful day. I love spending time with you and talking about all the things we enjoy together.";
  };

  const extractPersonalityTraits = async (
    transcription: string, 
    relationshipMode: RelationshipMode
  ): Promise<PersonalityTraits> => {
    // Simulate AI personality extraction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseTraits: PersonalityTraits = {
      tone: 'warm',
      communicationStyle: 'friendly',
      interests: ['conversation', 'spending time together'],
      commonPhrases: ['How are you?', 'I love you', 'Tell me about your day'],
      emotionalStyle: 'supportive',
    };

    // Customize based on relationship mode
    switch (relationshipMode) {
      case 'family':
        return {
          ...baseTraits,
          tone: 'caring',
          communicationStyle: 'intimate',
          emotionalStyle: 'supportive',
          commonPhrases: ['I love you', 'Take care', 'How was your day?'],
        };
      case 'friend':
        return {
          ...baseTraits,
          tone: 'playful',
          communicationStyle: 'casual',
          emotionalStyle: 'encouraging',
          commonPhrases: ['Hey there!', 'That\'s awesome!', 'Let\'s chat'],
        };
      case 'crush':
        return {
          ...baseTraits,
          tone: 'playful',
          communicationStyle: 'friendly',
          emotionalStyle: 'romantic',
          commonPhrases: ['You look great', 'I miss you', 'You make me smile'],
        };
      case 'partner':
        return {
          ...baseTraits,
          tone: 'warm',
          communicationStyle: 'intimate',
          emotionalStyle: 'romantic',
          commonPhrases: ['I love you', 'You mean everything to me', 'Good morning beautiful'],
        };
      default:
        return baseTraits;
    }
  };

  const analyzeVoiceCharacteristics = async (videoUri: string): Promise<VoiceCharacteristics> => {
    // Simulate voice analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      pitch: 'medium',
      pace: 'medium',
      accent: 'neutral',
    };
  };

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setOverallProgress(0);
    setSteps(prev => prev.map(step => ({ ...step, completed: false, progress: 0 })));
    startProcessing();
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Creation',
      'Are you sure you want to cancel creating this heart?',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        },
      ]
    );
  };

  if (error) {
    return (
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={80} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          
          <View style={styles.errorActions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleRetry}
              style={styles.retryButton}
            >
              Try Again
            </Button>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="heart" size={60} color={theme.colors.primary} />
          <Text style={styles.title}>Creating {name}</Text>
          <Text style={styles.subtitle}>
            Our AI is learning about {name} to create the perfect companion
          </Text>
        </View>

        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.overallProgress}>
              <Text style={styles.progressLabel}>
                Overall Progress: {Math.round(overallProgress)}%
              </Text>
              <ProgressBar 
                progress={overallProgress / 100} 
                style={styles.progressBar}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepIcon}>
                    <Ionicons 
                      name={step.completed ? 'checkmark-circle' : step.icon as any}
                      size={24} 
                      color={
                        step.completed 
                          ? theme.colors.primary 
                          : index === currentStep 
                            ? theme.colors.secondary 
                            : theme.colors.outline
                      } 
                    />
                  </View>
                  
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleCompleted,
                      index === currentStep && styles.stepTitleActive
                    ]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                    
                    {index === currentStep && !step.completed && (
                      <ProgressBar 
                        progress={step.progress} 
                        style={styles.stepProgress}
                        color={theme.colors.secondary}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            🔒 Your video is processed securely and privately
          </Text>
          <Text style={styles.disclaimerSubtext}>
            We only use your video to create your AI companion and never share it
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onBackground,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
  progressCard: {
    borderRadius: borderRadius.lg,
    elevation: 4,
    marginBottom: spacing.xl,
  },
  overallProgress: {
    marginBottom: spacing.xl,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepsContainer: {
    gap: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  stepTitleCompleted: {
    color: theme.colors.primary,
  },
  stepTitleActive: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    opacity: 0.7,
    lineHeight: 20,
  },
  stepProgress: {
    height: 4,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  disclaimer: {
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 14,
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.xs,
    opacity: 0.8,
  },
  disclaimerSubtext: {
    fontSize: 12,
    color: theme.colors.onBackground,
    textAlign: 'center',
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.error,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.8,
  },
  errorActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  retryButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
});

export default ProcessingScreen;