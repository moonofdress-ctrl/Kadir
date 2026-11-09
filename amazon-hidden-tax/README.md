# Amazon's $69 Billion Hidden Tax — Yapım Dosyası

9 dakika 30 saniyelik, Tier-1 (ABD, İngiltere, Kanada) izleyicisine yönelik İngilizce belgesel. Gemini taslağı baştan doğrulandı, düzeltildi ve yeniden yazıldı.

## Klasörler

| Yol | İçerik |
|---|---|
| `script/script_master.md` | **Ana senaryo.** Seslendirme metni, sahne işaretleri, ekran yazıları ve kaynaklar tek dosyada. Değişiklikleri burada yap. |
| `voiceover/part1.txt` … `part6.txt` | ElevenLabs'e doğrudan yapıştırılacak temiz metinler. İçlerinde sahne işareti ya da Türkçe yok. |
| `data/scene1.json` … `scene6.json` | HTML motoru için sahne verileri. `all_scenes.json` hepsini bir arada içeriyor. |
| `FACT_CHECK.md` | Her rakamın kaynağı ve doğrulama durumu. Gemini'den çıkarılan iddialar da burada. |
| `youtube/package.md` | Başlık, A/B alternatifleri, thumbnail fikirleri, açıklama (bölümler ve kaynaklar), sabit yorum, etiketler. |
| `tools/` | `build.py` seslendirme dosyalarını üretip süreyi ölçer. `make_data.py` JSON'ları üretip toplamları kontrol eder. |

Senaryoyu değiştirdikten sonra şu iki komutu çalıştır:
```bash
python3 tools/build.py
python3 tools/make_data.py
```
`build.py` her bölümün kelime sayısını ve tahmini süresini yazar. `make_data.py` şelale toplamları ya da adım sayıları tutmazsa hata verir.

## Süre

| Bölüm | Konu | Kelime | Tahmini süre | Zaman aralığı |
|---|---|---|---|---|
| 1 | 100 dolar nereye gidiyor | 279 | 1:48 | 0:00–1:48 |
| 2 | 68,6 milyar dolarlık reklam makinesi ve gizli ek ücret davası | 290 | 1:52 | 1:48–3:40 |
| 3 | Fiyat tabanı ve Project Nessie | 246 | 1:35 | 3:40–5:15 |
| 4 | Wardrobing | 231 | 1:29 | 5:15–6:44 |
| 5 | Nakit akışı koridoru | 197 | 1:16 | 6:44–8:00 |
| 6 | 100 dolarını kim alıyor | 224 | 1:27 | 8:00–9:27 |
| **Toplam** | | **1.467** | **≈9:27** | |

Süreler dakikada 155 kelimeye göre hesaplandı. ElevenLabs'te Speed 1,03 civarına denk geliyor, normal hızda (1,0) toplam yaklaşık 9:47 sürer. Gerçek süre seçilen sese de bağlı.

## ElevenLabs üretimi
- **Model:** Eleven Multilingual v2. Uzun tek anlatıcılı metinde ses tonu en az bu modelde kayıyor. v3 daha duygusal okuyor ama uzun metinde tutarlılığı daha düşük.
- **Ses:** Voice Library'de "Narrative / Documentary" kategorisinde Amerikan aksanlı bir ses seç. Önce 1. bölümün ilk 30 saniyesini 2–3 sesle dene.
- **Ayarlar:** Stability %45, Similarity %75, Style %15, Speaker Boost açık. Gemini'nin önerdiği ayarlar makul. Ama "BlackRock/Vanguard standardı" diye bir şey yok, o etiketi Gemini uydurmuş.
- **Bölümler:** Her `partN.txt` dosyasını ayrı üret, ses ve ayarlar hep aynı kalsın. Montajda bölüm aralarına 0,6–0,8 saniye sessizlik ekle. Alternatif olarak ElevenLabs Studio'da 6 bölümlük tek bir proje açabilirsin.
- **Duraklamalar:** Metindeki `...` ve `—` işaretleri nefes payı veriyor. Daha uzun bir es gerekirse v2'de `<break time="0.8s" />` kullanılabilir. v3'te bu etiket çalışmıyor.
- **Rakamlar:** Para ve yüzdeler yanlış okunmasın diye yazıyla yazıldı ("fifty-two dollars"). Yıllar rakamla bırakıldı.

## HTML motoru

JSON'lar Gemini'nin alan adlarını koruyor (`tag`, `title`, `unit`, `steps`, `val`, `type`, `sub`, `activeLayer`, `leftVal`, `rightVal`, `leftText`, `rightText`). Yani eski Gemini HTML'i de bunları okuyabilir. Eklenen alanlar:

- `step` ve `cue`: adımın numarası ve senaryoda o adımı tetikleyen ilk cümle. Montajda senkron için kullanılır.
- `narration`: o adımın tam seslendirme metni.
- `to`: şelalede maliyetin kime gittiği (`amazon`, `supplier`, `loss`, `seller`). Amazon'un payını turuncu göstermek için.
- `layers`: ağ sahnelerinin düğümleri. Gemini'nin motoru bunları koda gömmüştü, bu yüzden 5. sahne 2. sahnenin düğümlerini gösterirdi.
- `evidence`: sağ üstteki kanıt kutusunun içeriği (belge adı ve satır ya da alıntı).
- `display`: yaklaşık değerler için ekrandaki metin (örneğin "≈$6").
- `unit`: karşılaştırma sahnelerinde adım bazında ($ ya da %).
- `estimate` / `illustrative`: ekranda "tahmin" ya da "temsili" etiketi göstermek için.

**Durum:** Açık kaynak HyperFrames (HeyGen, Apache 2.0) motorunu kurmak için `npx hyperframes` komutu gerekiyor. Bu oturumun otomatik izin kontrolü bu adımı engelledi, onay bekliyor.

## Yayından önce yapılacaklar
1. `FACT_CHECK.md` içindeki 🟡 satırları birincil kaynaktan kontrol et. En önemlileri 10-K'daki $68,6 milyar ve FTC dilekçesindeki alıntılar.
2. Seller Central'daki Fee Preview'dan 1 lb'lık bir elbisenin gerçek FBA ücretine bak. Senaryoda yaklaşık 6 dolar varsaydık.
3. 2. bölüm için kendi telefonunda Amazon'da bir arama yap, ekranı kaydet ve "Sponsored" etiketlerini göster.
4. Kanıt kutusu için FTC dilekçesinden ve 10-K'dan ilgili sayfaların ekran görüntüsünü al. İkisi de herkese açık resmi belge.
5. YouTube açıklamasındaki bölüm zamanlarını son kurgudan güncelle.
