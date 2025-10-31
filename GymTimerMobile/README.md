# Gym Timer Mobile

A React Native mobile application for gym workout timers with work and rest phases.

## Features

- 🏋️ **Work & Rest Timer**: Customizable workout and rest duration timers
- 🌍 **Internationalization**: Support for Turkish (TR) and English (EN)
- 🎨 **Smooth Animations**: Beautiful circle progress animations with color transitions
- 🔊 **Speech Synthesis**: Voice announcements for phase changes
- 🔇 **Mute Functionality**: Global mute control for all sounds
- 📱 **Cross-platform**: Works on both iOS and Android
- 🎯 **Progress Indicators**: Color-coded progress (Green → Orange → Red)
- ✅ **Input Validation**: Set count (1-50), durations (0-300 seconds)

## Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **i18next** for internationalization
- **expo-speech** for text-to-speech
- **react-native-svg** for circular progress indicator
- **expo-av** for audio management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

### For iOS Development:
- **Xcode** (latest version) - Available on Mac App Store
- **CocoaPods** - Install via: `sudo gem install cocoapods`
- **iOS Simulator** (comes with Xcode) or physical iOS device

### For Android Development:
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android SDK** (comes with Android Studio)
- **Android Emulator** or physical Android device
- Set up Android environment variables:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/eemirhannk/GymTimerMobile.git
cd GymTimerMobile
```

### 2. Install Dependencies

```bash
npm install
```

or if you're using yarn:

```bash
yarn install
```

### 3. Install iOS Dependencies (iOS only)

If you're developing for iOS, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

## Running the App

### Option 1: Using Expo Go (Recommended for Quick Testing)

1. **Install Expo Go** on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Scan the QR code** with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

### Option 2: Run on iOS Simulator (macOS only)

```bash
npx expo run:ios
```

This will:
- Build the iOS app
- Open the iOS Simulator
- Install and run the app

**First time setup:**
- If you see Xcode setup prompts, follow the instructions
- The first build may take several minutes

### Option 3: Run on Android Emulator

1. **Start Android Emulator** (via Android Studio)

2. **Run the app:**
   ```bash
   npx expo run:android
   ```

**First time setup:**
- Make sure Android Emulator is running before executing the command
- The first build may take several minutes

### Option 4: Run on Physical Device

#### iOS Device:

1. **Connect your iPhone/iPad** to your Mac via USB
2. **Trust the computer** on your device if prompted
3. **Open Xcode** and select your device
4. **Run:**
   ```bash
   npx expo run:ios --device
   ```
5. On your device, go to **Settings > General > VPN & Device Management** and trust the developer certificate

#### Android Device:

1. **Enable Developer Options** on your device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. **Enable USB Debugging:**
   - Settings > Developer Options > USB Debugging
3. **Connect your device** via USB
4. **Run:**
   ```bash
   npx expo run:android
   ```

## Troubleshooting

### Common Issues

#### "Unable to resolve module" errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

#### iOS build fails
```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx expo run:ios
```

#### Android build fails
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npx expo run:android
```

#### Metro bundler issues
```bash
# Reset Metro bundler cache
npx expo start -c
```

#### Port already in use
```bash
# Kill process on port 8081 (default Metro port)
# On macOS/Linux:
lsof -ti:8081 | xargs kill -9

# Then restart:
npx expo start
```

### Environment Issues

#### Node version conflicts
Use **nvm** (Node Version Manager) to manage Node versions:
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use Node 18
nvm install 18
nvm use 18
```

#### Watchman issues (macOS)
If you experience file watching issues:
```bash
brew install watchman
```

## Development Workflow

### Making Changes

1. **Edit files** in your code editor
2. **Save changes** - Metro bundler will automatically reload
3. **Shake device** or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open developer menu
4. **Enable Fast Refresh** for instant updates

### Debugging

- **React Native Debugger**: Install and use [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- **Console Logs**: Use `console.log()` - visible in Metro bundler terminal
- **React DevTools**: Install [React Developer Tools](https://react.dev/learn/react-developer-tools)

### Building for Production

#### iOS
```bash
# Build for App Store
eas build --platform ios --profile production

# Or locally (requires macOS and Xcode)
npx expo run:ios --configuration Release
```

#### Android
```bash
# Build APK
eas build --platform android --profile production

# Or locally
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/
```

## Project Structure

```
GymTimerMobile/
├── components/        # Reusable UI components
│   ├── TimerCircle.tsx
│   ├── TimerButton.tsx
│   ├── TimerHeader.tsx
│   ├── PhaseBadge.tsx
│   ├── SetInfo.tsx
│   └── InfoPanel.tsx
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   └── TimerScreen.tsx
├── hooks/            # Custom React hooks
│   ├── useTimer.ts
│   └── useSpeech.ts
├── utils/            # Utility functions
│   ├── constants.ts
│   ├── validators.ts
│   └── timeFormatter.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── assets/           # Images, icons
├── i18n.ts           # Internationalization configuration
├── App.tsx           # Main app component
└── app.json          # Expo configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/eemirhannk/GymTimerMobile/issues)
- Check existing issues for solutions
- Review the [Expo documentation](https://docs.expo.dev/)

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components inspired by modern mobile design principles
- References at: [tahapek5454/Gym-Timer](https://github.com/tahapek5454/Gym-Timer)
├── components/        # Reusable UI components
│   ├── TimerCircle.tsx
│   ├── TimerButton.tsx
│   ├── TimerHeader.tsx
│   ├── PhaseBadge.tsx
│   ├── SetInfo.tsx
│   └── InfoPanel.tsx
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   └── TimerScreen.tsx
├── hooks/            # Custom React hooks
│   ├── useTimer.ts
│   └── useSpeech.ts
├── utils/            # Utility functions
│   ├── constants.ts
│   ├── validators.ts
│   └── timeFormatter.ts
├── types/            # TypeScript type definitions
│   └── index.ts
└── i18n.ts           # Internationalization configuration
```

## Usage

1. Enter the number of sets (1-50)
2. Set work duration in seconds (0-300, 0 for unlimited)
3. Set rest duration in seconds (0-300)
4. Tap "Start" to begin the timer
5. Use pause/resume, next phase, and reset controls as needed

## Features Explained

### Color-Coded Progress
- **Green** (0-33%): Start of timer
- **Orange** (33-66%): Middle phase
- **Red** (66-100%): Approaching completion

### Timer Phases
- **Work Phase**: Active workout time
- **Rest Phase**: Rest period between sets
- Automatic progression through sets

 References at: [tahapek5454/Gym-Timer](https://github.com/tahapek5454/Gym-Timer)

