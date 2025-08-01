import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Switch,
  Divider,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme, spacing, borderRadius } from '../theme/theme';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const ProfileHeader = () => (
    <Card style={styles.profileCard}>
      <Card.Content style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.userAvatar}
          >
            <Ionicons name="person" size={40} color={theme.colors.onPrimary} />
          </LinearGradient>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const SettingsSection = () => (
    <Card style={styles.settingsCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <List.Item
          title="Daily Reminders"
          description="Get gentle reminders to check in with your hearts"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Voice Messages"
          description="Enable voice recording and playback"
          left={(props) => <List.Icon {...props} icon="microphone" />}
          right={() => (
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Privacy & Safety"
          description="Learn about how we protect your data"
          left={(props) => <List.Icon {...props} icon="shield-check" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Navigate to privacy screen */}}
        />
      </Card.Content>
    </Card>
  );

  const SupportSection = () => (
    <Card style={styles.settingsCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Support & Resources</Text>
        
        <List.Item
          title="How EchoHeart Works"
          description="Learn about AI companionship and features"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Navigate to help screen */}}
        />
        
        <Divider />
        
        <List.Item
          title="Mental Health Resources"
          description="Professional support and crisis resources"
          left={(props) => <List.Icon {...props} icon="heart-plus" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Navigate to resources screen */}}
        />
        
        <Divider />
        
        <List.Item
          title="Feedback & Support"
          description="Share your thoughts or get help"
          left={(props) => <List.Icon {...props} icon="message-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Navigate to feedback screen */}}
        />
      </Card.Content>
    </Card>
  );

  const AccountSection = () => (
    <Card style={styles.settingsCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <List.Item
          title="Export My Data"
          description="Download your conversations and data"
          left={(props) => <List.Icon {...props} icon="download" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Handle data export */}}
        />
        
        <Divider />
        
        <List.Item
          title="Delete Account"
          description="Permanently delete your account and data"
          left={(props) => <List.Icon {...props} icon="delete" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Handle account deletion */}}
          titleStyle={{ color: theme.colors.error }}
        />
      </Card.Content>
    </Card>
  );

  const LogoutDialog = () => (
    <Portal>
      <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to sign out? Your hearts and conversations will be saved.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
          <Button onPress={handleLogout} textColor={theme.colors.error}>
            Sign Out
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
        <ProfileHeader />
        <SettingsSection />
        <SupportSection />
        <AccountSection />
        
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={() => setShowLogoutDialog(true)}
            style={styles.logoutButton}
            icon="logout"
          >
            Sign Out
          </Button>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>EchoHeart v1.0.0</Text>
          <Text style={styles.footerText}>
            Made with ❤️ for meaningful connections
          </Text>
        </View>
      </ScrollView>
      
      <LogoutDialog />
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatarContainer: {
    marginRight: spacing.lg,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  settingsCard: {
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
  logoutContainer: {
    marginVertical: spacing.lg,
    alignItems: 'center',
  },
  logoutButton: {
    borderRadius: borderRadius.lg,
    borderColor: theme.colors.outline,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.onBackground,
    opacity: 0.5,
    marginBottom: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.onBackground,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default ProfileScreen;