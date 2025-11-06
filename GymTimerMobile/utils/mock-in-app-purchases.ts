// Mock expo-in-app-purchases for Android build compatibility
// This is a temporary solution until expo-in-app-purchases is compatible with Expo SDK 54

export const connectAsync = async () => {
  console.log('Mock: InAppPurchases.connectAsync() - not available');
  return true;
};

export const disconnectAsync = async () => {
  console.log('Mock: InAppPurchases.disconnectAsync() - not available');
};

export const getProductsAsync = async (productIds: string[]) => {
  console.log('Mock: InAppPurchases.getProductsAsync() - not available');
  return { results: [], responseCode: 0 };
};

export const purchaseItemAsync = async (productId: string) => {
  console.log('Mock: InAppPurchases.purchaseItemAsync() - not available');
  throw new Error('In-app purchases not available');
};

export const getPurchaseHistoryAsync = async () => {
  console.log('Mock: InAppPurchases.getPurchaseHistoryAsync() - not available');
  return { results: [], responseCode: 0 };
};

export const setPurchaseListener = (listener: any) => {
  console.log('Mock: InAppPurchases.setPurchaseListener() - not available');
  return () => {};
};

