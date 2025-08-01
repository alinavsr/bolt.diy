import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  List,
  Divider,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../theme/theme';
import { getAvatarById, updateAvatar, deleteAvatar } from '../services/avatarService';
import { Avatar, RelationshipMode } from '../types';

interface AvatarDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      avatarId: string;
      avatarName: string;
    };
  };
}

const AvatarDetailsScreen: React.FC<AvatarDetailsScreenProps> = ({ navigation, route }) => {
  const { avatarId } = route.params;
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadAvatar();
  }, [avatarId]);

  const loadAvatar = async () => {
    try {
      const avatarData = await getAvatarById(avatarId);
      setAvatar(avatarData);
      setEditedName(avatarData?.name || '');
    } catch (error) {
      console.error('Error loading avatar:', error);
      Alert.alert('Error', 'Failed to load avatar details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!avatar || !editedName.trim()) return;

    try {
      await updateAvatar(avatar.id, { name: editedName.trim() });
      setAvatar(prev => prev ? { ...prev, name: editedName.trim() } : null);
      setEditing(false);
      Alert.alert('Success', 'Avatar name updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    }
  };

  const handleDelete = async () => {
    if (!avatar) return;

    try {
      await deleteAvatar(avatar.id);
      setShowDeleteDialog(false);
      navigation.goBack();
      Alert.alert('Success', 'Avatar deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      Alert.alert('Error', 'Failed to delete avatar');
    }
  };

  const getRelationshipEmoji = (mode: RelationshipMode) => {
    switch (mode) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friend': return '👫';
      case 'crush': return '💕';
      case 'partner': return '💑';
      default: return '❤️';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading avatar details...</Text>
      </View>
    );
  }

  if (!avatar) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color={theme.colors.error} />
        <Text style={styles.errorText}>Avatar not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const AvatarHeader = () => (
    <Card style={styles.headerCard}>
      <Card.Content style={styles.headerContent}>
        <View style={styles.avatarImageContainer}>
          {avatar.thumbnailUrl ? (
            <Image source={{ uri: avatar.thumbnailUrl }} style={styles.avatarImage} />
          ) : (
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.avatarImagePlaceholder}
            >
              <Ionicons name="person" size={40} color={theme.colors.onPrimary} />
            </LinearGradient>
          )}
        </View>
        
        <View style={styles.avatarInfo}>
          {editing ? (
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              mode="outlined"
              style={styles.nameInput}
              placeholder="Avatar name"
            />
          ) : (
            <Text style={styles.avatarName}>{avatar.name}</Text>
          )}
          
          <View style={styles.relationshipContainer}>
            <Text style={styles.relationshipEmoji}>
              {getRelationshipEmoji(avatar.relationshipMode)}
            </Text>
            <Text style={styles.relationshipText}>
              {avatar.relationshipMode.charAt(0).toUpperCase() + avatar.relationshipMode.slice(1)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const PersonalitySection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Personality Traits</Text>
        
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Tone:</Text>
          <Chip mode="outlined" style={styles.traitChip}>
            {avatar.personalityTraits.tone}
          </Chip>
        </View>
        
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Communication:</Text>
          <Chip mode="outlined" style={styles.traitChip}>
            {avatar.personalityTraits.communicationStyle}
          </Chip>
        </View>
        
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Emotional Style:</Text>
          <Chip mode="outlined" style={styles.traitChip}>
            {avatar.personalityTraits.emotionalStyle}
          </Chip>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.subSectionTitle}>Common Phrases</Text>
        <View style={styles.phrasesContainer}>
          {avatar.personalityTraits.commonPhrases.map((phrase, index) => (
            <Chip key={index} mode="outlined" style={styles.phraseChip}>
              "{phrase}"
            </Chip>
          ))}
        </View>
        
        <Text style={styles.subSectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {avatar.personalityTraits.interests.map((interest, index) => (
            <Chip key={index} mode="outlined" style={styles.interestChip}>
              {interest}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const VoiceSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Voice Characteristics</Text>
        
        <List.Item
          title="Pitch"
          description={avatar.voiceCharacteristics.pitch}
          left={(props) => <List.Icon {...props} icon="tune-vertical" />}
        />
        
        <List.Item
          title="Pace"
          description={avatar.voiceCharacteristics.pace}
          left={(props) => <List.Icon {...props} icon="speedometer" />}
        />
        
        {avatar.voiceCharacteristics.accent && (
          <List.Item
            title="Accent"
            description={avatar.voiceCharacteristics.accent}
            left={(props) => <List.Icon {...props} icon="earth" />}
          />
        )}
      </Card.Content>
    </Card>
  );

  const MetadataSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Information</Text>
        
        <List.Item
          title="Created"
          description={formatDate(avatar.createdAt)}
          left={(props) => <List.Icon {...props} icon="calendar-plus" />}
        />
        
        <List.Item
          title="Last Updated"
          description={formatDate(avatar.updatedAt)}
          left={(props) => <List.Icon {...props} icon="calendar-edit" />}
        />
      </Card.Content>
    </Card>
  );

  const ActionButtons = () => (
    <View style={styles.actionsContainer}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Chat', {
          avatarId: avatar.id,
          avatarName: avatar.name
        })}
        style={styles.chatButton}
        icon="message"
      >
        Start Conversation
      </Button>
      
      <View style={styles.secondaryActions}>
        {editing ? (
          <>
            <Button
              mode="outlined"
              onPress={() => {
                setEditing(false);
                setEditedName(avatar.name);
              }}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              mode="outlined"
              onPress={() => setEditing(true)}
              style={styles.editButton}
              icon="pencil"
            >
              Edit Name
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowDeleteDialog(true)}
              style={styles.deleteButton}
              icon="delete"
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </>
        )}
      </View>
    </View>
  );

  const DeleteDialog = () => (
    <Portal>
      <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
        <Dialog.Title>Delete {avatar.name}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to delete {avatar.name}? This action cannot be undone 
            and all conversations with this avatar will be permanently lost.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onPress={handleDelete} textColor={theme.colors.error}>
            Delete
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AvatarHeader />
        <PersonalitySection />
        <VoiceSection />
        <MetadataSection />
        <ActionButtons />
      </ScrollView>
      
      <DeleteDialog />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginVertical: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatarImageContainer: {
    marginRight: spacing.lg,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  avatarName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  nameInput: {
    marginBottom: spacing.sm,
  },
  relationshipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relationshipEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  relationshipText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  sectionCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  traitLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    width: 100,
    fontWeight: '500',
  },
  traitChip: {
    marginLeft: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  phrasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  phraseChip: {
    marginBottom: spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    marginBottom: spacing.sm,
  },
  actionsContainer: {
    marginTop: spacing.lg,
  },
  chatButton: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  deleteButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderColor: theme.colors.error,
  },
  cancelButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  saveButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
});

export default AvatarDetailsScreen;