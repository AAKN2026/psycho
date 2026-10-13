# Psychological Design Blueprint

## Product rule

This product must not disguise entertainment as psychological measurement. Every activity must declare (1) the construct it may inform, (2) the task mechanism, (3) observable variables, (4) scoring and interpretation rules, (5) alternative explanations, and (6) evidence/validation status.

## Evidence tiers

- **Tier A — established inventory:** a published instrument with documented scoring and evidence. Preserve item wording, reverse-keying, scoring, and attribution. Do not imply local norms unless collected.
- **Tier B — research-paradigm task:** adapted from a recognized experimental paradigm, but not yet validated as an individual-difference test. Report task performance only, not a personality label.
- **Tier C — exploratory interaction:** a custom activity or preference prompt. Describe responses neutrally; do not infer a trait or combine it with validated scores.
- **Tier D — reflective prompt:** supports self-understanding, not measurement. Let users interpret their own answers.

## Required task specification

For every task, document:
- **Target construct / non-targets:** what the task could inform and what it cannot establish.
- **Psychological rationale:** relevant theory or research paradigm, with sources.
- **Task mechanics:** exact stimulus, instructions, number of trials, order/randomization, time limits, feedback, and accessibility alternatives.
- **Primary outcomes:** define in advance (e.g., accuracy, median correct-trial response time, switch cost, omission/error rate).
- **Quality controls:** practice trials, device/input checks, minimum usable trials, and flags for interruptions.
- **Confounds:** reading ability, language, vision/hearing, motor speed, device latency, screen size, fatigue, stress, familiarity, and misunderstanding.
- **Feedback:** observations first; cautious possible explanations second; uncertainty and alternatives always visible.
- **Data handling:** explain what is collected, purpose, retention, and whether it leaves the device. Default to no upload and no persistent storage for exploratory tasks.
- **Validation gate:** do not make individual-level trait claims until reliability, construct validity, criterion validity, fairness, and test-retest stability are evaluated in an appropriate sample.

## Initial task roadmap

### 1. Visual discrimination (Tier B prototype)
- **Possible construct:** visual feature detection/selective attention under the exact task conditions.
- **Outcomes:** accuracy; response time measured from the display of one trial to its first valid response; omissions; answer changes after the first response.
- **Design requirement:** present one trial at a time; standardize stimuli as SVG/canvas rather than font glyphs; randomize equivalent item order; include practice trials; avoid giving correctness feedback until the block ends.
- **Not evidence of:** general intelligence, clinical attention disorder, impatience, honesty, or stable personality.
- **Current limitation:** the existing eight-item prototype shows multiple trials together and uses some font-dependent glyphs. Its click intervals are intervals between actions, not item-level reaction times. Keep its results explicitly exploratory until the task is redesigned and tested.

### 2. Rule switching (Tier B candidate)
- **Paradigm:** alternate between simple rules (for example, classify a shape by color versus by shape) with counterbalanced congruent/incongruent trials.
- **Outcomes:** accuracy and median response time on correct trials; switch cost is the difference between switch and repeat trials, interpreted only if trial counts and conditions are adequate.
- **Not evidence of:** a fixed “flexibility personality” or diagnosis. Motor, reading, learning, and speed-accuracy trade-offs matter.

### 3. Decision under uncertainty (Tier B candidate)
- **Paradigm:** repeated, clearly described choices with different probability/reward structures; separate risk preference from comprehension and numeracy.
- **Outcomes:** choice proportions and consistency across equivalent trials.
- **Not evidence of:** real-world financial competence or moral character.

### 4. Emotion and body awareness (Tier D unless separately validated)
- Use optional self-report/reflection with neutral language. Do not infer hidden emotions from a color, image, voice, or body response alone.
- Audio tasks must provide a text/visual alternative and check audio playback before recording results.

## Cross-task interpretation

- Do not create a single hidden “truth” score by blending unrelated tasks.
- Do not call response latency “hesitation” without a task-specific operational definition and validation.
- Repeated clicks may reflect unclear feedback, accessibility needs, lag, or misclicks; do not label them impatience.
- A changed answer may reflect checking, learning, accidental input, or genuine uncertainty.
- Browser refreshes must not be monitored globally. If retry behaviour matters, provide an explicit in-app retry control and disclose its measurement.
- Any cross-task pattern should be framed as a hypothesis, with supporting observations and plausible alternative explanations—not as a diagnosis or definitive personality claim.

## Release checklist

- [ ] Each task has a written construct specification and evidence tier.
- [ ] Instructions are clear in both Chinese and English and tested for comprehension.
- [ ] Stimuli and timing are controlled as far as the web platform allows.
- [ ] Keyboard, touch, screen-reader, reduced-motion, and audio alternatives are considered.
- [ ] Scores and feedback distinguish observed data from interpretation.
- [ ] Privacy notice accurately describes actual data flows.
- [ ] No exploratory task affects the IPIP-NEO-120 score.
- [ ] Build, accessibility checks, and deployment pass before claiming release.
