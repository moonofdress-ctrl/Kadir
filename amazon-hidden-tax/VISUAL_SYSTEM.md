# Görsel Sistem: "Paper Trail" (Her doların bir kâğıt izi var)

Amaç: "Claude/yapay zekâ dashboard'u" görünümünden (koyu zemin, turuncu vurgu, kartlar, slayt mantığı) tamamen çıkmak. Dört yönü tek bir dünyada birleştiriyoruz. Senaryo, JSON, zamanlama ve render hattı aynı kalıyor, değişen yalnızca görsel katman.

## 1. Dört katman tek bir dünyada

| Katman | Görevi | Ne zaman |
|---|---|---|
| **Kanıt masası** (temel dünya) | Kuşbakışı bir masa: gerçek belge sayfaları (10-K, FTC dilekçeleri), fosforlu kalem, kırmızı ip, "ALLEGED" damgası. Kamera kâğıtlar arasında yavaşça gezinir. | Her iddia ve her kaynakta. Güvenin taşıyıcısı bu katman. |
| **Fiş ve makas** (kanalın imzası) | Termal yazıcıdan satır satır çıkan bir kasa fişi. Stilize bir 100 dolar banknot her ücrette makasla kesilir, dilimler ücretle orantılı. Fiş bölümler arasında "ara toplam" olarak geri döner. | 1. ve 4. bölümün ana anlatımı, bölüm geçişleri, final. |
| **3D mekanizma** | Mekânsal fikirler için kâğıt dokulu, toon gölgeli 3D sahneler: gişe ve açık artırma şeritleri (2. bölüm), daralan depo koridoru (5. bölüm). Hazır 3D gibi değil, masa dünyasının devamı gibi görünür. | Yalnızca "mekanizma" anlatılırken. |
| **Sinematik görüntü ve kinetik yazı** | Gerçek stok görüntü (depo, kargo, alışveriş, iade kutusu): sıcak, az doygun renk ayarı ve film greni. Kilit rakamlar dev yazıyla ekrana çarpar ($68.6B, +250%, $52). | Kanca, bölüm açılışları ve duygusal anlar. |

## 2. Görsel dil (eskisiyle karşılaştırma)

| | Eski ("Claude") | Yeni ("Paper Trail") |
|---|---|---|
| Zemin | Koyu lacivert ızgara | Gazete kâğıdı (#EDE6D6), koyu ahşap masa, karton |
| Vurgu | Turuncu (Claude'un ve Amazon'un rengi) | Fosforlu sarı (#FFE74C), kırmızı damga mürekkebi (#C8102E) = Amazon'un payı, para yeşili (#2F6B4F) = satıcının payı |
| Yazı | Inter (her yapay zekâ arayüzü) | Belgelerde serif (Source Serif 4), fişte mono (IBM Plex Mono), kinetik yazıda dar kalın font (Anton). Hepsi OFL lisanslı. |
| Hareket | Kayan kartlar, fade | Kesik montaj, sürekli yavaş kamera itişi, kâğıtlarda 12 fps stop-motion titremesi, damga vuruşu, makas kesimi |
| Ses | Yok | Kâğıt sürtünmesi, kalem gıcırtısı, fiş yazıcısı, makas, damga, yazar kasa |
| Ritim | Her adımda aynı slayt düzeni | Her 6–10 saniyede bir görsel değişim, ama alıntı okunurken görüntü sabit kalır |

## 3. Bölüm bölüm sahne planı

| Bölüm | Akış |
|---|---|
| **1 · 100 dolar** | Ödeme tıklamasının görüntüsü üzerine "$100" yazısı çarpar. 10-K sayfasında "Advertising services" satırı fosforlanır. Fiş yazmaya başlar, banknot her ücrette kesilir (28 / 17 / 20 / 15 / 10). Masada final: satıcının 10 dolarlık şeridi ile Amazon'un 52 dolarlık yığını yan yana. |
| **2 · Reklam makinesi** | Telefonda alışveriş görüntüsü ve "56–63%". 3D gişe: "Sponsored" şeritleri ve teklif veren satıcılar. 2026 FTC dilekçesinin sayfasına "ALLEGED" damgası vurulur, "+250%" yazısı çarpar. Fişte "Ads −$15" satırı parlar. |
| **3 · Fiyat tabanı ve Nessie** | Kanıt panosu: 2023 FTC dilekçesinin sayfaları, kırmızı iple bağlanmış alıntılar. "Add to Cart" düğmesi genel bir çizim olarak gösterilir, Amazon arayüzünün kopyası değil. Nessie: üç mağazanın fiyat etiketleri birlikte yükselir, üstte "FTC ALLEGES" damgası. Amazon'un cevabı ayrı bir not kâğıdında. |
| **4 · Wardrobing** | Gece elbisesi, düğün ve iade kutusu görüntüleri (yüzler gösterilmez, kimse dolandırıcı gibi resmedilmez). Fiş "RETURN" diye yeniden yazar, eksi satırlar dizilir. Makyaj lekeli elbise kesiti, "−$40.40" damgası, dört bozuk para teker teker kaybolur. |
| **5 · Nakit koridoru** | 3D depo koridoru: takvim yaprakları uçar ("Day −60"), para "Delivery + 7" yazan bir kasada kilitli bekler. Koridorun iki duvarı daralır: bir yanda "too much stock" ücreti, öbür yanda "too little stock" ücreti. |
| **6 · 100 dolarını kim alıyor** | Masada iki fiş yan yana: kendi mağazanın fişi (kart ücreti $3.20 ve bir soru işareti) ile Amazon'un fişi ($52). 2027 duruşma takvimi. Final açılışa bağlanır: banknotun parçaları, $10'a karşı $52. Son cümle kinetik yazıyla. |

## 4. Araçlar ve kaynaklar (lisansları kontrol edildi)

| İş | Kaynak | Lisans ve not |
|---|---|---|
| Render | HyperFrames | Apache 2.0, kurulu |
| Hazır bloklar | HyperFrames kütüphanesi (456 blok): `paper-collage-reveal`, `torn-paper-rip`, `marker-highlight`, `grain-overlay`, `warm-grain`, `camera-rig-depth-stack`, `parallax-zoom`, `typewriter`, `kinetic-type`, `caption-kinetic-slam`, `number-wheel`, `transitions-3d`, `zoom-through-transition`, `filmed-screen`, `three-orbiting-cards` | Düzenlenebilir kaynak kodu olarak projeye eklenir |
| 3D | Three.js (npm üzerinden) | MIT |
| 3D modeller ve dokular | Kenney, Poly Haven, ambientCG | CC0, ticari kullanım serbest |
| Belgeler | FTC dava dilekçeleri (ftc.gov), Amazon 10-K (sec.gov) | FTC belgeleri ABD devlet eseri. 10-K'dan alıntı yorum ve haber amaçlı. Ekran görüntüleri gerçek belgelerden alınacak, asla yeniden dizilmeyecek. |
| Stok görüntü | Pexels API | Ücretsiz ve ticari kullanıma açık. Ama logo veya marka görünen görüntü ticari bağlamda kullanılamaz, bu yüzden logosuz depo görüntüleri seçilecek. Tanınabilir kişiler olumsuz bir bağlamda gösterilmeyecek (wardrobing sahneleri yüzsüz). Ücretsiz bir API anahtarı gerekiyor. |
| Ses efekti | Sonniss GDC paketi, Kenney ses paketleri | Sonniss telifsiz ve ticari kullanıma açık (yapay zekâ eğitiminde kullanılamaz). Kenney CC0. |
| Müzik | YouTube Audio Library | Gelir elde edilen videolarda ücretsiz |
| Fontlar | Google Fonts (Source Serif 4, IBM Plex Mono, Anton) | OFL |
| Taslak ses | Kokoro (`hyperframes tts`, am_michael sesi) | Apache 2.0, kurulu. Final ses için ElevenLabs. |
| Banknot | Stilize, tek yüzlü bir 100 dolar çizimi | 18 U.S.C. § 504 film ve televizyon için istisna tanıyor, yine de gerçek fotoğraf yerine stilize çizim daha güvenli |

## 5. Üretim sırası
1. **Stil kareleri:** Her katmandan birer kare (masa, fiş ve makas, 3D gişe, görüntü ve kinetik yazı). Onaydan önce tam üretime geçilmez.
2. **Taslak ses:** Kokoro ile adım adım ses üretilir, zamanlama gerçek sese oturur.
3. **Sahne kütüphanesi:** Her katman bir şablon olur, JSON'daki `mode` alanı şablonu seçer.
4. **Varlıklar:** Belge ekran görüntüleri, Pexels görüntüleri, dokular, ses efektleri.
5. **Tam render:** Final ses (ElevenLabs) gelince zamanlama otomatik yenilenir ve video yeniden render edilir.
