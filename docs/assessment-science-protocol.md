# Persona Assessment Science & Product Protocol

**Status:** Design protocol for an exploratory MVP; not a validated psychological instrument.  
**Version:** 0.1.0  
**Last updated:** 2026-10-13

## 1. Product definition

Persona is an opt-in, bilingual, multimethod self-exploration experience. It uses short interactive activities (visual, auditory, decision scenarios, and optional self-reflection) to make the experience engaging and to collect different kinds of evidence. It is not a clinical diagnostic tool and must not be used for hiring, school placement, or other consequential decisions.

The experience may avoid revealing the *specific hypothesis of an individual activity* until the end to reduce demand characteristics. It must not conceal that the experience may observe choices or task performance, what categories of data are collected, whether recording is used, or how data are stored. Each activity receives a plain-language debrief after completion.

## 2. Scientific principles

1. **Define the construct before building a task.** Each activity must state what it is intended to measure, what observable data are collected, and what interpretations are prohibited.
2. **Separate data types.** Self-reported preferences, behavioral choices, and performance on a perceptual/cognitive task are not interchangeable and must not be collapsed into a single personality score.
3. **Multimethod is not automatically valid.** Different methods can provide complementary evidence, but their relationship must be tested. Agreement is not proof; disagreement is not automatically a contradiction.
4. **Do not infer personality from symbolic preferences without evidence.** Colour choices, taste preferences, ambiguous-picture associations, music preference, and body sensations are exploratory descriptions only unless a specific inference is supported by appropriate validation studies.
5. **Treat accuracy, timing, and missingness carefully.** Device latency, hearing/vision differences, language, age, fatigue, accessibility settings, familiarity, and environment can affect performance. Do not treat one short task as a stable ability estimate.
6. **Avoid deception about the nature of the product.** It is acceptable not to reveal a task's exact construct beforehand; it is not acceptable to mislead users about data collection. Explain the general purpose before the experience and debrief the task afterward.
7. **No unsupported confidence claims.** Do not display norms, percentiles, diagnoses, “lie detection”, subconscious truths, or validated-status badges without evidence specific to the intended population, language, and use.
8. **Privacy by default.** The current static GitHub Pages version uses no database. Browser storage is optional and local to the device. No microphone recording is used in the sound activity. Never send raw responses or sensitive notes to the optional demo cloud endpoint.

## 3. Activity registry

Every activity must be recorded in this registry before being used in reports.

| Activity | Observable data | Defensible interpretation | Prohibited inference | Evidence status |
|---|---|---|---|---|
| Existing 15-item personality self-report | User ratings | Illustrative self-description only | Validated Big Five score, diagnosis, percentile | Original demo items; unvalidated |
| Colour selection | Selected colour | Stated preference in this context | Personality, emotional state, intelligence | Exploratory only |
| Scene first-noticed choice | Selected element and optional explanation | Self-reported attention/association | Projective personality interpretation | Exploratory only |
| Taste preference | Stated preference; no tasting required | Preference report | Personality or health inference | Exploratory only |
| Body-sensation check-in | Self-selected current/recent sensation | Self-observation | Diagnosis or trait inference | Exploratory only |
| Visual difference task | Correct/incorrect responses | Performance on this specific visual task | IQ, diagnosis, stable attention trait | Prototype; task-specific only |
| Tone-pair discrimination (MVP addition) | Same/different judgments over six tone pairs | Accuracy on a brief browser-based auditory discrimination activity | Personality, hearing diagnosis, intelligence, emotional traits | Prototype; unnormed and device-dependent |

## 4. Sound activity specification

- **Experience name shown before completion:** “Sound exploration” / “声音探索”.
- **Task:** Listen to six pairs of simple tones and judge whether the two tones sound the same or different.
- **Task design:** Three same and three different trials, order shuffled per session; the different pair uses a clearly separated frequency to support basic interaction testing. This is an introductory task, not a clinical or calibrated psychophysical threshold procedure.
- **Measures:** Number correct out of six. Do not use reaction time in the first release because browser scheduling, device audio output, and user hardware introduce uncontrolled latency.
- **Audio handling:** Generate tones in the browser with Web Audio API after a user gesture. No microphone access, voice capture, or audio upload. Offer an explicit replay action and a non-audio exit.
- **Debrief:** Explain that it was an auditory same/different discrimination task; the result describes performance on this small task only. It does not measure personality or diagnose hearing conditions.
- **Safety/accessibility:** Keep tone volume modest, provide stop/reset, do not require headphones, and let users skip. Users with hearing differences or noisy environments should be able to skip without penalty.
- **Future validation needed:** Pilot usability, test-retest reliability, item difficulty, headphone/speaker effects, browser/device effects, accessibility, age/language differences, and comparison against an appropriately designed auditory discrimination protocol before making stronger claims.

## 5. Future measurement roadmap

### Phase 1 — Reliable interaction foundations
- Keep all existing demo features but label the self-report and preference modules accurately.
- Add the auditory same/different activity as a separate, optional task.
- Keep each activity's raw result in a separate data namespace; no composite personality score.
- Add a post-activity debrief and an accessible skip route.
- Verify Chinese/English parity and static export.

### Phase 2 — Evidence-backed instruments
- Review candidate personality instruments such as Big Five measures with a qualified psychometrician.
- Verify permission/licensing, scoring documentation, target-population evidence, and suitable Simplified Chinese/English versions before implementation.
- Do not assume an English instrument's validity transfers to its translation.
- Use published cognitive/perceptual task paradigms only within their supported interpretation limits and licensing conditions.

### Phase 3 — Pilot and validation
- Have a qualified psychologist/psychometrician review the construct map, tasks, debriefs, accessibility, fairness, and risk of misleading interpretation.
- Conduct cognitive interviews/usability testing, then a preregistered pilot where appropriate.
- Estimate reliability and examine validity evidence for each intended interpretation; check subgroup performance and measurement invariance where justified.
- Evaluate incremental value before combining methods. Publish methods, sample limitations, and version changes.

### Phase 4 — Responsible reporting
- Reports show evidence source, task completion, limitations, and uncertainty.
- Present convergences and divergences as questions to explore, not proof of hidden traits.
- Use plain-language, non-diagnostic language.
- Provide export, clear-data controls, and transparent retention choices before adding any remote storage.

## 6. Release gates

A feature is not “psychologically validated” merely because it has a plausible theory or runs correctly. A release can be called **build-verified** after automated checks pass; **deployed** after the hosting workflow succeeds and the live page is checked; and **psychometrically validated** only after appropriate empirical evidence supports the intended interpretation and use.

## 7. Evidence and references

- American Psychological Association. (2020). *APA Guidelines for Psychological Assessment and Evaluation.* Emphasizes validity evidence for the intended score interpretation/use, the limits of individual evidence sources, fairness, and integration of evidence. https://www.apa.org/about/policy/guidelines-psychological-assessment-evaluation.pdf
- Meyer, G. J., Finn, S. E., Eyde, L. D., et al. (2001). *Psychological testing and psychological assessment: A review of evidence and issues.* American Psychologist, 56(2), 128–165. DOI: https://doi.org/10.1037/0003-066X.56.2.128. Reviews the value of multimethod assessment while supporting evidence-based interpretation rather than assuming every method adds validity.
- McGrath, R. E., Mitchell, M., Kim, B. H., & Hough, L. (2010). *Evidence for response bias as a source of error variance in applied assessment.* Psychological Bulletin, 136(3), 450–470. https://pubmed.ncbi.nlm.nih.gov/20438146/. Notes that evidence for many response-bias indicators is limited; do not claim that indirect tasks automatically detect faking.
- American Psychological Association. *Professional practice guidelines for occupationally mandated psychological evaluations.* https://www.apa.org/practice/guidelines/psychological-evaluations.html. Highlights appropriate instrument selection, reliability, validity, context, and multiple relevant information sources.

This document is a design protocol, not a substitute for professional review or empirical validation.
