import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as InAppPurchases from 'expo-in-app-purchases';
import { useTheme } from '../theme/ThemeContext';
import { usePremium } from '../hooks/usePremium';
import { PREMIUM } from '../utils/constants';
import { showErrorToast, showSuccessToast } from '../utils/toast';

type Product = {
  productId: string;
  price: string;
  title?: string;
  description?: string;
};

type PurchaseScreenProps = {
  onClose: () => void;
};

export default function PurchaseScreen({ onClose }: PurchaseScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium, purchasePremium, restorePurchases, isLoading } = usePremium();
  
  // ensureConnection'ı kullanmak için usePremium'u genişletmek yerine, direkt bağlantı yapıyoruz
  // çünkü PurchaseScreen'de bağlantı kontrolü gerekiyor
  
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      
      // usePremium hook'undan ensureConnection kullanmak yerine, direkt bağlantı kontrolü yap
      // Ancak "already connected" hatasını ignore et
      try {
        await InAppPurchases.connectAsync();
      } catch (error: any) {
        // "already connected" hatasını ignore et
        if (error?.message?.includes('already connected') || error?.message?.includes('Already connected')) {
          // Bağlantı zaten var, devam et
        } else {
          // Apple hesabı yoksa veya başka bir hata varsa, sessizce devam et
          // Ürünler yüklenemez ama kullanıcıyı rahatsız etme
          console.log('Could not connect to App Store (user may not be signed in):', error?.message || error);
          setProducts([]);
          return;
        }
      }

      const productIds = [
        PREMIUM.PRODUCT_IDS.LIFETIME,
        PREMIUM.PRODUCT_IDS.MONTHLY,
      ];

      let response;
      try {
        response = await InAppPurchases.getProductsAsync(productIds);
      } catch (error: any) {
        // Apple hesabı yoksa veya ürünler henüz oluşturulmamışsa, sessizce devam et
        console.log('Could not load products (user may not be signed in or products not created):', error?.message || error);
        setProducts([]);
        return;
      }
      
      if (response && response.results && response.results.length > 0) {
        const formattedProducts: Product[] = response.results.map((product) => ({
          productId: product.productId,
          price: product.price,
          title: product.title,
          description: product.description,
        }));
        setProducts(formattedProducts);
      } else {
        // Ürünler bulunamadı (henüz App Store Connect'te oluşturulmamış olabilir)
        console.log('No products found. Products may not be created in App Store Connect yet.');
        setProducts([]);
      }
    } catch (error: any) {
      // Tüm hataları yakala ve sessizce devam et
      console.log('Error loading products (user may not be signed in):', error?.message || error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    try {
      setPurchasing(productId);
      await purchasePremium(productId);
      // Satın alma başarılı olduğunda toast mesajı usePremium hook'undan gelir
    } catch (error) {
      console.error('Purchase error:', error);
      showErrorToast('premiumPurchaseError');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      showSuccessToast('premiumRestored');
    } catch (error) {
      console.error('Restore error:', error);
      showErrorToast('premiumRestoreError');
    }
  };

  const getProductDisplayName = (productId: string) => {
    if (productId === PREMIUM.PRODUCT_IDS.LIFETIME) {
      return t('premiumLifetime');
    } else if (productId === PREMIUM.PRODUCT_IDS.MONTHLY) {
      return t('premiumMonthly');
    }
    return productId;
  };

  const getProductDescription = (productId: string) => {
    if (productId === PREMIUM.PRODUCT_IDS.LIFETIME) {
      return t('premiumLifetimeDesc');
    } else if (productId === PREMIUM.PRODUCT_IDS.MONTHLY) {
      return t('premiumMonthlyDesc');
    }
    return '';
  };

  // Premium kullanıcıysa bilgi göster
  if (isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('premiumTitle')}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.border }]}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.premiumIcon, { color: colors.primary }]}>💪</Text>
            <Text style={[styles.premiumTitle, { color: colors.text }]}>
              {t('premiumActive')}
            </Text>
            <Text style={[styles.premiumMessage, { color: colors.textSecondary }]}>
              {t('premiumActiveMessage')}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('premiumTitle')}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.border }]}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.introTitle, { color: colors.text }]}>
            {t('premiumIntroTitle')}
          </Text>
          <Text style={[styles.introMessage, { color: colors.textSecondary }]}>
            {t('premiumIntroMessage')}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            {t('premiumFeatures')}
          </Text>
          
          {[
            { key: 'premiumFeature1', icon: '∞' },
            { key: 'premiumFeature2', icon: '📊' },
            { key: 'premiumFeature3', icon: '🎨' },
            { key: 'premiumFeature4', icon: '📋' },
            { key: 'premiumFeature5', icon: '📊' },
            { key: 'premiumFeature6', icon: '🔊' },
          ].map((feature, index) => (
            <View
              key={index}
              style={[styles.featureItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureText, { color: colors.text }]}>
                {t(feature.key)}
              </Text>
            </View>
          ))}
        </View>

        {productsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('premiumLoadingProducts')}
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={[styles.noProductsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.noProductsIcon, { color: colors.textSecondary }]}>ℹ️</Text>
            <Text style={[styles.noProductsTitle, { color: colors.text }]}>
              {t('premiumNoProductsTitle')}
            </Text>
            <Text style={[styles.noProductsMessage, { color: colors.textSecondary }]}>
              {t('premiumNoProductsMessage')}
            </Text>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.productId}
                accessible={true}
                accessibilityLabel={getProductDisplayName(product.productId)}
                accessibilityRole="button"
                style={[
                  styles.productCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  product.productId === PREMIUM.PRODUCT_IDS.LIFETIME && styles.recommendedCard,
                ]}
                onPress={() => handlePurchase(product.productId)}
                disabled={purchasing === product.productId || isLoading}
                activeOpacity={0.7}
              >
                {product.productId === PREMIUM.PRODUCT_IDS.LIFETIME && (
                  <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.recommendedBadgeText}>{t('premiumRecommended')}</Text>
                  </View>
                )}
                
                <View style={styles.productContent}>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productTitle, { color: colors.text }]}>
                      {product.title || getProductDisplayName(product.productId)}
                    </Text>
                    <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
                      {product.description || getProductDescription(product.productId)}
                    </Text>
                  </View>
                  
                  <View style={styles.productPriceContainer}>
                    {purchasing === product.productId ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Text style={[styles.productPrice, { color: colors.primary }]}>
                        {product.price || t('premiumLoading')}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          accessible={true}
          accessibilityLabel={t('premiumRestore')}
          accessibilityRole="button"
          style={[styles.restoreButton, { backgroundColor: colors.border }]}
          onPress={handleRestore}
          disabled={isLoading}
        >
          <Text style={[styles.restoreButtonText, { color: colors.text }]}>
            {t('premiumRestore')}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          {t('premiumFooter')}
        </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  introCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  productsContainer: {
    gap: 12,
  },
  productCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  recommendedBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 12,
  },
  productPriceContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
  noProductsContainer: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  noProductsIcon: {
    fontSize: 48,
  },
  noProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noProductsMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  premiumCard: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  premiumIcon: {
    fontSize: 48,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  premiumMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

