# IPIP-NEO-120 Mapping Audit

**Audit date:** 2026-10-13  
**Status:** Source item order and Mandarin/English wording manually compared with the official IPIP Mandarin page; the 55 reverse-keyed item IDs and 30 facet item groups are encoded as regression-test snapshots. CI execution is required for each release. This is a scoring-implementation audit, not independent psychometric validation.

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

## Automated and known-pattern checks

`npm run audit` checks:
- 120 inventory items exist.
- Reverse-key IDs exactly match the 55-item key snapshot transcribed from the official 30-facet key; IDs are unique and in range.
- There are 30 facets, each with four distinct items.
- All 30 facets match explicit four-item ID snapshots from the published facet order; assignments do not overlap and cover all 120 item IDs.
- Broad factors each receive 24 items.
- The code uses the same tested scoring module for broad factors and facets; Emotional Stability direction inversion is explicit.
- Synthetic all-3 responses produce 50 for every factor and facet.
- Synthetic responses that key every original trait item high produce 100 for every original facet and all non-emotional-stability factors, while Emotional Stability correctly returns 0; the inverse pattern returns the opposite endpoints.

These tests verify the local implementation against the reviewed source snapshots and known answer patterns. They do **not** establish clinical utility, population norms, measurement invariance, or psychometric validation of Persona.

## Authoritative reference

- Johnson, J. A. (2014), Table 1 and supplementary materials for IPIP-NEO-120: https://doi.org/10.1016/j.jrp.2014.05.003
- IPIP page listing items within the 30 four-item facet scales: https://ipip.ori.org/30FacetNEO-PI-RItems.htm
- IPIP-NEO-120 Mandarin translation: https://ipip.ori.org/Mandarin%20translation%20of%20IPIP-NEO-120.htm

## Remaining release gates

- [x] Manually compare the 120 English/Mandarin item pairs and order against the official Mandarin IPIP-NEO-120 page.\n- [x] Compare the 55 reverse-keyed items and the 30 four-item facet sets against the official facet key.\n- [x] Add automated known-pattern tests for the shared scoring module.
- [ ] Have a second reviewer independently verify all 30 facet mappings and all reverse-keyed items.
- [x] Add automated synthetic answer-pattern tests to CI.\n- [ ] Inspect the actual deployed report in a browser using a synthetic answer pattern.
- [ ] Conduct language, accessibility, privacy/security, and expert review.
