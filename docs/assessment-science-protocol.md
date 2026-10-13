# Persona Assessment Science & Product Protocol

**Status:** Design protocol for an exploratory MVP; not a validated psychological instrument.  
**Version:** 0.1.0  
**Last updated:** 2026-10-13

## 1. Product definition

Persona is a bilingual personality self-exploration experience with a research-based self-report instrument as its core. The current implementation uses the public-domain IPIP-NEO-120 item bank and a published Mandarin translation, with deterministic five-factor scoring and 30 four-item facet scores. Additional visual, auditory, and sensory activities remain separate task-specific or descriptive modules; they do not change personality scores. The website has not independently validated the inventory in a Singapore bilingual sample or established local norms. It is not a clinical diagnostic tool and must not be used for hiring, school placement, or other consequential decisions.

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
| IPIP-NEO-120 self-report | 120 item ratings, 5 broad factors, 30 four-item facets | Score profile under the published inventory key; self-reflection only pending local validation | Diagnosis, percentile, Singapore norm ranking, consequential decisions | Published instrument and Mandarin translation evidence; website implementation/local bilingual sample not independently validated |
| Colour selection | Selected colour in this session | Context-specific preference and the user's own association | Personality, emotional state, intelligence, subconscious meaning | Reflective exercise; no validated trait inference |
| Scene first-noticed choice | Selected scene element and optional explanation | Self-reported first impression and personal association | Projective personality interpretation or stable attention trait | Custom illustration; not a standardized task |
| Taste preference | Stated everyday taste preference; no tasting required | Self-reported preference and reflection on context | Personality, health, or sensory ability inference | Self-report only; affected by culture and experience |
| Body-sensation check-in | One self-reported recent bodily sensation or “nothing in particular” | Self-monitoring and experience description | Diagnosis, physiological measurement, or trait inference | Reflective exercise; not a clinical scale |
| Visual difference task (8 custom items) | Choice per item and total correct (0–8); no response-time logging | Item-specific performance under this exact display and instruction | Personality, IQ, diagnosis, stable attention trait, or a general cognitive profile | Prototype only; items are not standardized; glyph rendering and spacing vary by device; no difficulty calibration, reliability, norms, or validity evidence |
| Tone-pair discrimination (MVP addition) | Same/different judgments over six tone pairs | Accuracy on a brief browser-based auditory discrimination activity | Personality, hearing diagnosis, intelligence, emotional traits | Prototype; unnormed and device-dependent |

### Interaction-behaviour observation (privacy-first prototype)

The visual task now counts answer changes and repeated clicks on the same option during the current page session. It also retains intervals between successive interactions in in-memory state, but these intervals are not yet used to produce a score or interpretation. The indicators are not persisted to local storage or sent to the optional cloud endpoint.

| Indicator | Possible explanations to investigate | Do not conclude |
|---|---|---|
| Answer changes | Reconsideration, checking, uncertainty, misclick, unclear stimulus | “Indecisive personality” |
| Repeated click on the same option | Button feedback unclear, impatience, double-click habit, assistive input or latency | “Impatient personality” |
| Short interval between interactions | Familiarity, rushing, guessing, clear stimulus, accidental rapid clicks | “Impulsive personality” |
| Long interval between interactions | Careful comparison, distraction, reading difficulty, interruption, device lag | “Hesitant personality” |
| Repeated refresh attempts (future instrumented task only) | Perceived app failure, network delay, frustration, habit, confusion | “Low frustration tolerance” without ruling out interface failure |

**Interpretation safeguards:** do not call interaction speed “reaction time” unless stimulus onset and response timing are controlled and measured correctly. The current interval is only the time between successive clicks; it is not a per-item response latency. Any future refresh/retry signal must be captured only within the app and clearly disclosed; do not monitor browser-wide behaviour. Interface errors, accessibility needs, language, device performance, and user context must be considered before interpretation. These indicators are exploratory, not personality scores, and must not be merged with IPIP-NEO-120 scores without validation.

### Visual task design notes (prototype)

Each visual item now exposes its intended construct, a brief research rationale, the observable response, and an interpretation limit after the user completes the task. These are **design hypotheses informed by established research areas**, not evidence that this particular item validly measures an individual difference.

| Item | Intended process | Observable response | Key limitation |
|---|---|---|---|
| 1. Arrow direction | Selective attention to orientation | Selects the orientation singleton | Glyph rendering and display size may affect detection |
| 2. Inner marking | Local feature discrimination | Detects the different inner mark | Symbol fonts may render details differently |
| 3. Dot count | Small-set numerosity discrimination | Selects the option with fewer dots | Spacing, size, and arrangement are potential confounds |
| 4. Opening direction | Shape/orientation discrimination | Detects the opposite opening | Font-dependent character; replace with standardized SVG before validation |
| 5. Compound shape | Selecting a local cue in a compound stimulus | Uses circle fill while the triangle is constant | One response cannot reveal the strategy used |
| 6. Dot spacing | Spatial-layout discrimination | Detects different spacing despite equal count | Whitespace and typography are uncontrolled |
| 7. Internal fill | Distinguishing contour from internal detail | Detects a different fill | Font-dependent symbol; replace with standardized SVG before validation |
| 8. Two-feature change | Multi-cue target detection | Detects simultaneous direction and fill changes | Cues co-vary, so their separate contributions cannot be identified |

**Release gate:** this task must remain an optional exploration, not a psychological assessment score. Before using it to make individual-difference claims, replace font-dependent glyphs with controlled vector stimuli; define and preregister hypotheses; pilot with an appropriately consented sample; inspect item accuracy and ambiguity, response distributions, and accessibility/device effects; and evaluate reliability and validity for the intended population. Do not collect or upload raw responses by default. The current MVP does not log response time or use these answers to alter the IPIP-NEO-120 profile.

## 4. Post-activity psychological rationale and debrief standard

Every interactive activity must show a debrief immediately after completion, in both Chinese and English. The debrief must identify the theoretical research area, the exact observable measure, the intended purpose, the evidence status, and the limits on interpretation. A plausible theoretical rationale must not be presented as proof that this specific implementation is validated.

### Visual discrimination exercise
- **Purpose:** Demonstrate a simple visual feature-discrimination task and help the user notice that task performance is context-sensitive.
- **Research basis:** Visual perception and selective-attention research study detection of target features among alternatives. These three custom items are not a standardized attention measure.
- **Observable measure:** Number correct out of three; no reaction-time inference.
- **Evidence status and boundary:** No reliability estimate, norm group, or validation study exists for this implementation. Do not infer IQ, ADHD, stable attention, personality, or clinical status.

### Multi-sensory self-observation
- **Purpose:** Support reflective description of current preferences, associations, and bodily awareness.
- **Research basis:** Self-monitoring and experience-focused reflection can help people describe their own experiences. This does not validate colour, scene, taste, or body choices as personality indicators.
- **Observable measure:** User-selected options and optional self-described association, kept descriptive and separate.
- **Evidence status and boundary:** Reflective exercise, not a psychometric instrument or projective test. No subconscious interpretation, diagnosis, or personality score is permitted.

### Auditory same/different activity
- **Purpose:** Demonstrate a simple auditory discrimination judgment.
- **Research basis:** Psychophysics and auditory-perception research use discrimination judgments to study responses to sound stimuli. The current six-trial browser activity uses clearly separated tones and is not a calibrated threshold protocol.
- **Observable measure:** Number correct out of six; no reaction-time inference or audio recording.
- **Evidence status and boundary:** Unnormed prototype affected by device, output level, environment, and individual hearing differences. Do not infer hearing status, intelligence, personality, or diagnosis.

### Core IPIP-NEO-120 inventory
- **Purpose:** Describe self-reported Big Five personality tendencies using a published item bank and scoring key.
- **Research basis:** Johnson (2014) developed and evaluated the 120-item, 30-facet public-domain inventory; published Mandarin-version evidence exists. These studies do not validate this website's implementation or establish Singapore bilingual norms.
- **Observable measure:** 120 item ratings, five broad factors, and 30 four-item facet indices using the inventory's scoring key.
- **Evidence status and boundary:** Use for self-reflection only until item/facet mapping and reverse keys are independently checked and local validation is performed. No diagnosis, percentile, or consequential decisions.

## 5. Sound activity specification

- **Experience name shown before completion:** “Sound exploration” / “声音探索”.
- **Task:** Listen to six pairs of simple tones and judge whether the two tones sound the same or different.
- **Task design:** Three same and three different trials, order shuffled per session; the different pair uses a clearly separated frequency to support basic interaction testing. This is an introductory task, not a clinical or calibrated psychophysical threshold procedure.
- **Measures:** Number correct out of six. Do not use reaction time in the first release because browser scheduling, device audio output, and user hardware introduce uncontrolled latency.
- **Audio handling:** Generate tones in the browser with Web Audio API after a user gesture. No microphone access, voice capture, or audio upload. Offer an explicit replay action and a non-audio exit.
- **Debrief:** Explain that it was an auditory same/different discrimination task; the result describes performance on this small task only. It does not measure personality or diagnose hearing conditions.
- **Safety/accessibility:** Keep tone volume modest, provide stop/reset, do not require headphones, and let users skip. Users with hearing differences or noisy environments should be able to skip without penalty.
- **Future validation needed:** Pilot usability, test-retest reliability, item difficulty, headphone/speaker effects, browser/device effects, accessibility, age/language differences, and comparison against an appropriately designed auditory discrimination protocol before making stronger claims.

## 6. Future measurement roadmap

### Phase 1 — Reliable interaction foundations
- Use IPIP-NEO-120 as the core personality measure; preserve the published English/Mandarin item wording and fixed scoring key.
- Show five broad factors and 30 facet scores, label 0–100 values as transformed response-scale indices rather than percentiles, and explain the Neuroticism/Emotional Stability direction difference.
- Keep sensory preferences descriptive and separate from personality scoring.
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

## 7. Release gates

A feature is not “psychologically validated” merely because it has a plausible theory or runs correctly. A release can be called **build-verified** after automated checks pass; **deployed** after the hosting workflow succeeds and the live page is checked; and **psychometrically validated** only after appropriate empirical evidence supports the intended interpretation and use.

## 8. Evidence and references

- Johnson, J. A. (2014). *Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory: Development of the IPIP-NEO-120.* Journal of Research in Personality, 51, 78–89. https://doi.org/10.1016/j.jrp.2014.05.003. Reports development and psychometric evaluation of the 120-item, 30-facet inventory.
- International Personality Item Pool (IPIP). *Mandarin Chinese Translation and Validation of Johnson's (2014) IPIP-NEO-120.* Item wording, factor/facet reliability statistics, and correlations with a Chinese-language Big Five measure: https://ipip.ori.org/Mandarin%20translation%20of%20IPIP-NEO-120.htm and https://ipip.ori.org/ChineseIPIP-120reliability.htm.
- International Personality Item Pool (IPIP). *Obtaining Permission.* IPIP items, scales, and inventories are public domain: https://ipip.ori.org/newPermission.htm.

- American Psychological Association. (2020). *APA Guidelines for Psychological Assessment and Evaluation.* Emphasizes validity evidence for the intended score interpretation/use, the limits of individual evidence sources, fairness, and integration of evidence. https://www.apa.org/about/policy/guidelines-psychological-assessment-evaluation.pdf
- Meyer, G. J., Finn, S. E., Eyde, L. D., et al. (2001). *Psychological testing and psychological assessment: A review of evidence and issues.* American Psychologist, 56(2), 128–165. DOI: https://doi.org/10.1037/0003-066X.56.2.128. Reviews the value of multimethod assessment while supporting evidence-based interpretation rather than assuming every method adds validity.
- McGrath, R. E., Mitchell, M., Kim, B. H., & Hough, L. (2010). *Evidence for response bias as a source of error variance in applied assessment.* Psychological Bulletin, 136(3), 450–470. https://pubmed.ncbi.nlm.nih.gov/20438146/. Notes that evidence for many response-bias indicators is limited; do not claim that indirect tasks automatically detect faking.
- American Psychological Association. *Professional practice guidelines for occupationally mandated psychological evaluations.* https://www.apa.org/practice/guidelines/psychological-evaluations.html. Highlights appropriate instrument selection, reliability, validity, context, and multiple relevant information sources.

This document is a design protocol, not a substitute for professional review or empirical validation.
