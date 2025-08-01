import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Card,
  Portal,
  Dialog,
  Button,
  Paragraph,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAuth } from '../contexts/AuthContext';
import { theme, spacing, borderRadius } from '../theme/theme';
import { getAvatarById } from '../services/avatarService';
import { generateChatResponse } from '../services/aiService';
import { Avatar, Message } from '../types';

const { width } = Dimensions.get('window');

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      avatarId: string;
      avatarName: string;
    };
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { avatarId, avatarName } = route.params;
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadAvatar();
    initializeChat();
  }, [avatarId]);

  const loadAvatar = async () => {
    try {
      const avatarData = await getAvatarById(avatarId);
      setAvatar(avatarData);
    } catch (error) {
      console.error('Error loading avatar:', error);
      Alert.alert('Error', 'Failed to load avatar data');
    }
  };

  const initializeChat = () => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: getWelcomeMessage(),
      sender: 'avatar',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const getWelcomeMessage = (): string => {
    const welcomeMessages = [
      `Hi there! I'm so happy to see you. How are you doing today?`,
      `Hey! I've been thinking about you. What's new in your world?`,
      `Hello! It's wonderful to connect with you again. How has your day been?`,
      `Hi! I'm here and ready to chat. What's on your mind?`,
    ];
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !avatar || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      const response = await generateChatResponse(
        text,
        conversationHistory,
        avatar.personalityTraits,
        avatar.name
      );

      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'avatar',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, avatarMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble responding right now. Can you try again?",
        sender: 'avatar',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need microphone access to record voice messages.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // For demo, convert voice to text placeholder
        const voiceText = "Voice message: [This would be transcribed from audio]";
        await sendMessage(voiceText);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.avatarMessageContainer]}>
        {!isUser && (
          <View style={styles.avatarIcon}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.avatarIconGradient}
            >
              <Ionicons name="heart" size={16} color={theme.colors.onPrimary} />
            </LinearGradient>
          </View>
        )}
        
        <Card style={[styles.messageBubble, isUser ? styles.userBubble : styles.avatarBubble]}>
          <Card.Content style={styles.messageContent}>
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.avatarMessageText]}>
              {message.content}
            </Text>
            <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.avatarMessageTime]}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={[styles.messageContainer, styles.avatarMessageContainer]}>
      <View style={styles.avatarIcon}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.avatarIconGradient}
        >
          <Ionicons name="heart" size={16} color={theme.colors.onPrimary} />
        </LinearGradient>
      </View>
      
      <Card style={[styles.messageBubble, styles.avatarBubble]}>
        <Card.Content style={styles.messageContent}>
          <Text style={styles.typingText}>{avatarName} is typing...</Text>
        </Card.Content>
      </Card>
    </View>
  );

  const DisclaimerDialog = () => (
    <Portal>
      <Dialog visible={showDisclaimer} onDismiss={() => setShowDisclaimer(false)}>
        <Dialog.Title>💝 Important Reminder</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.disclaimerText}>
            This is an AI simulation of {avatarName}, not the real person. 
            EchoHeart is designed to provide companionship and reduce loneliness 
            through meaningful conversations.
          </Paragraph>
          <Paragraph style={styles.disclaimerSubtext}>
            • This is not a replacement for real human connection
          </Paragraph>
          <Paragraph style={styles.disclaimerSubtext}>
            • Your conversations are private and secure
          </Paragraph>
          <Paragraph style={styles.disclaimerSubtext}>
            • If you need professional support, please reach out to a counselor
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDisclaimer(false)}>
            I Understand
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? <TypingIndicator /> : null}
        />

        <Surface style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message ${avatarName}...`}
              style={styles.textInput}
              mode="outlined"
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
              disabled={loading}
            />
            
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={loading}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={24} 
                color={isRecording ? theme.colors.error : theme.colors.primary} 
              />
            </TouchableOpacity>
            
            <IconButton
              icon="send"
              size={24}
              iconColor={inputText.trim() ? theme.colors.primary : theme.colors.outline}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || loading}
              style={styles.sendButton}
            />
          </View>
          
          {isRecording && (
            <Text style={styles.recordingText}>
              🎤 Recording... Release to send
            </Text>
          )}
        </Surface>

        <DisclaimerDialog />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarIcon: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  avatarIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
  },
  avatarBubble: {
    backgroundColor: theme.colors.surface,
  },
  messageContent: {
    padding: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: theme.colors.onPrimary,
  },
  avatarMessageText: {
    color: theme.colors.onSurface,
  },
  messageTime: {
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  userMessageTime: {
    color: theme.colors.onPrimary,
    textAlign: 'right',
  },
  avatarMessageTime: {
    color: theme.colors.onSurface,
  },
  typingText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  inputContainer: {
    padding: spacing.md,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
  },
  recordingButton: {
    backgroundColor: theme.colors.errorContainer,
    borderColor: theme.colors.error,
  },
  sendButton: {
    margin: 0,
  },
  recordingText: {
    fontSize: 12,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  disclaimerText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  disclaimerSubtext: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
});

export default ChatScreen;