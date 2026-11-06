# Sources

All facts come from `docs/blueprint-tower-six.md` §1; all prices from §8. All pricing is third-party —
SHAPE's own site (https://homes.theamazingbrentwood.com) publishes no prices. Accessed 2026-11-03.

> Prices from published third-party presale databases — see Sources. Subject to change without notice.
> This is not an offering for sale; verify current pricing with the developer's authorized sales representatives.

## Pricing source reference table (blueprint §8)

| Figure | Source | Date on source | URL |
|---|---|---|---|
| From $649,000 ("LNY Price") | mikestewart.ca | Updated Oct 7, 2026 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| From $665,000 | presalehomes.ca | As of November 2026 (first recorded Oct 26, 2026) | https://presalehomes.ca/presales/the-amazing-brentwood---tower-six |
| From $689,000 — conflicts with the same page's $649,000 | mikestewart.ca (page pricing footer) | Undated section; page updated Oct 7, 2026 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Range $680,000–$1,430,000 | livabl.com | Page last updated ~Jul 2026 | https://livabl.com/burnaby-bc/the-amazing-brentwood-tower-six |
| Studio $649,000 · 1 Bed $758,000 · 2 Bed $759,000–$1,161,000 · 3 Bed $1,335,000 | mikestewart.ca price grid; identical grid on vancouvernewcondos.com | Feb 2026 (vancouvernewcondos.com updated Feb 5, 2026) | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Studio $650,000 (465 SF) · 1 Bed $713,000 (457 SF) · 2Bd/2Ba $994,000 (890 SF) · Jr 2Bd from $760,000 (636 SF) · 3 Bed $1,305,000 (1,067 SF) · Penthouse $2,379,000 (1,417 SF) | mikestewart.ca price grid, stated as extracted from developer communications | Oct 2025 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Incentive prices: 1 Bed $713,000 / $750,000 · Jr 2Bd $762,000–$854,500 · 2Bd $994,000 / $1,038,000 · 3 Bed $1,305,000 · Penthouse $2,379,000 (a "2 Bed + Den $1,068,000" line is Tower 5 — excluded) | mikestewart.ca | Nov 2025 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Unit #1809, 2Bd/2Ba, 737 SF: $828,000 (was $843,000) | mikestewart.ca price grid | Dec 2025 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Incentive: $50,000 off all homes (limited-time) | mikestewart.ca | Sep 2026 program; page updated Oct 7, 2026 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Deposit: 8% total, paid in stages until 2028 | presalehomes.ca, citing Presale Properties (https://presaleproperties.com) | Oct 2026 offer | https://presalehomes.ca/presales/the-amazing-brentwood---tower-six |
| Deposit (earlier promo): 5% total standard homes; 10% total penthouse homes & non-resident buyers | mikestewart.ca | Feb 2026 (Lunar New Year) program | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Unit incentives: $18,000–$38,000 off specific units (#2902, #1505, #502, #2911, #3203, #2402) + free lockers / EV stalls on some | mikestewart.ca; vancouvernewcondos.com | Feb 2026 | https://mikestewart.ca/presale/the-amazing-brentwood-tower-6-burnaby-presale-condos-by-shape-properties/ |
| Assignment fee: 1% | presalehomes.ca, citing Presale Properties | Checked Oct 2026 | https://presalehomes.ca/presales/the-amazing-brentwood---tower-six |
| Strata fee (indicative): $0.63 / SF — weakest source in this table | jeyhoonmohammadi.com (MLS-derived building page) | Accessed Nov 2026 | https://jeyhoonmohammadi.com (exact page URL not recorded in the blueprint) |

## Where each price appears on the site

- Plan finder cards: Feb 2026 grid (Studio, 1 Bed, 2 Bed, 3 Bed) and Oct 2025 grid (Penthouse PH1).
- Pricing section: $665,000 (presalehomes.ca, Nov 2026), $649,000 LNY (mikestewart.ca, Oct 7, 2026), $50,000 incentive (mikestewart.ca, Sep/Oct 2026), 8% deposit (presalehomes.ca citing Presale Properties, Oct 2026).
- Sources section: this table.

## Plan-family count discrepancy

The published per-family counts, if summed, exceed the developer's stated total by 4 (373 vs 369). The site shows each family's count as published; the stated total of 369 condominiums (including the 4 Penthouse Collection homes) governs.

## Other sources

- Facts, renders and the amenity plan: homes.theamazingbrentwood.com (home, /homes, /amenities, /penthouse, /masterplan).
- `assets/17-tower-west-elevation.jpg`: third-party copy via vancouverpresale.vip (per blueprint §4). No longer the explorer base (replaced by asset 18, 2026-11-05); file kept for reference.
- 3D plans: no Tower Six floor-plan diagram was fetched during the build, so both models are representative layouts built from published type, size, ceiling height and features.

- `assets/18-tower-six-hero.jpg` — Tower Six hero rendering (full tower, terraces, podium; "TOWER SIX" vertical label). SHAPE official Tower Six site, homes.theamazingbrentwood.com (tab6_hero@2x, 2084×2040), accessed 2026-11-04. Intended as the Tower Explorer base image (owner choice, 2026-11-04); replaces the low-res west elevation (asset 17) for calibration.

- Amenity floor 3D model (`amenity3d.js`): geometry traced from `assets/05-amenity-floor-birdseye.jpg` (the same developer plan as the Amenity Explorer) into `amenityFloor.js`, in that image's pixels at an estimated 42 px = 1 m. Space names, numbers and photos come from `AMENITIES` in `data.js`. Only Fitness Facility has a published space photo (`assets/06-amenity-gym.jpg`); the other 17 spaces are furnished from their name/function, at the furniture footprints drawn on the plan. Stylized illustration, not architectural drawings.
