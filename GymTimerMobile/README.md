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

## Installation

```bash
cd GymTimerMobile
npm install
```

## Running the App

### iOS
```bash
npx expo run:ios
```

### Android
```bash
npx expo run:android
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

