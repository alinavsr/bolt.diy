import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  Chip,
  Surface,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { theme, spacing, borderRadius } from '../theme/theme';
import { RelationshipMode } from '../types';

const { width } = Dimensions.get('window');

interface CreateAvatarScreenProps {
  navigation: any;
}

const CreateAvatarScreen: React.FC<CreateAvatarScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [relationshipMode, setRelationshipMode] = useState<RelationshipMode>('friend');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your media library to upload videos.'
      );
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        duration: 60000, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check duration
        if (asset.duration && asset.duration > 60000) {
          Alert.alert(
            'Video Too Long',
            'Please select a video that is 60 seconds or shorter.'
          );
          return;
        }

        setVideoUri(asset.uri);
        setVideoDuration(asset.duration || 0);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera access to record videos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        duration: 60000, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setVideoUri(asset.uri);
        setVideoDuration(asset.duration || 0);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!videoUri) {
        Alert.alert('Video Required', 'Please upload or record a video first.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        Alert.alert('Name Required', 'Please enter a name for your heart.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleCreateAvatar();
    }
  };

  const handleCreateAvatar = async () => {
    if (!user?.id || !videoUri || !name.trim()) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 500);

      // Navigate to processing screen
      navigation.navigate('Processing', {
        videoUri,
        name,
        relationshipMode,
        userId: user.id,
      });

      clearInterval(progressInterval);
    } catch (error) {
      Alert.alert('Error', 'Failed to create avatar');
    } finally {
      setLoading(false);
    }
  };

  const relationshipOptions = [
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'friend', label: 'Friend', icon: '👫' },
    { value: 'crush', label: 'Crush', icon: '💕' },
    { value: 'partner', label: 'Partner', icon: '💑' },
  ];

  const VideoUploadStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Upload a Video</Text>
      <Text style={styles.stepSubtitle}>
        Share a 30-60 second video of the person you'd like to talk with
      </Text>

      {videoUri ? (
        <Card style={styles.videoCard}>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
          />
          <Card.Content style={styles.videoInfo}>
            <Text style={styles.videoDuration}>
              Duration: {Math.round(videoDuration / 1000)}s
            </Text>
            <Button
              mode="text"
              onPress={() => setVideoUri(null)}
              textColor={theme.colors.error}
            >
              Remove Video
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadOption} onPress={recordVideo}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.uploadButton}
            >
              <Ionicons name="videocam" size={32} color={theme.colors.onPrimary} />
            </LinearGradient>
            <Text style={styles.uploadOptionText}>Record Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadOption} onPress={pickVideo}>
            <LinearGradient
              colors={[theme.colors.tertiary, theme.colors.secondary]}
              style={styles.uploadButton}
            >
              <Ionicons name="folder" size={32} color={theme.colors.onPrimary} />
            </LinearGradient>
            <Text style={styles.uploadOptionText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>
      )}

      <Surface style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Tips for best results:</Text>
        <Text style={styles.tipText}>• Record in good lighting</Text>
        <Text style={styles.tipText}>• Speak clearly and naturally</Text>
        <Text style={styles.tipText}>• Show different emotions</Text>
        <Text style={styles.tipText}>• Keep it between 30-60 seconds</Text>
      </Surface>
    </View>
  );

  const NameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's their name?</Text>
      <Text style={styles.stepSubtitle}>
        Give your heart a name so you can easily identify them
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.nameInput}
        placeholder="e.g., Mom, Sarah, Alex..."
      />
    </View>
  );

  const RelationshipStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your relationship?</Text>
      <Text style={styles.stepSubtitle}>
        This helps us personalize their personality and conversation style
      </Text>

      <View style={styles.relationshipGrid}>
        {relationshipOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.relationshipOption,
              relationshipMode === option.value && styles.relationshipOptionSelected
            ]}
            onPress={() => setRelationshipMode(option.value as RelationshipMode)}
          >
            <Text style={styles.relationshipEmoji}>{option.icon}</Text>
            <Text style={[
              styles.relationshipLabel,
              relationshipMode === option.value && styles.relationshipLabelSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return <VideoUploadStep />;
      case 2:
        return <NameStep />;
      case 3:
        return <RelationshipStep />;
      default:
        return <VideoUploadStep />;
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={step / 3} 
              style={styles.progressBar}
              color={theme.colors.primary}
            />
            <Text style={styles.progressText}>Step {step} of 3</Text>
          </View>
        </View>

        {renderStep()}

        {loading && (
          <View style={styles.loadingContainer}>
            <ProgressBar 
              progress={uploadProgress} 
              style={styles.uploadProgress}
              color={theme.colors.primary}
            />
            <Text style={styles.loadingText}>
              Creating your heart... {Math.round(uploadProgress * 100)}%
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={() => setStep(step - 1)}
            style={styles.backButton}
            disabled={loading}
          >
            Back
          </Button>
        )}
        
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          loading={loading}
          disabled={loading}
        >
          {step === 3 ? 'Create Heart' : 'Next'}
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onBackground,
    opacity: 0.7,
    textAlign: 'center',
  },
  stepContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: theme.colors.onBackground,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  videoCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  video: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  videoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoDuration: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  uploadOption: {
    alignItems: 'center',
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  uploadOptionText: {
    fontSize: 14,
    color: theme.colors.onBackground,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  nameInput: {
    fontSize: 18,
    marginBottom: spacing.lg,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relationshipOption: {
    width: (width - spacing.lg * 3) / 2,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  relationshipOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  relationshipEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  relationshipLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  relationshipLabelSelected: {
    color: theme.colors.primary,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  uploadProgress: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  nextButton: {
    flex: 2,
    borderRadius: borderRadius.lg,
  },
});

export default CreateAvatarScreen;