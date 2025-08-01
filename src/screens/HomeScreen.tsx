import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  IconButton,
  Menu,
  Divider,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../types';
import { theme, spacing, borderRadius } from '../theme/theme';
import { getAvatarsForUser, deleteAvatar } from '../services/avatarService';

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [avatarToDelete, setAvatarToDelete] = useState<Avatar | null>(null);

  useEffect(() => {
    loadAvatars();
  }, [user?.id]);

  const loadAvatars = async () => {
    if (!user?.id) return;
    
    try {
      const userAvatars = await getAvatarsForUser(user.id);
      setAvatars(userAvatars);
    } catch (error) {
      console.error('Error loading avatars:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAvatars();
    setRefreshing(false);
  };

  const handleDeleteAvatar = async () => {
    if (!avatarToDelete) return;
    
    try {
      await deleteAvatar(avatarToDelete.id);
      setAvatars(prev => prev.filter(a => a.id !== avatarToDelete.id));
      setDeleteDialogVisible(false);
      setAvatarToDelete(null);
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };

  const getRelationshipEmoji = (mode: string) => {
    switch (mode) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friend': return '👫';
      case 'crush': return '💕';
      case 'partner': return '💑';
      default: return '❤️';
    }
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={80} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>No Hearts Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first EchoHeart to start meaningful conversations
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Create')}
        style={styles.emptyButton}
        icon="plus"
      >
        Create Your First Heart
      </Button>
    </View>
  );

  const AvatarCard = ({ avatar }: { avatar: Avatar }) => (
    <Card style={styles.avatarCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', { 
          avatarId: avatar.id,
          avatarName: avatar.name 
        })}
        style={styles.cardTouchable}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarImageContainer}>
            {avatar.thumbnailUrl ? (
              <Image source={{ uri: avatar.thumbnailUrl }} style={styles.avatarImage} />
            ) : (
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.avatarImagePlaceholder}
              >
                <Ionicons name="person" size={32} color={theme.colors.onPrimary} />
              </LinearGradient>
            )}
          </View>
          
          <Menu
            visible={menuVisible === avatar.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(avatar.id)}
              />
            }
          >
            <Menu.Item 
              onPress={() => {
                setMenuVisible(null);
                navigation.navigate('AvatarDetails', { 
                  avatarId: avatar.id,
                  avatarName: avatar.name 
                });
              }} 
              title="Edit" 
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item 
              onPress={() => {
                setMenuVisible(null);
                setAvatarToDelete(avatar);
                setDeleteDialogVisible(true);
              }} 
              title="Delete" 
              leadingIcon="delete"
            />
          </Menu>
        </View>

        <Card.Content style={styles.cardContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.avatarName}>{avatar.name}</Text>
            <Text style={styles.relationshipEmoji}>
              {getRelationshipEmoji(avatar.relationshipMode)}
            </Text>
          </View>
          
          <Text style={styles.relationshipMode}>
            {avatar.relationshipMode.charAt(0).toUpperCase() + avatar.relationshipMode.slice(1)}
          </Text>
          
          <View style={styles.traitsContainer}>
            <Text style={styles.trait}>{avatar.personalityTraits.tone}</Text>
            <Text style={styles.traitSeparator}>•</Text>
            <Text style={styles.trait}>{avatar.personalityTraits.communicationStyle}</Text>
          </View>
        </Card.Content>
      </TouchableOpacity>
      
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="outlined"
          compact
          onPress={() => navigation.navigate('Chat', { 
            avatarId: avatar.id,
            avatarName: avatar.name 
          })}
          style={styles.chatButton}
        >
          Chat
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your hearts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.displayName}! 👋</Text>
            <Text style={styles.subtitle}>
              Ready to connect with your hearts?
            </Text>
          </View>

          {avatars.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={styles.avatarsGrid}>
              {avatars.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </View>
          )}
        </ScrollView>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('Create')}
          label="Add Heart"
        />

        <Portal>
          <Dialog
            visible={deleteDialogVisible}
            onDismiss={() => setDeleteDialogVisible(false)}
          >
            <Dialog.Title>Delete Heart</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete {avatarToDelete?.name}? 
                This action cannot be undone and all conversations will be lost.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
              <Button onPress={handleDeleteAvatar} textColor={theme.colors.error}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onBackground,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.onBackground,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyButton: {
    borderRadius: borderRadius.lg,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarCard: {
    width: cardWidth,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTouchable: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
    paddingBottom: 0,
  },
  avatarImageContainer: {
    flex: 1,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    paddingTop: spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
  },
  relationshipEmoji: {
    fontSize: 20,
  },
  relationshipMode: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  traitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trait: {
    fontSize: 12,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  traitSeparator: {
    fontSize: 12,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginHorizontal: spacing.xs,
  },
  cardActions: {
    paddingTop: 0,
  },
  chatButton: {
    borderRadius: borderRadius.sm,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen;