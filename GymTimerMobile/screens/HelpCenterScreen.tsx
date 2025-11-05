import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

type HelpCenterScreenProps = {
  onBack: () => void;
};

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export default function HelpCenterScreen({ onBack }: HelpCenterScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqs: FAQItem[] = [
    {
      question: t('help.faq1.question'),
      answer: t('help.faq1.answer'),
      category: 'general',
    },
    {
      question: t('help.faq2.question'),
      answer: t('help.faq2.answer'),
      category: 'timer',
    },
    {
      question: t('help.faq3.question'),
      answer: t('help.faq3.answer'),
      category: 'timer',
    },
    {
      question: t('help.faq4.question'),
      answer: t('help.faq4.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq5.question'),
      answer: t('help.faq5.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq6.question'),
      answer: t('help.faq6.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq7.question'),
      answer: t('help.faq7.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq8.question'),
      answer: t('help.faq8.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq9.question'),
      answer: t('help.faq9.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq10.question'),
      answer: t('help.faq10.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq11.question'),
      answer: t('help.faq11.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq12.question'),
      answer: t('help.faq12.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq13.question'),
      answer: t('help.faq13.answer'),
      category: 'premium',
    },
    {
      question: t('help.faq14.question'),
      answer: t('help.faq14.answer'),
      category: 'timer',
    },
    {
      question: t('help.faq15.question'),
      answer: t('help.faq15.answer'),
      category: 'timer',
    },
    {
      question: t('help.faq16.question'),
      answer: t('help.faq16.answer'),
      category: 'general',
    },
    {
      question: t('help.faq17.question'),
      answer: t('help.faq17.answer'),
      category: 'timer',
    },
    {
      question: t('help.faq18.question'),
      answer: t('help.faq18.answer'),
      category: 'general',
    },
    {
      question: t('help.faq19.question'),
      answer: t('help.faq19.answer'),
      category: 'general',
    },
    {
      question: t('help.faq20.question'),
      answer: t('help.faq20.answer'),
      category: 'premium',
    },
  ];

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index.toString())) {
      newExpanded.delete(index.toString());
    } else {
      newExpanded.add(index.toString());
    }
    setExpandedItems(newExpanded);
  };

  const openEmail = () => {
    // Email açmak için Linking API kullanılabilir
    // Linking.openURL('mailto:support@gymtimer.com');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('help.title')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('help.faq.title')}
          </Text>
          {faqs.map((faq, index) => (
            <View
              key={index}
              style={[
                styles.faqItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={styles.faqHeader}
                activeOpacity={0.7}
              >
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  {faq.question}
                </Text>
                <Text style={[styles.faqIcon, { color: colors.primary }]}>
                  {expandedItems.has(index.toString()) ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedItems.has(index.toString()) && (
                <View style={styles.faqAnswer}>
                  <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('help.contact.title')}
          </Text>
          <View
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.contactText, { color: colors.text }]}>
              {t('help.contact.description')}
            </Text>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={openEmail}
              activeOpacity={0.7}
            >
              <Text style={styles.contactButtonText}>
                {t('help.contact.email')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
  faqIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

