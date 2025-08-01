# EchoHeart Development Guide

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Run on device**
   - Install Expo Go on your phone
   - Scan QR code from terminal

## 🔧 Development Setup

### Required Tools
- Node.js 18+
- Expo CLI
- Expo Go mobile app
- Firebase project (for backend)

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration
3. Add OpenAI API key (optional for full AI features)

### Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Update `src/services/firebase.ts` with your config

## 📱 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── navigation/         # Navigation setup
├── screens/           # App screens
│   ├── auth/         # Login/signup screens
│   ├── HomeScreen.tsx
│   ├── CreateAvatarScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ProcessingScreen.tsx
│   ├── ProfileScreen.tsx
│   └── AvatarDetailsScreen.tsx
├── services/          # External integrations
│   ├── firebase.ts   # Firebase config
│   ├── aiService.ts  # AI/OpenAI integration
│   └── avatarService.ts # Avatar CRUD
├── theme/            # App theming
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 🎨 Design System

### Colors
- Primary: `#6B73FF` (Purple)
- Secondary: `#FF9F43` (Orange)
- Tertiary: `#FF6B9D` (Pink)
- Background: `#FEFCF8` (Warm white)
- Surface: `#F8F4F0` (Light cream)

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 999px

## 🔄 Development Workflow

### Adding New Screens
1. Create screen file in `src/screens/`
2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Add TypeScript types if needed
4. Follow existing design patterns

### Adding New Services
1. Create service file in `src/services/`
2. Export functions for external use
3. Add error handling
4. Update TypeScript types

### Working with Firebase
- Authentication: `src/contexts/AuthContext.tsx`
- Database: `src/services/avatarService.ts`
- Storage: Video/image uploads in avatar service

## 🤖 AI Integration

### Current Status
- Mock implementations for development
- Ready for OpenAI API integration
- Personality analysis framework in place

### Adding Real AI Features
1. Get OpenAI API key
2. Update `src/services/aiService.ts`
3. Replace mock functions with real API calls
4. Test with actual video processing

### Voice Features (Planned)
- ElevenLabs integration for voice cloning
- Real-time voice message transcription
- Voice synthesis for avatar responses

## 🧪 Testing

### Manual Testing
- Test on both iOS and Android
- Verify all navigation flows
- Test video upload functionality
- Check authentication flows

### Key Test Scenarios
1. User registration and login
2. Video upload and avatar creation
3. Chat functionality
4. Avatar management (edit/delete)
5. Profile settings

## 🚀 Deployment

### Expo Go (Development)
- Already configured for Expo Go
- Just run `npm start` and scan QR code

### Production Build
```bash
# Build for production
expo build:android
expo build:ios
```

### App Store Deployment
- Follow Expo's deployment guides
- Configure app store metadata
- Handle permissions and privacy policies

## 🔒 Security Considerations

### Data Privacy
- Videos processed securely
- User data encrypted in Firebase
- No data sharing with third parties

### API Security
- API keys in environment variables
- Firebase security rules configured
- Input validation on all forms

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Package conflicts**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Firebase connection issues**
   - Check Firebase configuration
   - Verify API keys
   - Check network connectivity

### Debug Mode
- Set `DEBUG_MODE=true` in `.env`
- Check console logs in Expo Go
- Use React DevTools for debugging

## 📝 Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` types

### React Native
- Use functional components with hooks
- Follow React Native best practices
- Use React Native Paper for UI components

### File Naming
- PascalCase for components: `HomeScreen.tsx`
- camelCase for utilities: `avatarService.ts`
- kebab-case for assets: `app-icon.png`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow existing code style
4. Test thoroughly
5. Submit pull request

### Pull Request Guidelines
- Clear description of changes
- Screenshots for UI changes
- Test on both platforms
- Update documentation if needed

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## ❤️ Philosophy

EchoHeart is built with love to help reduce loneliness through technology. Every feature should prioritize:

1. **Emotional Safety** - Clear disclaimers and boundaries
2. **Privacy** - User data protection and security
3. **Accessibility** - Easy to use for all ages
4. **Warmth** - Comforting and supportive experience

Remember: We're building a tool to help people feel less alone, not to replace human connection.