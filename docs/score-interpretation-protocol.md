# Score Interpretation and Feedback Protocol

**Status:** MVP safeguard; not a validation claim  
**Applies to:** IPIP-NEO-120 five-factor report and participant-facing feedback  
**Version:** 0.2.0  
**Last updated:** 2026-10-13

## 1. Core principle

A participant's response is not correct or incorrect. The score is a summary of self-reported item responses under a specific scoring key; it is not an objective reading of a hidden self. The report must describe what the score represents, what it does not establish, and invite the participant to check the interpretation against lived experience.

## 2. Theory and evidence boundary

- **Trait framework:** the Five-Factor Model provides broad dimensions for describing individual differences. It is a descriptive framework, not a moral ranking.
- **Instrument:** IPIP-NEO-120 is a public-domain item pool with published research and a Mandarin translation. This web implementation must preserve item mapping and keying, and must not claim that the web app itself is validated.
- **Response process:** self-report reflects a person's self-perception and interpretation of item wording in the current context. Mood, language, reference group, social desirability, and situational role may affect answers.
- **Feedback:** participant-led reflection is a meaning-making step, not additional psychometric evidence. A participant may reject an interpretation; that disagreement should be treated as useful context, not resistance or a symptom.

## 3. Display rules

1. Convert mean responses on the 1–5 scale to a 0–100 response index for readability only. Never call it a percentile, probability, clinical severity, or Singapore population rank.
2. Do not use unvalidated absolute cut-offs to label an individual trait as low, average, or high. A 0–100 index is a rescaled response metric, not a norm-referenced score.
3. Within-profile comparisons are exploratory. If the highest and lowest factor indices differ by fewer than 10 points, the interface should not force a ranking and should state that the factors are close. The 10-point guard is a conservative UI rule, not a validated significance threshold.
4. Even when a spread is 10 points or more, call the results only a relative high/low point **within this profile**. Do not call one a strength or weakness, and do not prescribe change based on rank.
5. Preserve the distinction between Emotional Stability in the five-factor summary and the original Neuroticism direction used by the corresponding facet scores. The direction must be explained in the report.
6. Never merge custom visual-choice, sound-discrimination, or sensory preference activities into IPIP scores. Until separately validated, they may only show task-specific observations or participant-chosen reflections.

## 4. Completion and data integrity

- Do not show a final report until all 120 required items have an answer, unless a future formally reviewed missing-data rule is implemented.
- Score each broad factor using its assigned items and the instrument's correct reverse-keying. Audit mappings against the source scoring key before a public launch.
- Four-item facet values are descriptive and particularly vulnerable to item-specific noise. Avoid overconfident language about any single facet.
- A retrieved report may contain only the five broad-factor scores; the interface must not imply that it can reconstruct the 30 facets or original item answers.
- Do not infer deception, unconscious motives, mental illness, intelligence, or future behaviour from response patterns.

## 5. Reflection closure

For each useful observation, guide the participant through:
1. **Notice:** What response pattern or self-description did the report present?
2. **Check:** Does it fit a concrete recent example? In what context might it not fit?
3. **Choose:** What, if anything, would the participant like to test in the next seven days?
4. **Review:** What actually happened, and what alternative explanation should be considered?

Reflection notes are private, optional, stored only in the current browser unless the participant explicitly exports them, and are not uploaded with scores. A future review feature must not turn a single action outcome into a trait re-score.

## 6. Required limitations

Always state that the web app has not independently established reliability, validity, or Singapore bilingual norms. Do not use results for diagnosis, hiring, admissions, school placement, or other high-stakes decisions. Any public release beyond low-risk self-reflection should include expert review, item-key audit, accessibility and language review, privacy/security assessment, and a validation plan.

## 7. Scientific references

- International Personality Item Pool (IPIP), Mandarin translation of IPIP-NEO-120: https://ipip.ori.org/Mandarin%20translation%20of%20IPIP-NEO-120.htm
- Chinese IPIP-120 reliability information: https://ipip.ori.org/ChineseIPIP-120reliability.htm
- Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory: Development of the IPIP-NEO-120. *Journal of Research in Personality*. https://doi.org/10.1016/j.jrp.2014.05.003
