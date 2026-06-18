# Fit Analysis Evaluation Rubric

Use this rubric to evaluate whether the fit analysis output is useful, honest, and aligned with the product positioning.

The product should behave like an honest job-fit and application strategy tool, not a generic CV rewriting assistant.

## Evaluation scale

Score each category from 1 to 5.

- 1 = Poor
- 2 = Weak
- 3 = Acceptable
- 4 = Good
- 5 = Excellent

## Categories

### 1. Verdict accuracy

Does the fit verdict feel fair based on the CV and job description?

Check whether the model correctly distinguishes between:

- strong_fit
- good_fit
- stretch_fit
- low_probability
- not_yet

Red flags:

- gives “good fit” when major must-have requirements are missing
- gives “strong fit” based only on keyword overlap
- is overly encouraging when the evidence is weak
- is too harsh despite strong relevant evidence

### 2. Score calibration

Is the score realistic?

Use this calibration:

- 90–100: Strong fit with clear evidence for most core requirements
- 80–89: Good fit with some manageable gaps
- 70–79: Stretch fit with meaningful gaps
- 60–69: Low probability but some adjacent relevance
- Below 60: Not yet or major mismatch

Red flags:

- score above 85 without strong evidence
- score above 75 while missing multiple must-haves
- score above 65 while missing the central role experience
- score below 60 despite clear relevant experience

### 3. Evidence grounding

Are the strengths and gaps grounded in the supplied CV and job description?

Red flags:

- invents tools, industries, seniority, certifications, or metrics
- assumes experience not shown in the CV
- treats candidate-endorsed strengths as proven facts without support
- makes claims that cannot be traced to the input

### 4. Gap quality

Are the gaps specific, useful, and prioritized?

Good gaps should identify:

- what is missing
- why it matters
- how severe it is
- whether it can be addressed by better positioning

Red flags:

- vague gaps like “needs more experience”
- only keyword gaps, no strategic gaps
- ignores must-have requirements
- fails to separate evidence gaps from real skill/domain gaps

### 5. Application strategy quality

Does the strategy help the user decide what to do next?

Good strategy should explain:

- whether the user should apply
- how to position the application
- what to emphasize
- what not to overclaim
- what could trigger rejection

Red flags:

- generic advice
- motivational fluff
- tells every user to apply
- does not mention screening risks
- recommends rewriting before diagnosis

### 6. Practicality

Are the next best actions realistic and useful?

Good actions should be:

- specific
- achievable
- relevant to the role
- tied to actual gaps

Red flags:

- generic actions like “improve your skills”
- unrealistic timelines
- recommends courses for gaps that are actually seniority or domain gaps
- no clear next step

### 7. Tone and trust

Does the output sound like a credible application strategist?

Good tone should be:

- honest
- direct
- practical
- respectful
- not robotic
- not overly flattering

Red flags:

- exaggerated praise
- discouraging without explanation
- buzzwords
- too much generic AI language
- sounds like a sales page

## Overall pass/fail

A fit analysis passes if:

- average score is 4.0 or higher
- verdict and score calibration are both 4 or higher
- no invented experience appears
- the application strategy gives a clear next move

A fit analysis fails if:

- it invents candidate evidence
- it significantly overstates fit
- it ignores major job requirements
- it gives generic advice that could apply to any job