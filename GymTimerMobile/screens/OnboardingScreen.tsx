import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { ONBOARDING } from '../utils/constants';
import gymTimerIcon from '../assets/gymTimerIcon.jpeg';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
  onComplete: () => void;
};

type Slide = {
  key: string;
  title: string;
  text: string;
  image?: any;
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: Slide[] = [
    {
      key: '1',
      title: t('onboarding.slide1.title'),
      text: t('onboarding.slide1.text'),
      image: gymTimerIcon,
    },
    {
      key: '2',
      title: t('onboarding.slide2.title'),
      text: t('onboarding.slide2.text'),
      image: gymTimerIcon,
    },
    {
      key: '3',
      title: t('onboarding.slide3.title'),
      text: t('onboarding.slide3.text'),
      image: gymTimerIcon,
    },
  ];

  const isLastSlide = activeIndex === slides.length - 1;

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const isLast = index === slides.length - 1;
    return (
      <View style={[styles.slide, { backgroundColor: colors.background }]}>
        <View style={styles.imageContainer}>
          {item.image && (
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            {item.text}
          </Text>
        </View>
        {isLast && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={[styles.bottomButton, { backgroundColor: colors.primary }]}
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomButtonText}>{t('onboarding.done')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppIntroSlider
        data={slides}
        renderItem={renderSlide}
        onSlideChange={(index) => setActiveIndex(index)}
        onDone={onComplete}
        showSkipButton={false}
        renderNextButton={() => null}
        renderDoneButton={() => null}
        activeDotStyle={{ backgroundColor: colors.primary }}
        dotStyle={{ backgroundColor: colors.border }}
        bottomButton={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * ONBOARDING.IMAGE_SIZE_RATIO,
    height: width * ONBOARDING.IMAGE_SIZE_RATIO,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: ONBOARDING.BOTTOM_BUTTON_OFFSET,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bottomButton: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

