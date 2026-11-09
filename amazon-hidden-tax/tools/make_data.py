#!/usr/bin/env python3
"""Write the six scene JSON packages for the HTML engine.

Numbers live here once. Each step's `cue` and `narration` are pulled from
script/script_master.md, so the data and the voiceover cannot drift apart.
Field names keep Gemini's schema (tag, title, unit, steps[label, val, type, sub,
activeLayer, leftVal, rightVal, leftText, rightText]) so the old engine can still
read them; extra fields are additive.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "script" / "script_master.md"
OUT = ROOT / "data"

SOURCES_10K = {"doc": "Amazon.com, Inc. — Form 10-K, fiscal year 2025", "line": "Advertising services: $68.6B (+22% YoY)"}
FTC_CASE = "FTC et al. v. Amazon.com, Inc., No. 2:23-cv-01495 (W.D. Wash.)"

SCENES = [
    {
        "scene": 1, "part": 1, "mode": "waterfall",
        "tag": "UNIT ECONOMICS AUTOPSY",
        "title": "Where $100 of Amazon Sales Actually Goes",
        "unit": " USD", "currency": "USD",
        "footnote": "Illustrative model · typical third-party apparel seller · per $100 of sales · Sources: Marketplace Pulse; Amazon 2026 fee schedule",
        "steps": [
            {"label": "Customer Sales", "val": 100, "type": "start", "to": "seller",
             "sub": "$100 of sales. Who actually keeps it?", "evidence": SOURCES_10K},
            {"label": "Product & Freight", "val": -28, "type": "cost", "to": "supplier",
             "sub": "Manufacturing, ocean freight and import duties — paid months before anything sells."},
            {"label": "Referral Fee (17%)", "val": -17, "type": "cost", "to": "amazon",
             "sub": "Amazon's first cut: a 17% referral fee on apparel over $20."},
            {"label": "FBA, Storage & Surcharges", "val": -20, "type": "cost", "to": "amazon",
             "sub": "Picking, packing, shipping, storage — plus a 3.5% surcharge since April 2026."},
            {"label": "Sponsored Ads", "val": -15, "type": "cost", "to": "amazon",
             "sub": "The line shoppers never see: about $15 of every $100 goes to sponsored listings."},
            {"label": "Returns & Write-offs", "val": -10, "type": "cost", "to": "loss",
             "sub": "Refunds, return fees and inventory that can't be resold."},
            {"label": "Seller Keeps", "val": 10, "type": "final", "to": "seller",
             "sub": "The seller keeps $10. Amazon collects $52 — more than five times as much.",
             "callout": {"label": "Amazon's take", "val": 52, "parts": [17, 20, 15], "pos": "tr", "boxes": [
                 {"title": "Amazon collects", "big": "$52", "sub": "$17 referral + $20 FBA + $15 ads", "to": "amazon"},
                 {"title": "Seller keeps", "big": "$10", "sub": "after product, fees, ads and returns", "to": "seller"}]}},
        ],
    },
    {
        "scene": 2, "part": 2, "mode": "network",
        "tag": "THE $68.6 BILLION TOLLBOOTH",
        "title": "How a Digital Shelf Became an Ad Auction",
        "unit": "",
        "footnote": "Sources: Amazon FY2025 Form 10-K; WAN-IFRA 2025; Jungle Scout 2024; Constructor 2025; FTC v. Amazon (2026, allegations); Marketplace Pulse",
        "layers": [
            [{"name": "Third-party sellers", "y": 0.25}, {"name": "Apparel brands", "y": 0.5}, {"name": "Factory-direct sellers", "y": 0.75}],
            [{"name": "Amazon search (56–63% of US shoppers start here)", "y": 0.5}],
            [{"name": "Sponsored-ads auction ($68.6B in 2025)", "y": 0.5}],
            [{"name": "Shopper's first screen (≈52% total take)", "y": 0.5}],
        ],
        "steps": [
            {"label": "1. The 10-K Line", "val": "$68.6B Ad Revenue", "activeLayer": 0,
             "sub": "More than half the revenue of every daily and weekly newspaper on Earth ($125.7B).",
             "evidence": SOURCES_10K},
            {"label": "2. Demand Lock-In", "val": "56–63% Start on Amazon", "activeLayer": 1,
             "sub": "Share of US online shoppers who start product searches on Amazon (Jungle Scout 2024 · Constructor 2025)."},
            {"label": "3. The Pay-to-Play Shelf", "val": "Count the 'Sponsored'", "activeLayer": 2,
             "sub": "Every slot is a seller bidding per click against other sellers for the same customer.",
             "broll": "Creator's own phone screen recording of an Amazon search"},
            {"label": "4. The Hidden Surcharge (Alleged)", "val": "Up to +250% on Peak Days", "activeLayer": 2, "accent": "loss",
             "sub": "FTC + 22 states allege a secret surcharge on top of auction prices since 2019: $20B+ overcharged.",
             "evidence": {"doc": "FTC et al. v. Amazon.com, Inc. (W.D. Wash.), filed Aug. 31, 2026",
                          "quote": "Alleged: up to 50% above auction results on ordinary days, up to 250% on peak days"}},
            {"label": "5. The Bottleneck", "val": "≈52% Take Rate", "activeLayer": 3,
             "sub": "Fees + ads ≈ 52% of seller sales (Marketplace Pulse, 2022 average: 51.8%)."},
        ],
    },
    {
        "scene": 3, "part": 3, "mode": "compare",
        "tag": "FTC v. AMAZON · ALLEGATIONS",
        "title": "The Price Floor & Project Nessie",
        "unit": "",
        "footnote": "FTC claims are allegations; Amazon denies wrongdoing. Buy Box share is an industry estimate not confirmed by Amazon.",
        "steps": [
            {"label": "1. The Price-Parity Trap", "unit": "$", "leftVal": 100, "rightVal": 85,
             "leftText": "Amazon listing: $100", "rightText": "Own Shopify store: $85", "leftTo": "amazon", "rightTo": "seller",
             "sub": "What happens when a seller charges less off Amazon?",
             "evidence": {"doc": FTC_CASE, "line": "Complaint filed Sept. 26, 2023"}},
            {"label": "2. The Buy Box", "unit": "%", "leftVal": 80, "rightVal": 20, "estimate": True,
             "leftText": "Through the Buy Box: 80%+", "rightText": "Everything else: <20%", "leftTo": "amazon", "rightTo": "supplier",
             "sub": "FTC: discounting sellers can become \"effectively invisible.\"",
             "evidence": {"doc": FTC_CASE, "quote": "\"artificial price floor everywhere\""}},
            {"label": "3. Project Nessie", "unit": "$", "leftVal": 110, "rightVal": 110, "illustrative": True,
             "leftText": "Amazon raises its price", "rightText": "Rival algorithms follow", "leftTo": "amazon", "rightTo": "supplier",
             "sub": "FTC alleges $1B+ in extra profit. Amazon: the FTC \"grossly mischaracterizes\" the tool.",
             "evidence": {"doc": "Unredacted FTC complaint (Nov. 2023)", "quote": "Alleged: more than $1 billion in excess profit"}},
        ],
    },
    {
        "scene": 4, "part": 4, "mode": "waterfall",
        "tag": "REVERSE LOGISTICS AUTOPSY",
        "title": "The True Cost of One \"Free\" $100 Return",
        "unit": " USD", "currency": "USD",
        "footnote": "One worn $100 dress · 17% referral fee · ≈ values vary by size and weight · Sources: NRF 2025; Appriss Retail; Amazon fee policies 2026",
        "steps": [
            {"label": "Sale Reversed", "val": 0, "type": "start", "to": "seller",
             "sub": "The customer gets $100 back. The sale no longer exists.",
             "stats": ["~$850B returned in 2025 (NRF)", "~1 in 5 online purchases returned"]},
            {"label": "Refund Admin Fee", "val": -3.40, "type": "cost", "to": "amazon",
             "sub": "Amazon keeps 20% of the $17 referral fee (capped at $5)."},
            {"label": "FBA Fee Not Refunded", "val": -6, "display": "≈−$6", "type": "cost", "to": "amazon",
             "sub": "The fulfillment fee Amazon charged to ship the dress is gone."},
            {"label": "Returns Processing", "val": -3, "display": "≈−$3", "type": "cost", "to": "amazon",
             "sub": "Apparel returns processing fee (roughly $1.65–$3.89 by size)."},
            {"label": "Worn Dress Written Off", "val": -28, "type": "cost", "to": "loss",
             "sub": "Makeup and perfume: it can't be sold as new."},
            {"label": "Net Loss", "val": -40.40, "type": "final", "to": "loss",
             "sub": "= the profit from four full-price sales at a 10% margin.",
             "callout": {"pos": "bl", "boxes": [
                 {"title": "One wardrobed return", "big": "−$40.40", "sub": "wipes out the profit from 4 full-price sales", "to": "loss"}]}},
        ],
    },
    {
        "scene": 5, "part": 5, "mode": "network",
        "tag": "THE WORKING-CAPITAL SQUEEZE",
        "title": "Cash Out First, Paid Last — Fined Either Way",
        "unit": "",
        "footnote": "Sources: Amazon seller policies (delivery-date reserve, inbound placement, low-inventory-level fee); 3.5% surcharge eff. Apr 17, 2026; Marketplace Pulse 2026 Seller Index",
        "layers": [
            [{"name": "Factory (paid up front)", "y": 0.5}],
            [{"name": "Payout reserve (delivery + 7 days)", "y": 0.5}],
            [{"name": "Inbound placement fee · +3.5% surcharge", "y": 0.5}],
            [{"name": "Too much stock: aged-inventory surcharge", "y": 0.3}, {"name": "Under ~28 days: low-inventory fee", "y": 0.7}],
        ],
        "steps": [
            {"label": "1. Factory Cash Goes Out", "val": "2–3 Months Early", "activeLayer": 0,
             "sub": "Sellers pay factories long before a single unit reaches a customer."},
            {"label": "2. The Payout Reserve", "val": "Delivery + 7 Days", "activeLayer": 1,
             "sub": "Funds release 7 days after confirmed delivery — often 2–4 weeks from sale to bank."},
            {"label": "3. Fees Around Inventory", "val": "+3.5% Surcharge", "activeLayer": 2,
             "sub": "Inbound placement fee (since 2024) + 3.5% on every fulfillment fee (April 2026)."},
            {"label": "4. The Corridor", "val": "Too Much OR Too Little", "activeLayer": 3,
             "sub": "Aged-inventory surcharge vs. low-inventory fee. 49% of sellers call fees their #1 margin concern."},
        ],
    },
    {
        "scene": 6, "part": 6, "mode": "compare",
        "tag": "WHO REALLY GETS YOUR $100",
        "title": "The Tollbooth, Then and Now",
        "unit": "",
        "footnote": "Sources: Stripe standard pricing; Amazon 2020 shareholder letter; Marketplace Pulse; FTC v. Amazon (W.D. Wash.)",
        "steps": [
            {"label": "1. The Alternative Isn't Free", "unit": "$", "leftVal": 52, "rightVal": 3.2,
             "leftText": "Amazon: fees + ads ≈ $52", "rightText": "Own store: card fee ≈ $3.20 + paid traffic (?)", "leftTo": "amazon", "rightTo": "seller",
             "sub": "2.9% + 30¢ to process the card — but the customers still have to be bought on Google, Meta or TikTok."},
            {"label": "2. What Changed Is the Price", "unit": "%", "leftVal": 35.2, "rightVal": 51.8,
             "leftText": "2016: 35.2%", "rightText": "2022: 51.8%", "leftTo": "supplier", "rightTo": "amazon",
             "sub": "Amazon's average cut of seller sales (Marketplace Pulse).",
             "evidence": {"doc": FTC_CASE, "line": "Bench trial scheduled for 2027"}},
            {"label": "3. Back to the $100", "unit": "$", "leftVal": 10, "rightVal": 52,
             "leftText": "Seller keeps: $10", "rightText": "Amazon collects: $52", "leftTo": "seller", "rightTo": "amazon",
             "sub": "The fortune belongs to whoever controls the last three seconds before checkout."},
        ],
    },
]


def script_steps():
    """part number -> list of narration strings, one per **[Step n]** block."""
    parts, cur = {}, None
    for line in SRC.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^# PART (\d+)", line)
        if m:
            cur = parts.setdefault(int(m.group(1)), [])
        elif cur is not None and line.startswith("**[Step"):
            cur.append([])
        elif cur is not None and line.startswith("> "):
            cur[-1].append(line[2:].strip())
    return {k: [" ".join(s) for s in v] for k, v in parts.items()}


def check(scene):
    if scene["mode"] == "waterfall":
        steps = scene["steps"]
        total = round(sum(s["val"] for s in steps if s["type"] != "final"), 2)
        final = steps[-1]["val"]
        assert abs(total - final) < 0.005, f"scene {scene['scene']}: steps sum {total} != final {final}"
        co = steps[-1].get("callout")
        if co and "val" in co:
            amazon = -sum(s["val"] for s in steps if s.get("to") == "amazon")
            assert amazon == co["val"] == sum(co["parts"]), f"scene {scene['scene']}: Amazon take mismatch"
    if scene["mode"] == "network":
        n = len(scene["layers"])
        assert all(0 <= s["activeLayer"] < n for s in scene["steps"])


def main():
    narr = script_steps()
    OUT.mkdir(exist_ok=True)
    bundle = []
    for sc in SCENES:
        check(sc)
        texts = narr[sc["part"]]
        assert len(texts) == len(sc["steps"]), f"scene {sc['scene']}: {len(sc['steps'])} steps vs {len(texts)} in script"
        for i, (st, tx) in enumerate(zip(sc["steps"], texts), 1):
            st["step"] = i
            st["cue"] = " ".join(tx.split()[:7])
            st["narration"] = tx
        (OUT / f"scene{sc['scene']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        bundle.append(sc)
        print(f"scene{sc['scene']}.json  {sc['mode']:<9} {len(sc['steps'])} steps  ok")
    (OUT / "all_scenes.json").write_text(json.dumps({"title": "Amazon's $69 Billion Hidden Tax: The $100 Unit Economics Breakdown", "scenes": bundle}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("all_scenes.json written")


if __name__ == "__main__":
    main()
