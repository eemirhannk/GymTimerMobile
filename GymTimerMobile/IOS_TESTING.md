# iOS Cihazında Test Etme Kılavuzu

## Seçenek 1: Expo Go ile Test (Hızlı - Sınırlı)

**Not:** Bildirimler gibi native modüller Expo Go'da tam çalışmayabilir.

```bash
# 1. Expo Go uygulamasını App Store'dan indirin
# 2. Projeyi başlatın
npm start

# 3. QR kodu tarayın veya Expo Go'da email ile giriş yapın
```

## Seçenek 2: Development Build (Önerilen)

### Adım 1: EAS Build Hesabını Ayarlayın

```bash
# EAS CLI'yi global olarak yükleyin (eğer yoksa)
npm install -g eas-cli

# EAS hesabına giriş yapın
eas login

# Projeyi EAS'a bağlayın
eas build:configure
```

### Adım 2: iOS Development Build Oluşturun

```bash
# iOS development build oluştur
eas build --platform ios --profile development

# Build tamamlandığında, build ID'yi kullanarak indirin
# veya email ile gelen linkten indirin
```

### Adım 3: Build'i Cihaza Yükleyin

1. **TestFlight ile (Önerilen):**
   - EAS build tamamlandığında TestFlight'a otomatik yüklenir
   - TestFlight uygulamasından indirin
   - Apple Developer hesabınızın TestFlight'a erişimi olmalı

2. **Manuel Yükleme:**
   - Build'i indirin (.ipa dosyası)
   - Xcode ile cihaza yükleyin:
     - Xcode > Window > Devices and Simulators
     - Cihazınızı seçin
     - "Install" butonuna tıklayın

### Adım 4: Development Build'i Cihazda Çalıştırın

```bash
# Development server'ı başlatın
npm start

# Uygulama açıldığında otomatik olarak geliştirme server'a bağlanır
```

## Seçenek 3: Local Build (Xcode ile)

### Adım 1: Gerekli Kurulumlar

```bash
# CocoaPods yüklü olmalı
sudo gem install cocoapods

# iOS bağımlılıklarını yükleyin
cd ios
pod install
cd ..
```

### Adım 2: Xcode ile Build

1. Xcode'u açın:
   ```bash
   open ios/GymTimerAntrenmanZamanlayc.xcworkspace
   ```

2. Xcode'da:
   - Cihazınızı seçin (üst kısımdan)
   - Signing & Capabilities'den:
     - Team seçin (Apple Developer hesabınız)
     - Bundle Identifier'ı kontrol edin
   - Product > Run (⌘R) ile build edin ve cihaza yükleyin

### Adım 3: Development Server'ı Başlatın

```bash
# Ayrı bir terminal'de
npm start
```

## Seçenek 4: Production Build (Test için)

Production build oluşturup TestFlight'a yükleyebilirsiniz:

```bash
# Production build oluştur
eas build --platform ios --profile production

# TestFlight'a submit et
eas submit --platform ios
```

## Bildirim Testleri İçin Özel Notlar

### iOS Bildirim İzinleri

1. **İlk açılışta:**
   - Uygulama açıldığında bildirim izni otomatik istenecek
   - "İzin Ver" butonuna tıklayın

2. **İzin verilmediyse:**
   - Ayarlar > GymTimer > Bildirimler
   - Bildirimleri açın

3. **Test etmek için:**
   - Timer'ı başlatın
   - Set değiştiğinde bildirim gelmeli
   - Dinlenme fazında bildirim gelmeli
   - Antrenman bittiğinde bildirim gelmeli

### Debug Modu

Development build'de console logları görmek için:

```bash
# Metro bundler'ı başlatın
npm start

# Logları görmek için
npx react-native log-ios
```

## Sorun Giderme

### Build hatası alıyorsanız:

1. **Signing hatası:**
   - Apple Developer hesabınızın aktif olduğundan emin olun
   - Xcode'da Signing & Capabilities'den team seçin

2. **Pod install hatası:**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

3. **Cache temizleme:**
   ```bash
   npm start -- --reset-cache
   rm -rf ios/build
   ```

### Bildirimler çalışmıyorsa:

1. **İzin kontrolü:**
   - Ayarlar > GymTimer > Bildirimler
   - Bildirimlerin açık olduğundan emin olun

2. **Premium kontrolü:**
   - Premium kullanıcı olmalısınız
   - `usePremium.ts` dosyasında `TEST_PREMIUM = true` olduğundan emin olun

3. **Bildirim ayarları:**
   - Drawer menüden "Gelişmiş Bildirimler"e gidin
   - Tüm bildirim türlerinin açık olduğundan emin olun

## Hızlı Test Adımları

1. ✅ Uygulamayı iOS cihazına yükleyin
2. ✅ Uygulamayı açın (bildirim izni istenecek)
3. ✅ Premium kullanıcı olduğunuzdan emin olun
4. ✅ Timer'ı başlatın (3 set, 60s çalışma, 30s dinlenme)
5. ✅ Her set başında bildirim gelmeli
6. ✅ Dinlenme fazında bildirim gelmeli
7. ✅ Antrenman bittiğinde bildirim gelmeli

## Önerilen Test Senaryoları

### Senaryo 1: İzin Verme
- Uygulamayı ilk aç
- Bildirim izni iste → İzin ver
- Timer başlat → Bildirimler gelmeli

### Senaryo 2: İzin Reddetme
- Uygulamayı ilk aç
- Bildirim izni iste → İzin verme
- Bildirimler sayfasına git → Tekrar izin iste
- İzin ver → Bildirimler çalışmalı

### Senaryo 3: Arka Plan
- Timer'ı başlat
- Uygulamayı arka plana al
- Bildirimler gelmeye devam etmeli

### Senaryo 4: Bildirim Ayarları
- Bildirimler sayfasına git
- Çalışma fazı bildirimlerini kapat
- Timer başlat → Sadece dinlenme ve tamamlanma bildirimleri gelmeli

