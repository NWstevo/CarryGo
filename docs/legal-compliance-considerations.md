# Legal & Regulatory Risk Map — CarryGo (C2C Crowdshipping)

## What this document is — and isn't

This is a **risk map for engineering and product decisions**, not legal advice, and not a
compliance certification. It's organized by legal domain so you can see what's structurally
true about this business model everywhere, and what varies enough by country that you need
a local lawyer before launching there. Treat every "in the US" / "in the EU" note below as a
starting pointer for counsel to verify, not a settled conclusion.

Crowdshipping / peer-to-peer luggage-space platforms are a real, litigated category
(comparable services: Grabr, Eurosender's P2P arm, PiggyBaggy, Cargo, Airmule — several of
which have faced exactly the issues below). This isn't hypothetical risk.

---

## 0. The structural risk, before any of the checklist items

Every other section here is a policy or feature you can build. This one isn't — it's inherent
to the concept, and worth understanding before anything else:

**Having a stranger carry a paid sender's item across a border, declared as their own personal
luggage, is the same fact pattern customs and criminal law use to define smuggling and
customs fraud** — even when nobody involved intends wrongdoing. Regulators don't evaluate
intent from your Terms of Service; they evaluate what actually crossed the border and how it
was declared. Three things make this worse, not better, than informal "ask a friend to bring
something back" arrangements:
- **It's commercial.** Payment changes the legal character of the transport in most
  jurisdictions — many personal-allowance customs exemptions only apply to genuinely personal,
  non-commercial goods.
- **It's matched by a platform, at scale, between strangers.** That's the fact pattern
  regulators use to distinguish "helping a friend" from "operating an unlicensed courier /
  freight forwarding service" — which triggers its own licensing regimes in many countries.
- **The traveler frequently won't know exactly what they're carrying** beyond what's shown in
  a chat photo/video — which is a liability problem for *them personally*, not just the
  platform, since they're the one who signs the customs declaration and physically crosses
  the border.

No amount of in-app policy language fully neutralizes this — it constrains where you can
safely operate (e.g., routes with high de minimis thresholds and low friction, vs. routes
between countries with strict import controls, sanctions exposure, or aggressive customs
enforcement) and how the product should behave (mandatory value/content declarations,
prohibited-category enforcement, audit trails), covered below. **This is the one item worth
raising with a customs/trade lawyer before anything else**, ideally before choosing your first
launch routes.

---

## 1. Customs, import/export & anti-smuggling law

- Every country sets its own personal-allowance thresholds, prohibited/restricted goods lists,
  and declaration requirements — there is no global standard.
- Items totally legal in the origin country (certain medications, supplements, electronics,
  cultural artifacts, currency above a threshold) can be restricted or banned on import.
- **Product implications:** a mandatory, itemized declaration per deal (what, value, quantity)
  separate from the free-text chat; a prohibited-items list enforced at multiple points (not
  just a ToS clause); route-level configurability so you can disable corridors your counsel
  flags as high-risk; records retained long enough to respond to a customs inquiry.

## 2. Aviation security & carrier rules

- IATA/ICAO-derived rules (and each country's civil aviation authority — TSA in the US, EASA
  in the EU, CAA in the UK, etc.) govern what a passenger may carry, and airlines' own
  contracts of carriage often separately prohibit carrying items for compensation on behalf of
  third parties, or carrying items whose contents the passenger cannot fully attest to.
- A traveler carrying a sender's item is legally still the one accountable to security
  screening and to their airline — the platform is invisible to both.
- **Product implications:** the "verify by photo and video" feature is good practice here, but
  frame it as user protection ("know what you're carrying before you carry it"), not as a
  compliance guarantee — screening staff and the airline's own contract are still what govern.

## 3. Prohibited, restricted & dangerous goods liability

- Overlaps with #1/#2 but is worth separating because it also creates **civil product-liability
  and criminal exposure** distinct from customs paperwork — e.g., carrying batteries,
  aerosols, or counterfeit goods can violate transport-of-dangerous-goods law and IP law
  regardless of customs declarations.
- **Product implications:** a maintained, jurisdiction-aware prohibited/restricted items
  policy (not a static list — batteries and some medications are legal on some routes and
  banned on others); a reporting/flagging path for suspicious listings.

## 4. Payments, money transmission & escrow

- Moving money between senders and travelers — especially anything resembling escrow ("hold
  funds until delivery is confirmed," which your `deals` state machine already implies) — can
  require a money transmitter license (US, state-by-state), an e-money/payment institution
  authorization (EU/UK, PSD2/PSD3), or equivalent in most other markets.
- Using a licensed payment processor as intermediary (Stripe Connect, Adyen for Platforms,
  etc.) is the standard way smaller platforms avoid needing their own license — but the
  processor's own onboarding/compliance terms then become a hard constraint on your product
  (e.g., they may refuse to support cross-border marketplace payouts on certain corridors).
- **Product implications:** no payment flow currently exists in the backend — when it's built,
  the choice of payment processor is a compliance decision, not just an integration decision,
  and should be made with counsel before implementation starts.

## 5. Anti-money laundering (AML) / know-your-customer (KYC)

- Once real payments exist, AML obligations typically follow — transaction monitoring,
  suspicious-activity reporting, and identity verification thresholds, usually enforced
  *through* your payment processor's KYC requirements rather than requiring you to build your
  own AML program from scratch, but you're still responsible for what your product allows on
  top of that (e.g., structuring payments to dodge review thresholds).

## 6. Data protection & privacy

- This applies today, independent of payments — you already collect identity data, and the
  photo/video item-verification feature specifically raises the stakes.
- **GDPR (EU/EEA) / UK GDPR:** applies if you have any EU/UK users, regardless of where the
  company is based. Requires a lawful basis for processing, a real privacy policy, data
  subject rights (access/deletion/portability), breach notification, and — relevant here —
  extra scrutiny if verification photos/videos are processed in a way that could reveal
  biometric data (e.g., if you ever add face-matching for identity verification, that's a
  "special category" data under Art. 9 with a much higher bar).
- **US:** no single federal law; state laws (CCPA/CPRA in California and similar laws in a
  growing list of states) apply based on user location and volume thresholds. Illinois'
  **BIPA** specifically targets biometric identifiers (fingerprints, faceprints) with private
  right of action and steep statutory damages — directly relevant if identity verification
  ever does face matching against ID photos.
- **Elsewhere:** Brazil (LGPD), China (PIPL), Canada (PIPEDA), India (DPDP Act), and most other
  major markets now have their own comprehensive privacy laws with broadly similar shapes but
  different specifics (consent models, cross-border transfer restrictions, breach timelines).
- **Product implications:** a real privacy policy (currently absent from the repo); a defined
  retention period for verification photos/videos (indefinite retention of ID/biometric-
  adjacent media is itself a risk, not a safety feature); clarity on where uploaded files are
  stored and whether that crosses a regulated border (e.g., EU personal data stored outside
  the EEA needs a transfer mechanism).

## 7. Platform / intermediary liability

- **EU Digital Services Act (DSA):** imposes notice-and-action obligations, transparency
  reporting, and trader-traceability requirements on platforms facilitating transactions
  between users, scaled by platform size — relevant once EU users are in scope.
- **UK Online Safety Act:** separate regime, relevant if UK users are in scope, focused more on
  illegal-content duties.
- **US:** Section 230 gives broad (not unlimited) protection for user-generated content, but
  doesn't shield the platform from liability for its *own* conduct — e.g., how disputes are
  handled, or claims the platform itself makes about verification/safety.
- **Product implications:** the reporting/dispute system flagged in your own production
  checklist doesn't exist yet — it's not just a UX gap, it's a compliance gap once you're
  operating in the EU/UK.

## 8. Consumer protection & marketplace rules

- Distance-selling and consumer-rights rules (EU Consumer Rights Directive and equivalents)
  can apply to marketplace transactions between individuals depending on how "commercial" a
  given sender/traveler's activity is — a traveler who does this repeatedly for profit can tip
  into being treated as a trader, not a peer, under EU consumer law, with different disclosure
  obligations.
- **Product implications:** clear, accessible terms shown before a deal is finalized (not just
  a ToS acceptance at signup); clarity in-product about what "delivered" and "confirmed" mean
  and what recourse exists if they're disputed.

## 9. Contracts: Terms of Service & dispute resolution

- None of the trust mechanics you've built (accept/decline, chat, deal state machine, ratings)
  are legally binding on their own — they need to sit on top of enforceable Terms of Service
  that define the platform's role (intermediary, not carrier/shipper), liability limits,
  dispute resolution process, and governing law/jurisdiction.
- Liability caps and arbitration clauses are enforceable in some jurisdictions and heavily
  restricted or void in others (e.g., mandatory consumer arbitration is far more constrained
  in the EU than the US) — a single global ToS won't work as-is everywhere you operate.

## 10. Insurance & loss/damage/theft liability

- Someone has to bear the loss when an item is lost, damaged, stolen, or seized by customs —
  right now that's undefined in the product. Options range from "platform disclaims all
  liability, parties self-insure" (weakest for trust, simplest legally) to a real
  shipping-insurance partnership (stronger trust, but itself a regulated insurance
  product/broker relationship in most countries).
- **Product implications:** whatever the model, it needs to be explicit in the ToS and
  reflected in the deal flow (e.g., a declared value field feeding into any insurance/claims
  process) — currently `deals` has no value/insurance field at all.

## 11. Tax

- **Traveler earnings:** in most countries, payment for carrying an item is taxable income for
  the traveler, and above certain thresholds platforms have their own reporting obligations
  (e.g., US 1099-K, EU **DAC7** — which specifically targets digital platforms facilitating
  peer transactions and requires reporting seller/earner data to tax authorities).
- **Import duty/VAT:** separate from personal customs allowances — high-value items may trigger
  import VAT/duty regardless of how they're carried, and getting this wrong is a customs
  problem (see §1), not just a tax one.

## 12. Sanctions & export controls

- OFAC (US), EU/UK sanctions regimes, and equivalents elsewhere prohibit transactions with
  sanctioned individuals, entities, or (for some goods) destination countries, independent of
  customs law. Export-controlled goods (certain electronics, encryption-capable devices,
  dual-use items) can be illegal to move across specific borders regardless of value or
  personal-use framing.
- **Product implications:** sanctions-list screening is typically handled by your payment
  processor/KYC vendor as part of onboarding, but a route/country-availability toggle (see §1)
  is the product-level control for restricting corridors involving sanctioned destinations.

## 13. Advertising & marketing language

- Small but real: marketing language implying travelers can help senders "avoid customs
  fees," "skip declarations," or similar has been used as direct evidence of smuggling intent
  in prior enforcement actions against comparable platforms. This is a copywriting constraint,
  not just a legal footnote — it should be treated as a hard rule for anything user-facing
  (marketing site, app copy, even support scripts).

## 14. Worker classification (lower priority, but worth flagging)

- Because travelers aren't controlled by the platform (their own trip, own schedule), they're
  very unlikely to be classified as employees anywhere — but the EU's **Platform Work
  Directive** and similar emerging rules specifically target platforms that algorithmically
  match and price gig work, so if pricing/matching ever becomes platform-driven rather than
  peer-negotiated (as it is today via chat), revisit this.

---

## Practical starting point

Given all of the above, a reasonable sequencing:

1. **Before choosing launch routes:** get a customs/trade lawyer's view on §0/§1 — this
   determines which country pairs are viable at all, not just how to build the product.
2. **Before adding payments:** get a payments lawyer's view on §4/§5 — this determines whether
   you can use an off-the-shelf platform-payments provider or need your own licensing.
3. **Before any EU/UK users:** a real privacy policy and DSA-aware reporting flow (§6/§7) —
   this is achievable without a large legal spend and is close to table stakes now.
4. **Ongoing:** treat the prohibited-items list, route availability, and declared-value/
   insurance fields as living product surfaces that encode legal constraints — not one-time
   ToS boilerplate.

This document should be revisited every time you add a new country, a new payment method, or
change how verification data is collected/stored/retained — each of those changes what applies.
