# GitHub Pages Kurulum Rehberi

Bu rehber, LG Smart TV kumanda uygulamanızı GitHub Pages'de nasıl yayınlayacağınızı adım adım açıklar.

## 1. GitHub Repository Oluşturma

1. [GitHub](https://github.com) hesabınıza giriş yapın
2. Sağ üst köşeden **"New repository"** butonuna tıklayın
3. Repository ayarları:
   - **Repository name**: `lg-tv-remote` (veya istediğiniz bir isim)
   - **Description**: "LG Smart TV Web Remote Control"
   - **Public** seçeneğini işaretleyin
   - **Initialize this repository with a README** seçeneğini KALDIIRIN (zaten README.md var)
4. **Create repository** butonuna tıklayın

## 2. Projeyi GitHub'a Yükleme

### Windows PowerShell veya Git Bash kullanarak:

```powershell
# Proje klasörüne gidin
cd "C:\Users\uquri\OneDrive\Masaüstü\kumanda"

# Git repository'sini başlatın
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit'i oluşturun
git commit -m "Initial commit: LG Smart TV Remote Control"

# GitHub repository'nizi ekleyin (KULLANICI_ADINIZ yerine kendi GitHub kullanıcı adınızı yazın)
git remote add origin https://github.com/KULLANICI_ADINIZ/lg-tv-remote.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# Dosyaları GitHub'a yükleyin
git push -u origin main
```

## 3. GitHub Pages'i Aktif Etme

1. GitHub'da repository sayfanıza gidin
2. **Settings** (Ayarlar) sekmesine tıklayın
3. Sol menüden **Pages** seçeneğini bulun
4. **Source** bölümünde:
   - **Branch**: `main` seçin
   - **Folder**: `/ (root)` seçin
5. **Save** butonuna tıklayın
6. Birkaç dakika bekleyin, sayfa yenilendiğinde üstte yeşil bir kutu içinde sitenizin URL'si görünecek:
   - `https://KULLANICI_ADINIZ.github.io/lg-tv-remote/`

## 4. TV Bağlantısı Kurulumu

### TV Tarafı Ayarları:

1. **TV'nizi WiFi ağınıza bağlayın**:
   - TV Menü > Ağ > WiFi Bağlantısı
   - Ağınızı seçin ve şifreyi girin

2. **TV'nizin IP adresini öğrenin**:
   - TV Menü > Ağ > Ağ Durumu
   - IP adresini not edin (örn: `192.168.1.100`)

3. **LG Connect Apps'i etkinleştirin** (varsa):
   - TV Menü > Genel > LG Connect Apps
   - "Açık" konumuna getirin

### Web Uygulaması Ayarları:

1. Telefonunuz veya bilgisayarınızı **TV ile aynı WiFi ağına** bağlayın
2. Tarayıcınızda uygulamayı açın: `https://KULLANICI_ADINIZ.github.io/lg-tv-remote/`
3. **Ayarlar** (⚙️) butonuna tıklayın
4. TV'nizin IP adresini girin
5. **Kaydet ve Bağlan** butonuna tıklayın

## 5. Mobil Cihaza Yükleme (PWA)

### Android:
1. Chrome tarayıcıda uygulamayı açın
2. Sağ üst menüden **"Ana ekrana ekle"** seçeneğini seçin
3. Uygulama ana ekranınıza eklenecek

### iOS (iPhone/iPad):
1. Safari'de uygulamayı açın
2. Paylaş butonuna (⬆️) tıklayın
3. **"Ana Ekrana Ekle"** seçeneğini seçin
4. **"Ekle"** butonuna tıklayın

## 6. Klavye Kısayolları

Bilgisayardan kullanırken:

- **Ok tuşları**: Navigasyon (Yukarı/Aşağı/Sol/Sağ)
- **Enter**: OK/Tamam
- **Backspace**: Geri
- **Escape**: Çıkış
- **H**: Ana Sayfa (Home)
- **M**: Sessiz (Mute)
- **+/-**: Ses artır/azalt
- **Page Up/Down**: Kanal değiştir
- **Space**: Oynat/Duraklat
- **0-9**: Sayı tuşları

## 7. Sorun Giderme

### Bağlantı Kurulamıyor:
- TV ve cihazınızın aynı WiFi ağında olduğundan emin olun
- TV'nin IP adresini doğru girdiğinizden emin olun
- TV'nin güvenlik duvarı ayarlarını kontrol edin
- TV'yi yeniden başlatın

### Komutlar Çalışmıyor:
- Bağlantı durumunu kontrol edin (üstte yeşil nokta görünmeli)
- TV modelinizin WebOS veya UDAP protokolünü desteklediğinden emin olun
- Tarayıcı konsolunu açın (F12) ve hata mesajlarını kontrol edin

### GitHub Pages Açılmıyor:
- Repository'nin Public olduğundan emin olun
- GitHub Pages ayarlarının doğru yapıldığını kontrol edin
- 5-10 dakika bekleyin (ilk yayınlanma biraz zaman alabilir)

## 8. Güncelleme Yapma

Projeyi güncellemek için:

```powershell
cd "C:\Users\uquri\OneDrive\Masaüstü\kumanda"
git add .
git commit -m "Güncelleme açıklaması"
git push
```

Birkaç dakika içinde değişiklikler GitHub Pages'de yayınlanacaktır.

## Notlar

- Bu uygulama **sadece lokal ağda** çalışır (TV ile aynı WiFi)
- İnternet bağlantısı olmadan da kullanabilirsiniz (PWA sayesinde)
- TV modelinize göre bazı özellikler çalışmayabilir
- Güvenlik için TV'nizin IP adresi sadece tarayıcınızda saklanır

## Destek

Sorun yaşarsanız:
1. TV modelinizin kullanım kılavuzuna bakın
2. LG destek sayfasını ziyaret edin
3. GitHub repository'de issue açın
