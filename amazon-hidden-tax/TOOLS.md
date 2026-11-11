# Video üretimi için açık kaynak araçlar (Kasım 2026 araştırması)

Lisansları her projenin GitHub'daki lisans dosyasından okudum. Bu oturumdan GitHub API'sine erişilemediği için yıldız sayılarını doğrulayamadım. Seçim ölçütü popülerlik değil, bu videoya uyup uymadığı.

## Önerilen üretim hattı

```
script_master.md
  → tools/build.py → voiceover/part1..6.txt
  → ElevenLabs (with-timestamps API) → part1..6.mp3 + karakter düzeyinde zamanlama
  → tools/align.py → her JSON adımının "cue" cümlesini saniyeye eşler → timeline.json
  → HyperFrames sahneleri (scene1..6.json + timeline.json) → sahne MP4'leri
  → FFmpeg ile birleştirme, müzik, -14 LUFS ses seviyesi → final.mp4 + altyazı (.srt)
```
Bu hattın en büyük kazancı senkron. 26 adımın her birinin ne zaman başladığı sesten otomatik hesaplanıyor, elle zamanlama gerekmiyor.

## Araçlar

| İş | Araç | Lisans | Karar |
|---|---|---|---|
| HTML'den video render | [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen) | Apache 2.0 | **Ana motor.** HTML ve CSS ile yazılıp MP4'e render ediliyor. Hazır grafik (data-chart) ve altyazı blokları, Claude Code eklentisi var. Node 22 ve FFmpeg istiyor, ikisi de burada kurulu. |
| Alternatif motor | [Remotion](https://github.com/remotion-dev/remotion) | Kendi lisansı | Bireyler ve 3 kişiye kadar şirketler için ücretsiz. React ile çalışıyor. HyperFrames çalışmazsa yedek. |
| Matematik ve veri animasyonu | [Manim Community](https://github.com/ManimCommunity/manim) | MIT | 3Blue1Brown tarzı görünüm. Bir iki vurucu sahne için düşünülebilir ama ikinci bir motor iş yükünü artırır. Şimdilik gerek yok. |
| HTML içi hareket | [anime.js](https://github.com/juliangarnier/anime) | MIT | Zaman çizelgesi ileri geri sarılabiliyor, HyperFrames'in istediği de bu. |
| HTML içi hareket | GSAP | Ücretsiz ama kendi lisansı (OSI onaylı açık kaynak değil) | 2025'ten beri ticari kullanım dahil ücretsiz. Bizim kullanımımıza bir kısıtlaması yok. |
| Grafik geometrisi | [D3](https://github.com/d3/d3) | ISC | Şelale ve ağ çizimleri için. |
| Grafik (hazır) | [Apache ECharts](https://github.com/apache/echarts) | Apache 2.0 | Hızlı çözüm, ama özelleştirmesi D3'ten daha zor. |
| Vektör animasyon | [lottie-web](https://github.com/airbnb/lottie-web) | MIT | İkon ve küçük hareketler için (LottieFiles'taki ücretsiz animasyonların lisansını tek tek kontrol et). |
| Sesten kelime zamanlaması | [WhisperX](https://github.com/m-bain/whisperX) | BSD-2 | Ses ElevenLabs arayüzünden indirilirse kelime zamanlarını bununla çıkarırız. |
| Sesten kelime zamanlaması | [stable-ts](https://github.com/jianfch/stable-ts), [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | MIT | WhisperX'e hafif alternatifler. |
| Sessizlik kırpma | [auto-editor](https://github.com/WyattBlue/auto-editor) | Kamu malı (public domain) | Uzun esleri otomatik kısaltır. Muhtemelen gerekmeyecek. |
| Yedek seslendirme (yerel) | [Kokoro](https://github.com/hexgrad/kokoro) | Apache 2.0 | Ticari kullanım serbest. Kalitesi ElevenLabs'in altında, sadece yedek olarak. |
| Yedek seslendirme (yerel) | [Chatterbox](https://github.com/resemble-ai/chatterbox) | MIT | Ticari kullanım serbest, aynı şekilde yedek. |
| Tarayıcı otomasyonu | [agent-browser](https://github.com/vercel-labs/agent-browser) | Apache 2.0 | SEC ve FTC belgelerinin ekran görüntüleri için kullanılabilir. Ama burada zaten Playwright kurulu, ona gerek yok. |

## Kullanmayacaklarımız

| Araç | Neden |
|---|---|
| [F5-TTS](https://github.com/SWivid/F5-TTS) | Kodu MIT ama **model ağırlıkları CC-BY-NC**, yani ticari kullanım yasak. Para kazanan bir kanalda kullanılamaz. |
| [AudioCraft / MusicGen](https://github.com/facebookresearch/audiocraft) | Aynı durum: **ağırlıklar CC-BY-NC 4.0**. Müzik için YouTube Audio Library'yi kullan, ücretsiz ve gelir elde edilen videolarda serbest. |
| MoneyPrinterTurbo, ShortGPT | Şablonla toplu video üretiyorlar. YouTube'un özgün olmayan içerik politikasına takılma riski var, 9,5 dakikalık bir belgesel için de kaliteleri yetersiz. |
| Trend listesindeki diğerleri (sherlock, mujoco, astryx, RuView, gbrain, ha-mcp, OpenMausBot, daily_stock_analysis) | Video üretimiyle ilgileri yok. mujoco bir fizik simülatörü, Dozo serisi için ileride bakılabilir. |
| anthropics/skills | Faydalı, ama içindeki beceriler (canvas-design, theme-factory vb.) bu oturumda zaten yüklü. |

## ElevenLabs zaman damgası özelliği
`POST /v1/text-to-speech/{voice_id}/with-timestamps` uç noktası sesle birlikte karakter düzeyinde başlangıç ve bitiş zamanları döndürüyor ([dokümantasyon](https://elevenlabs.io/docs/api-reference/streaming-with-timestamps)). JSON'lardaki `cue` alanları bu zamanlara eşlenince her sahne adımı sese tam oturuyor. 6 bölüm toplam yaklaşık 8.900 karakter. Multilingual v2'de kabaca karakter başına 1 kredi harcanıyor.
