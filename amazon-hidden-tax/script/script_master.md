# Amazon's $69 Billion Hidden Tax: The $100 Unit Economics Breakdown

Master script. Single source of truth for the voiceover and the cues.
Format rules (used by `tools/build.py`):
- Lines starting with `# PART` open a new part.
- Lines starting with `> ` are narration. Only these go to ElevenLabs.
- Everything else (step markers, on-screen notes, sources) is for the editor and the HTML engine.

Target: ~9:30 at ~155 words per minute (ElevenLabs speed ~1.03).

---

# PART 1 — The $100 Split
<!-- time=00:00-01:48 · scene=data/scene1.json · mode=waterfall -->

**[Step 1 · $100 sale]** On screen: a single $100 bar. Top-right counter: "$68.6B · Advertising services · FY2025 Form 10-K".
Source: Amazon FY2025 Form 10-K (advertising services, $68.6B).

> Every time you spend one hundred dollars with a seller on Amazon... about fifty-two of those dollars never reach the seller.
> And in 2026, the U.S. government accused Amazon of secretly overcharging the businesses that advertise there — by more than twenty billion dollars.
> Amazon denies it. But according to the FTC, you're paying for it too — even if you never shop on Amazon.
> In 2025, one line in Amazon's annual report — advertising — brought in sixty-eight point six billion dollars.
> So let's follow one hundred dollars. Dollar by dollar... and find out who actually gets your money.

**[Step 2 · Product & freight −$28]** On screen: "Illustrative model · typical apparel seller · per $100 of sales".
Source: model built from Marketplace Pulse take-rate data and Amazon's 2026 fee schedule.

> Meet a typical clothing seller on Amazon. For every hundred dollars in sales, here's where the money goes.
> First, the product itself. Manufacturing, ocean freight, and import duties. Twenty-eight dollars — paid months before anything sells.

**[Step 3 · Referral fee −$17]** Bar turns Amazon orange. Label: "Referral fee · 17% (apparel over $20)".

> The moment a customer clicks "Buy Now"... Amazon takes its first cut. A seventeen percent referral fee on clothing. Seventeen dollars.

**[Step 4 · FBA & storage −$20]** Amazon orange.

> Next, Fulfillment by Amazon. Picking, packing, shipping, storage... plus a new surcharge added in 2026. About twenty dollars.

**[Step 5 · Sponsored ads −$15]** Amazon orange. Small tag: "the line shoppers never see".

> Then, the line shoppers never see. Advertising. Just to show up where buyers look, a typical seller spends around fifteen dollars on sponsored listings.

**[Step 6 · Returns & write-offs −$10]**

> Returns and write-offs take another ten.

**[Step 7 · Seller keeps $10]** Split screen: Seller $10 vs Amazon $52 (17 + 20 + 15).

> The final split? The seller — who designed the product, paid the factory, and carried all the risk — keeps about ten dollars.
> Amazon — without owning a single thread — collects about fifty-two. More than five times what the seller keeps.
> But hold on to that fifteen-dollar ad line. That's where this story gets strange.

---

# PART 2 — The $68.6 Billion Ad Machine
<!-- time=01:48-03:40 · scene=data/scene2.json · mode=network -->

**[Step 1 · The 10-K line]** Evidence box: Form 10-K "Advertising services" row. Comparison chip: "> half of all daily & weekly newspaper revenue worldwide ($125.7B)".
Sources: Amazon FY2025 Form 10-K; WAN-IFRA World Press Trends Outlook (via Press Gazette).

> How did an online bookstore become a toll collector? The answer is buried in Amazon's SEC Form ten-K, under a line called "advertising services."
> In 2025, it brought in sixty-eight point six billion dollars — up twenty-two percent in a single year. For perspective... that's more than half the combined revenue of every daily and weekly newspaper on Earth.
> Not all of it comes from sellers — streaming ads count too — but sponsored listings are widely estimated to be the biggest piece.

**[Step 2 · Demand lock-in]** Layer 1 lights up: "Amazon search · 56–63% of US shoppers start here".
Sources: Jungle Scout Consumer Trends 2024 (56%); Constructor State of Ecommerce 2025 (63%).

> Here's how it works. Depending on the survey, between half and two-thirds of American online shoppers now start their product searches directly on Amazon.
> And once the buyers are all in one room... whoever controls the shelf controls the business.

**[Step 3 · Pay-to-play shelf]** B-roll: your own phone screen recording of an Amazon search, counting "Sponsored" labels.

> So Amazon turned the shelf into an auction. Try it yourself: search for almost anything on your phone... and count the "Sponsored" results before the first one that isn't. Every slot is a seller bidding, per click, against other sellers.

**[Step 4 · The hidden surcharge (alleged)]** Layer 2 pulses red. Evidence box: "FTC + 22 states v. Amazon · W.D. Wash. · filed Aug 31, 2026" · "alleged: up to +50% (ordinary days) / +250% (peak days) · $20B+".
Sources: FTC press releases (Aug 31 and Nov 5, 2026) via TechCrunch, Search Engine Journal, PPC Land; Amazon's response.

> And according to a new lawsuit, even the auction may not be what it seems. In August 2026, the FTC and twenty-two states sued Amazon, alleging that since 2019 it secretly added a surcharge on top of auction prices.
> Documents unsealed in November allege prices up to fifty percent above the auction result on ordinary days... and up to two hundred and fifty percent on days like Prime Day. The FTC puts the total overcharge at more than twenty billion dollars.
> Amazon calls the suit misguided, and says it never charges more than an advertiser's maximum bid.

**[Step 5 · The bottleneck]** Layer 3 lights up: "≈52% average take rate incl. ads".
Source: Marketplace Pulse (2022 average: 51.8%).

> For sellers, it's a prisoner's dilemma: bid away your margin... or disappear.
> So why don't they just charge less everywhere else? Because if they try... a bot is watching.

---

# PART 3 — The Price Floor & "Project Nessie"
<!-- time=03:40-05:15 · scene=data/scene3.json · mode=compare -->

**[Step 1 · Price parity trap]** Bars: Amazon $100 vs own store $85. Evidence box: FTC v. Amazon complaint, W.D. Wash., filed Sept 26, 2023.
Source: FTC press release and complaint (2023).

> In 2023, the Federal Trade Commission and a group of states sued Amazon for illegally maintaining a monopoly. The complaint describes what happens when a seller tries to undercut Amazon.
> Say you sell a dress for one hundred dollars on Amazon... and eighty-five on your own Shopify store, where your fees are lower.

**[Step 2 · The Buy Box]** Bars: "Through the Buy Box: 80%+ (industry est.)". Evidence: real page 9 of the complaint (¶16–17), "effectively invisible" and "a price floor everywhere else" highlighted; the redacted Buy Box share ("Nearly ■ %") shown as-is.
Sources: FTC v. Amazon complaint, Dkt. 1, p. 9 ¶16–17 (quotes verified against the filing); Feedvisor (Buy Box share estimate, not confirmed by Amazon; the FTC's own figure is redacted).

> According to the FTC, Amazon's algorithms scan the internet for lower prices. If they find one, your offer can lose the Buy Box — that yellow "Add to Cart" button. Industry estimates — never confirmed by Amazon — say more than eighty percent of sales go through it.
> The complaint goes further. It says Amazon can bury discounting sellers so far down in search results that they become — quote — "effectively invisible."
> So sellers do the rational thing. In the FTC's words, they use their inflated Amazon prices as "a price floor everywhere else"... which means, if the government is right, you pay the Amazon tax even at other stores.

**[Step 3 · Project Nessie]** Illustrative bars: Amazon raises price → rival algorithms follow. Evidence box: "FTC alleges: $1B+ excess profit" + Amazon's response.
Sources: unredacted FTC complaint (Nov 2023) via The Register, GeekWire; Amazon statements.

> Then there's Project Nessie — an algorithm the FTC says predicted when competitors would match Amazon's price increases... so Amazon could raise prices and watch rivals follow. The agency alleges it generated more than one billion dollars in extra profit.
> Amazon says the FTC "grossly mischaracterizes" the tool — and that it was scrapped because it didn't work as intended. More broadly, Amazon says the lawsuit is wrong on the facts and the law.
> But there's one cost we haven't counted yet... the one that arrives after the sale is over.

---

# PART 4 — Wardrobing: The Free Return That Isn't
<!-- time=05:15-06:44 · scene=data/scene4.json · mode=waterfall -->

**[Step 1 · Sale reversed]** On screen: "$850B returned in 2025 (NRF)" · "1 in 5 online purchases". Then the bar drops to $0.
Sources: NRF 2025 Retail Returns Landscape; Appriss Retail / Deloitte consumer returns report.

> Now for the cost that comes back in a box. According to the National Retail Federation, roughly one in five online purchases gets sent back.
> And in fashion, one kind of return has its own name. Wardrobing. Buy an evening dress on Friday. Wear it to a wedding on Saturday. Return it on Monday — "didn't fit." In one industry survey, six in ten retail executives said they'd seen it.
> For the shopper, the return is free. For the seller, here's what one worn, one-hundred-dollar dress actually costs.

**[Step 2 · Refund admin fee −$3.40]** Amazon orange. Label: "20% of the $17 referral fee (max $5)".
Source: Amazon refund administration fee policy.

> The customer gets their hundred dollars back. Amazon refunds most of its referral fee... but keeps a refund administration fee. Three dollars and forty cents.

**[Step 3 · FBA fee not refunded ≈ −$6]** Amazon orange.
Source: Amazon 2026 FBA rate card + 3.5% surcharge (verify exact apparel rate in Seller Central).

> The fulfillment fee Amazon charged to ship the dress? Not refunded. About six dollars... gone.

**[Step 4 · Returns processing ≈ −$3]** Amazon orange.
Source: Amazon apparel returns processing fee (range ~$1.65–$3.89+).

> Then, a returns processing fee. Around three dollars more.

**[Step 5 · Worn dress written off −$28]** Grey (inventory loss).

> And the dress itself comes back with makeup on the collar and perfume in the fabric. It can't be sold as new. Twenty-eight dollars of inventory... written off.

**[Step 6 · Net loss −$40.40]** Callout: "= profit from 4 full-price sales".

> Total: a loss of about forty dollars and forty cents — on a sale that no longer exists. At a ten percent margin, that's four full-price sales... just to pay for one wardrobed dress.
> And even the sellers who survive returns run into one more problem. Time.

---

# PART 5 — The Cash-Flow Corridor
<!-- time=06:44-08:00 · scene=data/scene5.json · mode=network -->

**[Step 1 · Factory cash goes out first]** Layer 0 lights up.

> So far, that's fifty-two dollars in fees and ads... and forty more every time a dress comes back. But the last trap isn't a fee at all.
> Selling on Amazon starts with a bet. Sellers pay their factories up front — often two or three months before a single unit reaches a customer.

**[Step 2 · Payout reserve]** Layer 1: "Funds released 7 days after confirmed delivery".
Source: Amazon delivery-date-based reserve (DD+7), seller documentation / coverage.

> Then, when the sale finally happens, the money still doesn't arrive. Under Amazon's current rules, seller funds generally become available seven days after the customer's confirmed delivery. Add settlement cycles on top, and many sellers wait two to four weeks to touch their own revenue.

**[Step 3 · Fees around the inventory]** Layer 2: "Inbound placement fee (2024) · +3.5% surcharge (Apr 2026)".
Sources: Amazon inbound placement fee; 3.5% fuel & logistics surcharge effective April 17, 2026.

> Meanwhile, the fees keep multiplying. Since 2024, there's a fee for how your boxes get spread across Amazon's warehouses. And in 2026, a three-and-a-half percent surcharge landed on top of every fulfillment fee.

**[Step 4 · The corridor]** Layer 3: "Too much stock → aged inventory surcharge · Under ~28 days → low-inventory-level fee".
Sources: Amazon low-inventory-level fee (per variant since Jan 2026); Marketplace Pulse 2026 Seller Index.

> And then there's the corridor. Keep too much stock for too long, and you pay aged inventory surcharges. But let your stock fall below roughly twenty-eight days of supply... and you pay a low-inventory-level fee on every unit shipped.
> Too much costs money. Too little costs money. Amazon collects on both sides.
> So... why does anyone stay?

---

# PART 6 — Who Really Gets Your $100
<!-- time=08:00-09:27 · scene=data/scene6.json · mode=compare -->

**[Step 1 · The alternative isn't free]** Bars: Amazon ≈$52 vs own store card fee ≈$3.20 + "? (paid traffic)".
Sources: Stripe standard pricing (2.9% + 30¢); Amazon 2020 shareholder letter (200M+ Prime members).

> On your own website, the payment processor takes about three dollars on a hundred-dollar sale. Sounds like a bargain... until you realize the customers don't come with it. You have to buy them — one click at a time — on Google, Meta, or TikTok. A different auction... with the same tollbooth logic.
> And Amazon does deliver something real. Over two hundred million Prime members, fast delivery, and a checkout button people trust without thinking. That's what sellers are paying for.

**[Step 2 · What changed is the price]** Bars: 35.2% (2016) vs 51.8% (2022). Chip: "FTC v. Amazon · trial 2027 · W.D. Wash."

> What's changed is the price. In 2016, Amazon's cut was about a third of a seller's revenue. By 2022, it was more than half.
> And in 2027, a federal judge in Seattle will start deciding whether parts of how Amazon got here broke the law. If the FTC wins, the Buy Box rules could change... and with them, prices across the internet. If Amazon wins, the tollbooth stays.

**[Step 3 · Back to the $100]** Bars: Seller $10 vs Amazon $52. Final frame mirrors the opening frame (loop). On-screen text: "Every number is sourced in the description."

> So... back to where we started. When you spend one hundred dollars with a seller on Amazon — who actually gets your money?
> About ten dollars goes to the business that made the product. About fifty-two goes to the company that owns the shelf.
> In modern commerce, the company that makes the product rarely gets rich. The fortune belongs to whoever controls the last three seconds before checkout.
