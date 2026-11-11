# Fact check

Checked 2026-11-11 against `research.md` and the web. Line = scene id or the spoken line's opening words in `script.md`.

Primary documents opened in this pass: FTC complaint (Dkt. 1, W.D. Wash. 2:23-cv-01495, CourtListener RECAP PDF), Amazon's statement on aboutamazon.com, the Marketplace Pulse article, stripe.com/pricing. Not opened: Amazon's FY2025 10-K on SEC EDGAR, Amazon's fee table (sell.amazon.com unreachable from this session), the less-redacted complaint of Nov 2023, MLex article body (search summaries only), TechSpot (HTTP 403, not retried).

| Claim | Line | Source | Status | Note |
|---|---|---|---|---|
| Title: Amazon keeps $52 of "every" $100 you spend | TITLE | Marketplace Pulse, 13 Feb 2023: "more than 50% of sellers' revenue", for "a typical Amazon seller" using FBA and ads; "total fees vary depending on the category, product price, size, weight, and the seller's business model" | corrected | "Every $100" is not supported: the figure is an average for third-party sellers who use FBA and ads, and does not cover Amazon's own retail sales. Now "Why Amazon Can Keep $52 of the $100 You Spend". `brief.md` still carries the old working title. |
| Seller keeps about $10 of $100 | s01, "You spend one hundred dollars..." | research.md row 7 (illustrative model 28/17/20/15/10, seller 10) | corrected | Model figure, not a measured one. Narrowed to "a clothing seller"; on-screen "illustrative model" is in s02 and now also s10. |
| Amazon keeps about $52 | s02, "Amazon keeps about fifty-two." | research.md rows 5 and 7; Marketplace Pulse (>50% in 2022) | verified | As a model figure. 17 + 20 + 15 = 52. On-screen small print "illustrative model" present. |
| Not sales tax | s03 | none needed | verified | No figure. Seller fees are not a tax. |
| Card fee about $3.20 | s04, "It's not the card fee..." | stripe.com/pricing: "2.9% + 30¢" (opened) | corrected | Arithmetic: 100 x 0.029 + 0.30 = 3.20, correct. But this is Stripe's standard online rate, not a fee Amazon is known to pay; on Amazon, payment processing is inside the referral fee. Softened to "a typical one is about three dollars twenty." |
| Title question: Amazon keeps $52 "of every hundred you spend" | "So why does Amazon keep..." | as title | corrected | Now "So how can Amazon keep fifty-two dollars of a hundred you spend?" |
| "You paid Amazon. The seller got the change." | k01 | model | verified | Skit line, no figure. Read together with the corrected s10 line, which now says where the other $38 goes. |
| Three charges: fees, fulfillment, ads | s05 | Marketplace Pulse: referral fee, FBA fees, advertising | verified | |
| Numbers are one model from Amazon's fee tables and Marketplace Pulse | "These numbers are one model..." | research.md row 7 | corrected | Added "of a typical clothing seller" so the scope of the model is spoken, not only on screen. |
| Clothing commission 17% | s06 | research.md row 6 (Amazon fee table, 17% above $20); several 2026 fee guides agree: 5% up to $15, 10% from $15 to $20, 17% above $20 | corrected | True only above $20. Now "On clothing over twenty dollars, seventeen percent." Amazon's own table not opened (host unreachable); secondary guides only. 100 - 17 = 83, correct. |
| Fulfillment about $20 | s07 | Marketplace Pulse: "20-35% in Fulfillment by Amazon fees (including storage and other fees)" | verified | Model value at the low end of the published range. 83 - 20 = 63, correct. |
| Ads about $15 | s08 | Marketplace Pulse: "up to 15% for advertising and promotions on Amazon" | verified | Model value at the top of the published range ("up to"); kept as "about" under the model disclosure. 63 - 15 = 48, correct. |
| Amazon ad revenue $68.6B in 2025 | s09 | research.md row 1 (10-K segment table $68,593M); web aggregators of the 10-K give $68,635M / $68.64B | verified | Both versions round to $68.6B. The exact line item differs between secondary sources and the 10-K itself was not opened; check the filing before any real publish. Note that this figure includes non-seller ads (e.g. Prime Video); the script does not say it all comes from sellers, but the picture implies it. |
| About $188M a day | s09 | arithmetic | verified | 68.6B / 365 = 187.9M. |
| 17 + 20 + 15 = about 52, more than half | s10 | arithmetic | verified | Sum is exactly 52. |
| Seller's $10 follows from the $52 | s10 | research.md row 7 | corrected | 100 - 52 = 48, not 10. The model's other $38 (product and freight 28, returns and write-offs 10) was never mentioned, so the belt went 48 -> 10 unexplained and implied Amazon took it. Added "Product costs and returns eat thirty-eight more." and an on-screen bar segment "PRODUCT + RETURNS about 38". Check: 52 + 38 + 10 = 100. |
| "Then the government opened a file." | s11 | FTC complaint | verified | |
| FTC sued 26 Sept 2023, federal court, Washington State | s13 | Complaint header: "Case 2:23-cv-01495 Document 1 Filed 09/26/23", Western District of Washington (opened) | verified | 17 states joined the FTC; omitted, not wrong. |
| Quote "effectively invisible" | s14 | Complaint p. 9, para. 16: "Another form of punishment is to bury discounting sellers so far down in Amazon's search results that they become effectively invisible." (opened) | corrected | Quote is verbatim. The framing "Amazon's rules can leave a seller" was loose: the complaint describes a punishment for sellers who offer lower prices elsewhere. Reworded to "buries sellers who discount elsewhere until they're, quote, ...". |
| Quote "a price floor everywhere else" | s14 | Complaint p. 9, para. 17: "...often forces sellers to use their inflated Amazon prices as a price floor everywhere else." (opened) | corrected | Quote is verbatim. "create" replaced by "making Amazon's price ... a price floor everywhere else", which matches the sentence. Worded as an allegation; "ALLEGED" stamp on screen. |
| FTC alleges Project Nessie made over $1B in extra profit | s15 | The Register, 2 Nov 2023, quoting the less-redacted complaint: "more than $1 billion in excess profit"; also NBC/AP, Reuters-based reports. Original Dkt. 1 has the figure blacked out. | verified | Worded as an allegation; on-screen "FTC allegation". Less-redacted complaint itself not opened. |
| Amazon: FTC mischaracterizes the tool, and it was scrapped | s16, "Amazon says the FTC mischaracterizes..." | The Register: Amazon said the tool was "grossly mischaracterized"; spokesperson Tim Doyle: "The project ran for a few years on a subset of products, but didn't work as intended, so we scrapped it several years ago." | verified | Paraphrase, correctly not in quotation marks. The FTC disputes "scrapped" (it calls the tool paused); the script attributes the claim to Amazon, which is enough. |
| On-screen strip under the "Amazon statement, Sept 2023" card | s16 text | as above | corrected | The Nessie response came from a spokesperson in Oct/Nov 2023, not from the September statement. Strip now reads "Amazon spokesperson: tool mischaracterized, and scrapped". |
| Amazon: "wrong on the facts and the law" | s16 | aboutamazon.com, David Zapolsky, published 2023-09-26: "The lawsuit filed by the FTC today is wrong on the facts and the law, and we look forward to making that case in court." (opened) | verified | Verbatim fragment, correct speaker (Amazon, through its general counsel), correct month on the card. |
| No court has ruled Amazon's cut illegal | s17 | MLex via search (Oct 2026): liability trial still ahead; no liability ruling found | verified | True of this case as of Oct 2026. Nothing newer was found. |
| One company sells the shelf, the truck and the billboard | s18 | Marketplace Pulse (marketplace, FBA, ads all Amazon services) | verified | Explanatory line. See "missing response" below. |
| 2016: about $35 | s19 | research.md row 5 (35.2%, from a secondary source, TechSpot); a second secondary source (Zenventory) gives 35% six years earlier | verified | Secondary sources only. The Marketplace Pulse article text says "up from 40% five years ago" and that its seller data goes back to 2016; the yearly values are in a chart I could not read. Attributed in the line ("by Marketplace Pulse's count") and rounded to "about". |
| 2022: about $52 | s19 | Marketplace Pulse: "more than 50% of sellers' revenue"; research.md row 5 (51.8%) | verified | "More than 50%" is primary; 51.8 is from the chart via secondary sources. |
| Trial set for 2027 | s20 | MLex (Oct 2026): judge refused to move the trial from 29 March 2027; liability phase only | verified | Search summaries of two MLex articles; article body not opened. The script says only "2027". |

## Corrections made in script.md

1. TITLE: "Why Amazon Keeps $52 of Every $100 You Spend" -> "Why Amazon Can Keep $52 of the $100 You Spend".
2. s01: "...on Amazon... and the seller who made the sale keeps about ten." -> "...with a clothing seller on Amazon... and that seller keeps about ten."
3. s04: "that's about three dollars twenty" -> "a typical one is about three dollars twenty".
4. Title question: "So why does Amazon keep fifty-two dollars of every hundred you spend?" -> "So how can Amazon keep fifty-two dollars of a hundred you spend?"
5. s05: "These numbers are one model, built from..." -> "These numbers are one model of a typical clothing seller, built from..."
6. s06: "On clothing, seventeen percent." -> "On clothing over twenty dollars, seventeen percent."
7. s10 narration: added "Product costs and returns eat thirty-eight more."
8. s10 on-screen text: added bar segment "PRODUCT + RETURNS about 38" and small print "illustrative model".
9. s14: "alleges Amazon's rules can leave a seller, quote, ... and create, quote, ..." -> "alleges Amazon buries sellers who discount elsewhere until they're, quote, ... making Amazon's price, quote, ..."
10. s16 on-screen strip: "Amazon: tool mischaracterized, and scrapped" -> "Amazon spokesperson: tool mischaracterized, and scrapped".
11. SELF-CHECK: spoken words 310 -> 331, time 1:58 -> 2:06, sentences 52 -> 53.

Number of spoken lines is unchanged (37). No line was removed.

## Still open

- Amazon's FY2025 10-K was not opened. The $68.6B figure rests on secondary sources that disagree on the exact line item ($68,593M vs $68,635M).
- The 2016 figure (about 35%) rests on secondary sources only.
- Amazon's fee table was not opened; the 17% clothing rate rests on research.md and third-party fee guides.
- Missing response: the script gives Amazon's answer to the lawsuit but not to the fee split itself. Amazon's stated position (reported with the Marketplace Pulse study) is that FBA and ads are optional and that its services cost on average 30% less than alternatives. No line was added because the line count was to stay fixed; add one before any real publish.
- s09 places all $68.6B at the "ads" gate. Part of that revenue is not from sellers. A source strip such as "all Amazon ads, incl. video" would fix it.
- `storyboard.json`, `prompts.md`, `package.md`, `thumbnails.md`, `brief.md` and any recorded audio were not updated to match the corrected lines.
