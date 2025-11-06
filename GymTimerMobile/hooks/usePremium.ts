import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
// @ts-ignore - Temporary mock for Android build compatibility
import * as InAppPurchases from '../utils/mock-in-app-purchases';
import { usePersistedState } from './usePersistedState';
import { PREMIUM } from '../utils/constants';
import { showErrorToast } from '../utils/toast';

// Debug flag - development için
const __DEV__ = process.env.NODE_ENV !== 'production';

type PremiumStatus = {
  isPremium: boolean;
  isLoading: boolean;
  purchaseType: 'lifetime' | 'monthly' | null;
};

export const usePremium = () => {
  // Development için premium test modu (test için true yapın)
  const TEST_PREMIUM = false; // Test için false yapın (free versiyon testi için)
  
  const [isPremiumStored, setIsPremiumStored] = usePersistedState<boolean>({
    key: PREMIUM.STORAGE_KEY,
    defaultValue: TEST_PREMIUM, // Development için test değeri
  });

  const [isLoading, setIsLoading] = useState(true);
  const [purchaseType, setPurchaseType] = useState<'lifetime' | 'monthly' | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const isConnectedRef = useRef(false);
  const checkPremiumStatusPromiseRef = useRef<Promise<void> | null>(null);
  const listenerSetupRef = useRef(false);
  const lastCheckAttemptRef = useRef<number>(0);
  const CHECK_RETRY_INTERVAL = 60000; // 60 saniye (rate limiting)
  
  // Helper: Bağlantıyı yönet (already connected hatasını ignore et)
  const ensureConnection = useCallback(async (): Promise<boolean> => {
    if (isConnectedRef.current) {
      return true;
    }
    
    try {
      await InAppPurchases.connectAsync();
      isConnectedRef.current = true;
      setIsAvailable(true);
      return true;
    } catch (error: any) {
      // "already connected" hatasını ignore et
      if (error?.message?.includes('already connected') || error?.message?.includes('Already connected')) {
        isConnectedRef.current = true;
        setIsAvailable(true);
        return true;
      }
      // Apple hesabı yoksa veya başka bir hata varsa, sessizce devam et
      // Kullanıcıyı rahatsız etme, sadece log
      console.log('Could not connect to App Store (user may not be signed in):', error?.message || error);
      // Bağlantı olmasa bile false döndür ama hata gösterme
      return false;
    }
  }, []);

  const checkPremiumStatus = useCallback(async () => {
    // Eğer zaten bir kontrol çalışıyorsa, bekleyen promise'i bekle ve çık
    if (checkPremiumStatusPromiseRef.current) {
      try {
        await checkPremiumStatusPromiseRef.current;
      } catch (error) {
        // Hata olsa bile çık, yeni bir kontrol başlatma
        console.error('Previous checkPremiumStatus promise error:', error);
      }
      return;
    }

    // Yeni bir promise oluştur ve ref'e kaydet
    const promise = (async () => {
      try {
        setIsLoading(true);

        // AsyncStorage'dan kontrol et (current value kullan)
        const currentIsPremium = isPremiumStored;
        if (currentIsPremium) {
          setIsLoading(false);
          return;
        }

        // In-App Purchases bağlantısını kontrol et
        const connected = await ensureConnection();
        if (!connected) {
          setIsLoading(false);
          return;
        }

        // Satın alma geçmişini kontrol et (sadece bir kez çağır)
        // Apple hesabı yoksa hata vermemeli, sessizce devam et
        let history;
        try {
          history = await InAppPurchases.getPurchaseHistoryAsync();
        } catch (error: any) {
          // Apple hesabı yoksa veya başka bir hata varsa, sessizce devam et
          console.log('Could not get purchase history (user may not be signed in):', error?.message || error);
          setIsLoading(false);
          return;
        }
        
        if (history && history.results && history.results.length > 0) {
          // En son satın almayı kontrol et
          const latestPurchase = history.results[0];
          
          // Satın alma tipini belirle
          if (latestPurchase.productId === PREMIUM.PRODUCT_IDS.LIFETIME) {
            setPurchaseType('lifetime');
            setIsPremiumStored(true);
          } else if (latestPurchase.productId === PREMIUM.PRODUCT_IDS.MONTHLY) {
            setPurchaseType('monthly');
            // Abonelik geçerliliğini kontrol et (basitleştirilmiş - production'da server validation yapılmalı)
            setIsPremiumStored(true);
          }

          // Bekleyen satın almaları tamamla (aynı history'den)
          // acknowledged=false olanları tamamla (true ile - başarılı satın almalar)
          for (const purchase of history.results) {
            if (purchase.acknowledged === false) {
              try {
                await InAppPurchases.finishTransactionAsync(purchase, true);
              } catch (error) {
                console.error('Error finishing transaction:', error);
              }
            }
          }
        }
      } catch (error: any) {
        // Tüm hataları yakala ve sessizce devam et
        // Apple hesabı yoksa veya başka bir hata varsa, kullanıcıyı rahatsız etme
        console.log('Error checking premium status (user may not be signed in):', error?.message || error);
      } finally {
        setIsLoading(false);
        // Promise tamamlandığında ref'i temizle
        checkPremiumStatusPromiseRef.current = null;
      }
    })();

    // Promise'i ref'e kaydet (henüz başlamadan önce)
    checkPremiumStatusPromiseRef.current = promise;
    
    // Promise'i çalıştır ve hataları yakala
    promise.catch((error) => {
      console.error('checkPremiumStatus error:', error);
      checkPremiumStatusPromiseRef.current = null;
    });
    
    // Promise'i bekle ve döndür
    return promise;
  }, [isPremiumStored, ensureConnection, setIsPremiumStored]);

  const setupPurchaseListener = useCallback(() => {
    // Listener zaten kurulmuşsa tekrar kurma
    if (listenerSetupRef.current) {
      return;
    }
    
    listenerSetupRef.current = true;
    
    // Satın alma listener'ı
    InAppPurchases.setPurchaseListener((result) => {
      if (result.errorCode) {
        console.error('Purchase error:', result.errorCode);
        showErrorToast('premiumPurchaseError');
        return;
      }

      if (result.results && Array.isArray(result.results)) {
        result.results.forEach(async (purchase: InAppPurchases.InAppPurchase) => {
          if (purchase.acknowledged === false) {
            try {
              // Satın almayı onayla
              await InAppPurchases.finishTransactionAsync(purchase, true);
              
              // Premium durumunu güncelle
              if (
                purchase.productId === PREMIUM.PRODUCT_IDS.LIFETIME ||
                purchase.productId === PREMIUM.PRODUCT_IDS.MONTHLY
              ) {
                if (purchase.productId === PREMIUM.PRODUCT_IDS.LIFETIME) {
                  setPurchaseType('lifetime');
                } else if (purchase.productId === PREMIUM.PRODUCT_IDS.MONTHLY) {
                  setPurchaseType('monthly');
                }
                
                setIsPremiumStored(true);
              }
            } catch (error) {
              console.error('Error finishing purchase transaction:', error);
            }
          }
        });
      }
    });
  }, [setIsPremiumStored]);

  // Premium durumunu kontrol et (sadece bir kez çalıştır)
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) {
        setupPurchaseListener();
        lastCheckAttemptRef.current = Date.now();
        await checkPremiumStatus();
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AppState listener: Uygulama foreground'a geldiğinde premium durumunu tekrar kontrol et
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Uygulama foreground'a geldi
        
        // Eğer AsyncStorage'da false ise ve son kontrol 60 saniyeden fazla önceyse
        if (!isPremiumStored) {
          const now = Date.now();
          const timeSinceLastCheck = now - lastCheckAttemptRef.current;
          
          if (timeSinceLastCheck > CHECK_RETRY_INTERVAL) {
            // Tekrar kontrol et
            lastCheckAttemptRef.current = now;
            checkPremiumStatus();
          }
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isPremiumStored, checkPremiumStatus]);

  const purchasePremium = useCallback(async (productId: string) => {
    try {
      const connected = await ensureConnection();
      if (!connected) {
        showErrorToast('premiumNotAvailable');
        return;
      }

      // Ürün bilgilerini al
      const products = await InAppPurchases.getProductsAsync([productId]);
      
      if (!products || !products.results || products.results.length === 0) {
        showErrorToast('premiumProductNotFound');
        return;
      }

      // Satın almayı başlat
      await InAppPurchases.purchaseItemAsync(productId);
    } catch (error) {
      console.error('Purchase error:', error);
      showErrorToast('premiumPurchaseError');
    }
  }, [ensureConnection]);

  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const connected = await ensureConnection();
      if (!connected) {
        showErrorToast('premiumNotAvailable');
        return;
      }

      // Satın alma geçmişini kontrol et
      // Apple hesabı yoksa hata vermemeli, sessizce devam et
      let history;
      try {
        history = await InAppPurchases.getPurchaseHistoryAsync();
      } catch (error: any) {
        // Apple hesabı yoksa veya başka bir hata varsa, sessizce devam et
        console.log('Could not get purchase history (user may not be signed in):', error?.message || error);
        showErrorToast('premiumNoPurchasesFound');
        return;
      }
      
      if (history && history.results && history.results.length > 0) {
        const latestPurchase = history.results[0];
        
        if (
          latestPurchase.productId === PREMIUM.PRODUCT_IDS.LIFETIME ||
          latestPurchase.productId === PREMIUM.PRODUCT_IDS.MONTHLY
        ) {
          if (latestPurchase.productId === PREMIUM.PRODUCT_IDS.LIFETIME) {
            setPurchaseType('lifetime');
          } else if (latestPurchase.productId === PREMIUM.PRODUCT_IDS.MONTHLY) {
            setPurchaseType('monthly');
          }
          
          setIsPremiumStored(true);
        }
      } else {
        showErrorToast('premiumNoPurchasesFound');
      }
    } catch (error) {
      console.error('Restore purchases error:', error);
      showErrorToast('premiumRestoreError');
    } finally {
      setIsLoading(false);
    }
  }, [ensureConnection, setIsPremiumStored]);

  // Test modu: TEST_PREMIUM true ise her zaman premium döndür
  // TEST_PREMIUM öncelikli olmalı - eğer true ise, isPremiumStored'u göz ardı et
  const isPremium = TEST_PREMIUM ? true : isPremiumStored;


  return {
    isPremium,
    isLoading,
    purchaseType,
    isAvailable,
    purchasePremium,
    restorePurchases,
  };
};

