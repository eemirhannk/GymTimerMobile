# 🚀 Store'lara Yayınlama Kılavuzu

Bu kılavuz, Gym Timer uygulamanızı App Store ve Google Play Store'a yayınlamak için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Ön Hazırlık](#ön-hazırlık)
2. [EAS Build Kurulumu](#eas-build-kurulumu)
3. [iOS (App Store) Yayınlama](#ios-app-store-yayınlama)
4. [Android (Google Play Store) Yayınlama](#android-google-play-store-yayınlama)
5. [Gerekli Dosyalar ve Boyutlar](#gerekli-dosyalar-ve-boyutlar)
6. [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## 📦 Ön Hazırlık

### 1. Gerekli Hesaplar

- ✅ **Apple Developer Account** ($99/yıl) - [Kayıt Ol](https://developer.apple.com/programs/)
- ✅ **Google Play Console Account** ($25 tek seferlik) - [Kayıt Ol](https://play.google.com/console/signup)
- ✅ **Expo Account** (Ücretsiz) - [Kayıt Ol](https://expo.dev/signup)

### 2. Proje Yapılandırması

#### app.json Güncellemeleri

1. `owner` alanını Expo kullanıcı adınızla değiştirin:
   ```json
   "owner": "your-expo-username"
   ```

2. `extra.eas.projectId` oluşturun:
   ```bash
   cd GymTimerMobile
   npx eas init
   ```
   Bu komut size bir `projectId` verecektir. Bunu `app.json` dosyasındaki `extra.eas.projectId` alanına ekleyin.

3. iOS için `buildNumber` ve Android için `versionCode` kontrolü:
   - Her yeni build için bu değerleri artırmanız gerekecek
   - `eas.json` dosyasında `autoIncrement: true` ayarı ile otomatik artırılabilir

---

## 🔧 EAS Build Kurulumu

### 1. EAS CLI Kurulumu

```bash
npm install -g eas-cli
```

### 2. Expo Hesabına Giriş

```bash
eas login
```

### 3. EAS Projesi Oluştur

```bash
cd GymTimerMobile
eas init
```

Bu komut size bir `projectId` verecektir. Bu ID'yi `app.json` dosyasına ekleyin:

```json
"extra": {
  "eas": {
    "projectId": "your-project-id-here"
  }
}
```

### 4. EAS Build Yapılandırması

`eas.json` dosyası zaten oluşturulmuştur. Gerekirse aşağıdaki alanları düzenleyin:

- **iOS `submit` ayarları**: Apple ID, App Store Connect App ID ve Team ID
- **Android `submit` ayarları**: Google Play Service Account Key yolu

---

## 🍎 iOS (App Store) Yayınlama

### Adım 1: App Store Connect'te Uygulama Oluşturma

1. [App Store Connect](https://appstoreconnect.apple.com) üzerinden giriş yapın
2. **My Apps** > **+** > **New App** tıklayın
3. Bilgileri doldurun:
   - **Platform**: iOS
   - **Name**: Gym Timer - Antrenman Zamanlayıcı
   - **Primary Language**: Turkish (veya English)
   - **Bundle ID**: `com.gymtimer.mobile` (önce [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) üzerinden oluşturmalısınız)
   - **SKU**: Benzersiz bir kod (örn: `gym-timer-001`)
   - **User Access**: Full Access

### Adım 2: Bundle ID Oluşturma (Gerekirse)

1. [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/bundleId) üzerinden giriş yapın
2. **+** butonuna tıklayın
3. **App IDs** > **Continue**
4. **Description**: Gym Timer Mobile
5. **Bundle ID**: `com.gymtimer.mobile` (Explicit)
6. **Capabilities**: Gerekli capability'leri seçin (bu uygulama için genellikle hiçbiri gerekmez)
7. **Continue** > **Register**

### Adım 3: Production Build Oluşturma

```bash
cd GymTimerMobile
eas build --platform ios --profile production
```

Bu komut:
- Expo'nun cloud build servisini kullanır
- Sizin için iOS certificate ve provisioning profile oluşturur (ilk kez)
- Production-ready `.ipa` dosyası oluşturur

**İlk kez çalıştırıyorsanız:**
- Apple Developer hesabınızı bağlamanız istenecek
- Credentials (sertifikalar) otomatik yönetilecek

### Adım 4: Build İndirme ve Test Etme

1. Build tamamlandığında Expo dashboard'da görebilirsiniz
2. Build URL'i alın ve TestFlight'a yükleyin:

```bash
eas submit --platform ios
```

Veya manuel olarak:
1. Build URL'inden `.ipa` dosyasını indirin
2. [Transporter](https://apps.apple.com/us/app/transporter/id1450874784) uygulamasını kullanın
3. App Store Connect'e yükleyin

### Adım 5: TestFlight ile Test

1. App Store Connect > **TestFlight** sekmesine gidin
2. Build'i seçin ve **Submit for Review** yapın
3. Test kullanıcıları ekleyin (Internal Testing veya External Testing)
4. Test edin ve onaylayın

### Adım 6: App Store Metadata'yı Doldurma

1. App Store Connect > **App Information** sekmesi:
   - **Name**: Gym Timer - Antrenman Zamanlayıcı
   - **Subtitle**: Set & Dinlenme Timer (30 karakter limit)
   - **Category**: Health & Fitness
   - **Privacy Policy URL**: (oluşturmanız gerekiyor)

2. **Pricing and Availability**: Ücretsiz uygulama için **Free** seçin

3. **App Privacy**:
   - Veri toplama yoksa "No, we do not collect data" seçin
   - Privacy manifest zaten `PrivacyInfo.xcprivacy` dosyasında mevcut

4. **Version Information**:
   - **Screenshots**: Gerekli boyutlarda ekran görüntüleri yükleyin
     - iPhone 6.7": 1290 x 2796 px (en az 1 adet, en fazla 10 adet)
     - iPhone 6.5": 1242 x 2688 px (opsiyonel)
     - iPad Pro 12.9": 2048 x 2732 px (opsiyonel ama önerilir)
   - **Description**: `ASO.md` dosyasındaki açıklamayı kullanın
   - **Keywords**: gym timer, antrenman, spor, workout, fitness, interval, set timer, rest timer
   - **Support URL**: GitHub repository veya web sitesi
   - **Marketing URL**: (opsiyonel)

5. **App Review Information**:
   - **Contact Information**: İletişim bilgileriniz
   - **Demo Account**: (gerekirse)
   - **Notes**: "Bu bir antrenman zamanlayıcı uygulamasıdır. Herhangi bir özel izin veya hesap gerektirmez."

### Adım 7: Submit for Review

1. Tüm bilgileri kontrol edin
2. **Submit for Review** butonuna tıklayın
3. Onay süreci genellikle 24-48 saat sürer

---

## 🤖 Android (Google Play Store) Yayınlama

### Adım 1: Google Play Console'da Uygulama Oluşturma

1. [Google Play Console](https://play.google.com/console) üzerinden giriş yapın
2. **Create app** butonuna tıklayın
3. Bilgileri doldurun:
   - **App name**: Gym Timer - Antrenman Zamanlayıcı
   - **Default language**: Turkish (veya English)
   - **App or game**: App
   - **Free or paid**: Free
   - **Declarations**: Uygun kutucukları işaretleyin

### Adım 2: Production Build Oluşturma (AAB Formatında)

```bash
cd GymTimerMobile
eas build --platform android --profile production
```

**Not**: Google Play Store `.aab` (Android App Bundle) formatını tercih eder. `eas.json` dosyasında zaten `buildType: "aab"` olarak ayarlanmıştır.

### Adım 3: Build İndirme ve Yükleme

Build tamamlandıktan sonra:

```bash
eas submit --platform android
```

**İlk kez submit ediyorsanız:**
- Google Play Console'da Service Account oluşturmanız gerekecek
- API key indirin ve `eas.json` dosyasındaki `serviceAccountKeyPath` alanına yolu ekleyin

**Alternatif (Manuel):**
1. Build URL'inden `.aab` dosyasını indirin
2. Google Play Console > **Production** (veya **Internal testing** / **Closed testing**)
3. **Create new release** > **Upload** ile `.aab` dosyasını yükleyin

### Adım 4: Store Listing Bilgilerini Doldurma

1. **Main store listing** sekmesi:
   - **App name**: Gym Timer - Antrenman Zamanlayıcı (50 karakter limit)
   - **Short description**: Spor salonu için profesyonel antrenman zamanlayıcı. Set ve dinlenme süreleri. (80 karakter limit)
   - **Full description**: `ASO.md` dosyasındaki açıklamayı kullanın (4000 karakter limit)
   - **App icon**: 512 x 512 px (zaten `assets/icon.png` mevcut)
   - **Feature graphic**: 1024 x 500 px (oluşturmanız gerekiyor)
   - **Screenshots**: 
     - Phone: 1080 x 1920 px (en az 2, en fazla 8 adet)
     - Tablet 7": 1200 x 1920 px (opsiyonel)
     - Tablet 10": 1600 x 2560 px (opsiyonel)
   - **Promo video**: (opsiyonel) YouTube URL

2. **Content rating**: Formu doldurun (kendi kendine derecelendirme)

3. **Target audience and content**: 
   - **Target age group**: 13+ (veya uygun yaş)
   - **Content ratings**: Uygun kutucukları işaretleyin

4. **Privacy Policy**: 
   - Privacy policy URL'i eklemeniz gerekiyor
   - Basit bir privacy policy oluşturun (örnek: GitHub Pages veya kendi web sitenizde)

### Adım 5: App Access

- **Free app**: Herkes kullanabilir
- **Restricted app**: (eğer varsa) Gerekli izinleri doldurun

### Adım 6: Pricing & Distribution

- **Free**: Ücretsiz seçeneğini işaretleyin
- **Countries**: Tüm ülkeler veya belirli ülkeler
- **Device categories**: Phone ve Tablet'i işaretleyin

### Adım 7: Release Yapma

1. **Production** (veya test track'i) sekmesine gidin
2. **Create new release** tıklayın
3. `.aab` dosyasını yükleyin
4. **Release name**: 1.0.0 (veya version number)
5. **Release notes**: İlk sürüm notlarınızı yazın
6. **Review** > **Start rollout to Production**

**İlk release için:**
- Release'i gözden geçirmek için biraz zaman alabilir (birkaç saat - birkaç gün)

---

## 📸 Gerekli Dosyalar ve Boyutlar

### iOS (App Store)

| Dosya | Boyut | Gerekli |
|-------|-------|---------|
| App Icon | 1024 x 1024 px | ✅ |
| iPhone 6.7" Screenshot | 1290 x 2796 px | ✅ (en az 1) |
| iPhone 6.5" Screenshot | 1242 x 2688 px | ⚪ (opsiyonel) |
| iPad Pro 12.9" Screenshot | 2048 x 2732 px | ⚪ (opsiyonel) |
| Promo Video | MP4, max 30 sn | ⚪ (opsiyonel) |

### Android (Google Play Store)

| Dosya | Boyut | Gerekli |
|-------|-------|---------|
| App Icon | 512 x 512 px | ✅ |
| Feature Graphic | 1024 x 500 px | ✅ |
| Phone Screenshot | 1080 x 1920 px | ✅ (en az 2) |
| Tablet 7" Screenshot | 1200 x 1920 px | ⚪ (opsiyonel) |
| Tablet 10" Screenshot | 1600 x 2560 px | ⚪ (opsiyonel) |
| Promo Video | YouTube URL | ⚪ (opsiyonel) |

### Screenshot Oluşturma İpuçları

1. **iOS Simulator** kullanarak:
   - Farklı iPhone modellerini açın
   - Uygulamayı çalıştırın
   - `Cmd + S` ile screenshot alın

2. **Android Emulator** kullanarak:
   - Farklı cihaz boyutlarında emülatör açın
   - Uygulamayı çalıştırın
   - Emulator üzerinden screenshot alın

3. **Görsel Düzenleme:**
   - Screenshot'lara açıklayıcı metinler ekleyin
   - Uygulamanın özelliklerini vurgulayın
   - Profesyonel görünmesi için düzenleyin

---

## ❓ Sık Sorulan Sorular

### Build ne kadar sürer?

- İlk build: 15-30 dakika (dependency indirme dahil)
- Sonraki build'ler: 10-20 dakika

### Build maliyeti nedir?

- EAS Build'in ücretsiz tier'ı aylık belirli sayıda build içerir
- Daha fazla build için ücretli plan gerekebilir
- Detaylar: [EAS Pricing](https://expo.dev/pricing)

### Privacy Policy gerekli mi?

- **iOS**: Evet, gerekli
- **Android**: Evet, gerekli

Basit bir privacy policy oluşturabilirsiniz:
- Uygulama veri toplamıyor
- Hangi izinlerin kullanıldığı
- İletişim bilgileri

### Version number nasıl artırılır?

1. `app.json` dosyasında `version` alanını güncelleyin (örn: "1.0.1")
2. iOS için `ios.buildNumber` artırın
3. Android için `android.versionCode` artırın
4. Veya `eas.json`'da `autoIncrement: true` ile otomatik artırma kullanın

### İlk yayınlamadan sonra güncelleme nasıl yapılır?

1. Kod değişikliklerinizi yapın
2. Version number'ları artırın
3. Build oluşturun: `eas build --platform all --profile production`
4. Submit edin: `eas submit --platform all`

### TestFlight'ta test etmek zorunlu mu?

Hayır, ama **kesinlikle önerilir**. Production'a çıkmadan önce:
- Internal Testing ile kendiniz test edin
- External Testing ile beta kullanıcılarınızla test edin
- Geri bildirim toplayın

---

## 🔗 Faydalı Linkler

- [EAS Build Dokümantasyonu](https://docs.expo.dev/build/introduction/)
- [EAS Submit Dokümantasyonu](https://docs.expo.dev/submit/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [Expo Dashboard](https://expo.dev)
- [ASO Rehberi](./ASO.md)

---

## 📝 Checklist

### iOS Yayınlama Öncesi

- [ ] Apple Developer hesabı aktif ($99/yıl)
- [ ] Bundle ID oluşturuldu (`com.gymtimer.mobile`)
- [ ] App Store Connect'te uygulama oluşturuldu
- [ ] EAS build başarıyla tamamlandı
- [ ] TestFlight'ta test edildi
- [ ] Screenshot'lar hazırlandı
- [ ] Metadata dolduruldu (açıklama, keywords, vb.)
- [ ] Privacy Policy URL eklendi
- [ ] Support URL eklendi
- [ ] Submit for Review yapıldı

### Android Yayınlama Öncesi

- [ ] Google Play Console hesabı aktif ($25)
- [ ] Google Play Console'da uygulama oluşturuldu
- [ ] EAS build başarıyla tamamlandı (AAB formatında)
- [ ] Service Account key yapılandırıldı
- [ ] Screenshot'lar hazırlandı
- [ ] Feature graphic hazırlandı
- [ ] Metadata dolduruldu (açıklama, vb.)
- [ ] Privacy Policy URL eklendi
- [ ] Content rating tamamlandı
- [ ] Production release yapıldı

---

## 🎉 Başarılar!

Uygulamanızı store'lara yayınladıktan sonra:

1. **İzleyin**: App Store Connect ve Google Play Console'da metrikleri takip edin
2. **Güncelleyin**: Düzenli güncellemeler yapın
3. **Yanıtlayın**: Kullanıcı yorumlarına yanıt verin
4. **İyileştirin**: Geri bildirimlere göre özellikler ekleyin

Sorularınız için [Expo Dokümantasyonu](https://docs.expo.dev) veya [Expo Discord](https://chat.expo.dev) topluluğuna başvurabilirsiniz.

