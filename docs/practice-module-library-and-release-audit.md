# Practice Module Library & Release Audit

**Version:** 0.1.0  
**Date:** 2026-10-13  
**Status:** First operational prototype; not clinically validated.

## Product flow

Home → choose a current goal → choose a guided practice → work through prompts → review personal notes → optionally download a TXT copy → choose another practice or leave.

The practice route is deliberately separate from IPIP-NEO-120. Practice answers and optional emotional-intensity ratings never contribute to personality factor/facet scores, cloud result saving, or retrieval codes.

## Implemented modules

### P01 — CBT-informed thought record
- **Purpose:** Help a participant distinguish an observable situation from an automatic thought, name an emotion, consider evidence and alternative explanations, and choose a feasible next step.
- **Theory/evidence:** Structured thought records are a common CBT exercise. NHS Every Mind Matters describes a seven-prompt thought-record structure. NICE NG222 includes structured CBT-based guided self-help among options for some people with less severe depression.
- **Evidence tier:** B — established intervention approach; this specific app module is an unvalidated self-guided adaptation.
- **What is observed:** Text the participant voluntarily enters; optional subjective 0–10 emotional-intensity ratings before/after.
- **What is not measured:** Diagnosis, objective emotional state, cognitive distortion as a clinical finding, treatment response, deception, trauma, or unconscious motives.
- **Scoring:** No score. Optional intensity numbers are descriptive self-check-ins only; no change score is labelled improvement or treatment effect.
- **Safeguards:** No forced positive reframing; participant may leave a field blank. If reflection escalates distress, stop and seek trusted/professional support.

### P02 — Small-action planning (behavioural-activation-inspired)
- **Purpose:** Convert a personally meaningful task into a manageable, concrete action, identify barriers, and choose a realistic time/cue.
- **Theory/evidence:** Behavioural activation focuses on the relationship between activity, avoidance, and mood; NICE discusses structured behavioural activation in relevant care pathways. The app only borrows low-risk planning principles and is not a full BA protocol.
- **Evidence tier:** B for the broader intervention family; this standalone micro-planner is not validated as treatment.
- **What is observed:** Participant-chosen action, personal reason, anticipated barrier, and plan.
- **What is not measured:** Motivation, executive function, depression severity, adherence, or predicted clinical outcome.
- **Scoring:** None. Completing a plan is not a success/failure score.
- **Safeguards:** Encourage realistic scaling and adjustment, not blame. Do not imply a small action is sufficient treatment for depression.

### P03 — Values clarification
- **Purpose:** Help a participant recall a concrete moment, name what mattered, and choose one feasible action aligned with that value.
- **Theory/evidence:** Values clarification is used in several psychological approaches, including acceptance- and values-oriented work. This short prompt set is a reflective exercise, not a validated values inventory or a measure of moral worth.
- **Evidence tier:** C/D — reflective exercise informed by established concepts; not a psychometric assessment.
- **Scoring:** None. Do not infer stable traits or unconscious motives from the selected value.

### P04 — Communication rehearsal
- **Purpose:** Structure a description of the situation, personal impact/need, a concrete request, and a boundary focused on the participant's own choices.
- **Theory/evidence:** A structured communication scaffold informed by skills-based psychoeducation; this exact prompt sequence is not a validated intervention.
- **Evidence tier:** C/D — educational reflection tool.
- **Scoring:** None. Do not label either person as disordered or infer intent from the participant's account.
- **Safety exception:** If direct communication could trigger retaliation, coercion, or abuse, do not encourage confrontation; prioritise safety and trusted specialist support.

## Evidence and interpretation rules

1. The source supports a method family, not this app's efficacy. Do not say the app provides therapy or treats a condition.
2. The user is the authority on whether a reflection fits their experience. Prompts are not conclusions.
3. No hidden composite score, ranking, pass/fail, streak, or performance judgement.
4. No inference from typing speed, pauses, edits, skipped fields, audio responses, or interaction timing.
5. An optional before/after 0–10 rating is a single subjective observation; it cannot establish causality or treatment effect.
6. Visual-choice and sound tasks remain exploratory and separate from all IPIP scoring.

## Privacy and safety implementation audit

- Practice text is held in React page state only. It is not written to localStorage, sent to Google Apps Script, or attached to assessment score payloads.
- Refreshing/leaving can erase the current practice; this is disclosed in the UI.
- A TXT export occurs only after an explicit user click. The downloaded file may contain sensitive text; users should store it carefully.
- The interface tells users not to include identifying details.
- No crisis monitoring, alerting, or emergency response is implemented. The safety note is not a substitute for a country-specific reviewed crisis pathway.
- Current public Apps Script result saving remains for assessment dimension scores only after consent. Because the public Apps Script endpoint is not a private API and uses `no-cors`, a completed browser request cannot prove a row was written. Do not use it for sensitive clinical data.
- Before production: perform privacy/security review, review data retention and deletion, review third-party requests, and add a professionally reviewed Singapore-specific crisis/help resource page.

## Personality scoring audit — must pass before public claims

### Current design observed in code
- 120 items are assigned to five factors by item ID modulo five.
- Broad-factor response index: reverse-key item responses as defined in the current factor mapping, average each factor's assigned items, then map a 1–5 mean to 0–100 via `((mean - 1) / 4) * 100`.
- The Emotional Stability broad factor reverses the original Neuroticism direction; the six Neuroticism facets retain the original Neuroticism direction. The report must continue to explain this distinction.
- Facets are calculated from four items each, using the six facet positions within each trait.
- The interface's 0–100 values are response-scale indices only, not percentiles, population norms, diagnosis, or clinical severity.
- Visual/audio/sensory practice data must never alter these scores.

### Release-blocking verification checklist
- [ ] Independently compare every item-to-factor assignment with the published IPIP-NEO-120 source key.
- [ ] Independently compare all 30 facet item sets and reverse-key rules with a source scoring key; do not treat code comments as evidence.
- [ ] Unit-test all 120 IDs: each item belongs to exactly one broad factor and exactly one facet; every facet has exactly four items; no overlaps or omissions.
- [ ] Unit-test reverse-keyed responses (1 ↔ 5, 2 ↔ 4, 3 ↔ 3), especially the Emotional Stability vs Neuroticism direction.
- [ ] Verify that no final report can be produced with unanswered items.
- [ ] Verify retrieved score reports do not pretend to reconstruct 30 facets or original answers.
- [ ] Test bilingual wording, keyboard/screen-reader navigation, mobile layouts, and reduced-motion/accessibility behaviour.
- [ ] Run typecheck, lint, smoke tests, static export, and verify the deployed GitHub Pages routes before claiming release readiness.

## References

- NHS Every Mind Matters, “Thought record”: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/thought-record/
- NICE NG222, “Depression in adults: treatment and management — Recommendations”: https://www.nice.org.uk/guidance/NG222/chapter/recommendations
- IPIP Mandarin translation of IPIP-NEO-120: https://ipip.ori.org/Mandarin%20translation%20of%20IPIP-NEO-120.htm
- Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory: Development of the IPIP-NEO-120. *Journal of Research in Personality*. https://doi.org/10.1016/j.jrp.2014.05.003
