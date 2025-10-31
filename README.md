# Gym Timer Mobile

🏋️ A React Native mobile application for gym workout timers with work and rest phases.

## 📱 About

Gym Timer Mobile is a cross-platform mobile application built with React Native and Expo. It helps fitness enthusiasts manage their workout sessions with customizable timers for sets, work periods, and rest periods.

## 🚀 Quick Start

For detailed installation and setup instructions, please see the [GymTimerMobile README](./GymTimerMobile/README.md).

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/eemirhannk/GymTimerMobile.git
cd GymTimerMobile

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android

# Or use Expo Go for quick testing
npx expo start
```

## ✨ Features

- 🏋️ **Work & Rest Timer**: Customizable workout and rest duration timers
- 🌍 **Internationalization**: Support for Turkish (TR) and English (EN)
- 🎨 **Smooth Animations**: Beautiful circle progress animations with color transitions
- 🔊 **Speech Synthesis**: Voice announcements for phase changes
- 🔇 **Mute Functionality**: Global mute control for all sounds
- 📱 **Cross-platform**: Works on both iOS and Android
- 🎯 **Progress Indicators**: Color-coded progress (Green → Orange → Red)
- ✅ **Input Validation**: Set count (1-50), durations (0-300 seconds)

## 📂 Project Structure

```
.
└── GymTimerMobile/          # React Native mobile app
    ├── components/          # UI components
    ├── screens/            # Screen components
    ├── hooks/              # Custom React hooks
    ├── utils/              # Utility functions
    ├── types/              # TypeScript definitions
    └── README.md           # Detailed documentation
```

## 📖 Documentation

For complete documentation, installation instructions, troubleshooting, and development guides, please see:

**[📄 GymTimerMobile/README.md](./GymTimerMobile/README.md)**

## 🛠️ Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **i18next** for internationalization
- **expo-speech** for text-to-speech
- **react-native-svg** for circular progress indicator
- **expo-av** for audio management

## 📱 Screenshots

*Screenshots coming soon...*

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](./GymTimerMobile/README.md#contributing) in the GymTimerMobile README.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [GitHub Repository](https://github.com/eemirhannk/GymTimerMobile)
- [Issues](https://github.com/eemirhannk/GymTimerMobile/issues)
- [Expo Documentation](https://docs.expo.dev/)

## 👤 Author

**Emirhan Koç**

- GitHub: [@eemirhannk](https://github.com/eemirhannk)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components inspired by modern mobile design principles
- References at: [tahapek5454/Gym-Timer](https://github.com/tahapek5454/Gym-Timer)

