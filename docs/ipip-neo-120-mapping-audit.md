# IPIP-NEO-120 Mapping Audit

**Audit date:** 2026-10-13  
**Status:** Structural mapping corrected; CI verification pending. Authoritative item-key comparison and independent psychometric validation remain required.

## Item order and mapping

The 120 items are presented in a 5-item rotation across the five broad factors. Broad-factor assignment by item ID is:

- Emotional Stability display: IDs where `(id - 1) % 5 === 0` (24 items)
- Extraversion: `(id - 1) % 5 === 1` (24 items)
- Openness: `(id - 1) % 5 === 2` (24 items)
- Agreeableness: `(id - 1) % 5 === 3` (24 items)
- Conscientiousness: `(id - 1) % 5 === 4` (24 items)

The 30 facets are ordered as six facets for each trait. Each facet's four items occur once in each 30-item block. With trait offset (o) (1–5) and within-trait facet index (f) (0–5), the four item IDs are:

`o + 5f`, `o + 5f + 30`, `o + 5f + 60`, `o + 5f + 90`.

This matters because grouping every four items within a trait would incorrectly mix different facets. The app's facet calculation was corrected to use the four 30-item rotations.

## Keying and display

- Reverse-keyed item response: `6 - response`.
- Each facet has four keyed responses; its mean is rescaled to 0–100 for display.
- Broad factor: 24 keyed responses; its mean is rescaled to 0–100 for display.
- Emotional Stability is the reverse direction of the original Neuroticism dimension. The six emotion-related facets retain original Neuroticism direction and must be described that way.
- The 0–100 scale is a rescaled response index, not a normed score, percentile, diagnosis, clinical severity measure, or Singapore population rank.

## Automated structural checks

`npm run audit` checks:
- 120 inventory items exist.
- Reverse-key IDs are unique and within range.
- There are 30 facets, each with four distinct items.
- Facet assignments do not overlap and cover all 120 item IDs.
- Broad factors each receive 24 items.
- The code includes the Emotional Stability direction inversion.

These checks verify internal structure only. They do **not** establish that each item is assigned to the correct published facet, that every reverse-key ID matches the authoritative source, or that the site is psychometrically validated.

## Authoritative reference

- Johnson, J. A. (2014), Table 1 and supplementary materials for IPIP-NEO-120: https://doi.org/10.1016/j.jrp.2014.05.003
- IPIP page listing items within the 30 four-item facet scales: https://ipip.ori.org/30FacetNEO-PI-RItems.htm
- IPIP-NEO-120 Mandarin translation: https://ipip.ori.org/Mandarin%20translation%20of%20IPIP-NEO-120.htm

## Remaining release gates

- [ ] Compare every English item and reverse-key direction against the authoritative source key.
- [ ] Have a second reviewer independently verify all 30 facet mappings and all reverse-keyed items.
- [ ] Run automated tests and inspect the actual deployed report for a synthetic answer pattern with known expected results.
- [ ] Conduct language, accessibility, privacy/security, and expert review.
