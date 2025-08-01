# EchoHeart 💝

**AI-Powered Companionship to Reduce Loneliness**

EchoHeart is a React Native Expo app that creates AI companions based on videos of your loved ones. Using advanced AI technology, it simulates conversations with family, friends, partners, or crushes to provide emotional support and reduce loneliness.

## ✨ Features

### Core Functionality
- **Video-Based Avatar Creation**: Upload 30-60 second videos to create AI companions
- **AI Personality Analysis**: Extract personality traits, communication style, and voice characteristics
- **Natural Conversations**: Chat with AI companions that mimic the personality of your loved ones
- **Voice Interaction**: Record voice messages and receive text responses (voice synthesis ready)
- **Multiple Relationship Modes**: Family, friend, crush, or partner modes for personalized interactions

### User Experience
- **Warm, Accessible Design**: Soft colors and large buttons designed for accessibility
- **Safety First**: Clear disclaimers and emotional safety precautions
- **Privacy-Focused**: Secure data handling with Firebase
- **Cross-Platform**: Works on iOS and Android via Expo Go

### Avatar Management
- **Create Multiple Hearts**: Manage multiple AI companions
- **Edit & Customize**: Update names and view personality traits
- **Conversation History**: Save and review past conversations
- **Delete & Privacy**: Full control over your data

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo SDK 51
- **TypeScript** for type safety
- **React Native Paper** for Material Design 3 UI
- **React Navigation** for navigation
- **Expo AV** for video/audio handling
- **Expo Camera** for video recording

### Backend & Services
- **Firebase Authentication** (Email/Password)
- **Firebase Firestore** for data storage
- **Firebase Storage** for video/media files

### AI Integration (Ready for Implementation)
- **OpenAI GPT-4** for conversation generation
- **OpenAI Whisper** for speech-to-text transcription
- **ElevenLabs** for voice cloning and synthesis (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EchoHeart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Update `src/services/firebase.ts` with your Firebase config

4. **Configure AI Services (Optional)**
   - Get OpenAI API key from [https://openai.com/api](https://openai.com/api)
   - Update `src/services/aiService.ts` with your API key
   - For voice cloning, sign up for ElevenLabs API

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**
   - Install Expo Go on your phone
   - Scan the QR code from the terminal
   - The app will load on your device

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── navigation/         # Navigation configuration
├── screens/           # App screens
│   ├── auth/         # Authentication screens
│   ├── HomeScreen.tsx
│   ├── CreateAvatarScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ProcessingScreen.tsx
│   └── ProfileScreen.tsx
├── services/          # External service integrations
│   ├── firebase.ts   # Firebase configuration
│   ├── aiService.ts  # AI/OpenAI integration
│   └── avatarService.ts # Avatar CRUD operations
├── theme/            # App theming and styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🎨 Design Philosophy

EchoHeart is designed with warmth, accessibility, and emotional safety in mind:

- **Warm Color Palette**: Soft purples, oranges, and pinks create a comforting atmosphere
- **Large Touch Targets**: Buttons and interactive elements are sized for easy access
- **Clear Typography**: Readable fonts with good contrast ratios
- **Emotional Safety**: Clear disclaimers that this is AI simulation, not real people
- **Privacy First**: User data is handled securely and privately

## 🔒 Privacy & Safety

EchoHeart takes privacy and emotional safety seriously:

### Privacy Measures
- Videos are processed securely and stored encrypted
- Conversations are private and not shared
- Users have full control over their data
- Option to export or delete all data

### Emotional Safety
- Clear disclaimers before each conversation
- Reminders that AI companions are simulations
- Links to professional mental health resources
- Not intended as replacement for real human connection

## 🚧 Development Status

### ✅ Completed Features
- User authentication and onboarding
- Video upload and avatar creation flow
- AI personality analysis (mock implementation)
- Chat interface with text messaging
- Avatar management (CRUD operations)
- Profile and settings screens
- Safety disclaimers and precautions

### 🔄 In Progress
- Voice message recording and playback
- Push notifications for daily reminders

### 📋 Planned Features
- ElevenLabs voice cloning integration
- Advanced personality customization
- Conversation analytics and insights
- Group conversations with multiple avatars
- Export conversation history
- Advanced privacy controls

## 🤝 Contributing

EchoHeart is designed to help reduce loneliness through technology. Contributions are welcome!

### Areas for Contribution
- UI/UX improvements for accessibility
- AI prompt engineering for better conversations
- Voice synthesis integration
- Performance optimizations
- Additional safety features

### Development Guidelines
- Follow TypeScript best practices
- Maintain warm, accessible design principles
- Prioritize user privacy and emotional safety
- Test thoroughly on both iOS and Android

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you're experiencing loneliness or mental health challenges:

- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

EchoHeart is a tool for companionship, but professional help is available when you need it.

## 🙏 Acknowledgments

- Built with love for those seeking connection
- Inspired by the potential of AI to provide comfort and companionship
- Thanks to the open-source community for the amazing tools and libraries

---

**Made with ❤️ for meaningful connections**

*EchoHeart - Where every conversation matters*
