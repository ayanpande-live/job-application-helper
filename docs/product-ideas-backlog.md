\# Product Ideas Backlog — Job Application Helper / FitSignal Prototype



\## Purpose



This document captures feature ideas, product improvements, and future implementation stages discussed during the prototype build.



The current product direction is:



> An honest AI job-fit and application strategy assistant that helps candidates decide whether to apply, understand their gaps, and generate application materials only when the fit is credible enough.



The core product should not become a generic CV or cover letter generator. Its value should come from honest fit evaluation, evidence-based positioning, and practical candidate improvement guidance.



\---



\# Current Implementation Status



\## Already implemented



\### 1. OpenAI-powered Fit Analysis



Status: Implemented



The app now generates AI-based fit analysis including:



\* Fit verdict

\* Fit score

\* Score rationale

\* Strongest matches

\* Main gaps

\* Application strategy

\* Screening risks

\* Next best actions



The scoring was calibrated to avoid inflated “ATS-style” scores.



Current score logic:



\* 90–100: Strong fit

\* 80–89: Good fit

\* 70–79: Stretch fit

\* 60–69: Meaningful stretch / low probability

\* 36–59: Low probability

\* 16–35: Very low fit

\* 0–15: Hard mismatch



Hard blockers such as missing legal credentials, required licenses, regulated qualifications, or central role-family experience should score very low.



\---



\### 2. OpenAI-powered Tailored CV Draft



Status: Implemented



The app now generates a tailored CV draft using:



\* Candidate CV

\* Job description

\* Candidate strengths

\* Candidate improvement areas

\* Fit analysis



The CV prompt is designed to create the strongest honest version of the candidate for the target role.



Important rules already included:



\* Do not invent experience

\* Do not add unsupported tools, certifications, metrics, or job titles

\* Do not turn support work into ownership

\* Do not exaggerate seniority

\* Do not keyword-stuff

\* Adapt CV confidence based on fit verdict

\* Use change notes to explain what was emphasized, reduced, or not included



\---



\### 3. AI-generated vs Prototype mock labels



Status: Implemented



Result sections are labelled as either:



\* AI-generated

\* Prototype mock



Current state:



\* Fit Verdict: AI-generated

\* Application Strategy: AI-generated

\* Tailored CV: AI-generated

\* Cover Letter: Prototype mock

\* Outreach: Prototype mock

\* Roadmap: Prototype mock



This prevents confusion during testing and demos.



\---



\### 4. Manual calibration notes



Status: Implemented



Manual fit analysis tests are documented in:



```txt

evals/manual-test-results.md

```



Initial calibration results:



\* Senior Legal Counsel hard mismatch: passed after tightening scoring

\* B2B Marketing Manager strong fit: 92

\* B2B SaaS Product Marketing Manager stretch fit: 72



\---



\# Near-Term Feature Ideas



\## 1. Cover Letter Generation



Priority: High

Recommended phase: Next implementation step



The cover letter should not be a generic application letter. It should tell the most credible story the candidate can tell for that specific role.



Inputs should include:



\* Fit analysis

\* Tailored CV

\* Candidate CV

\* Job description

\* Candidate strengths

\* Candidate improvement areas

\* Company context extracted from the JD



The cover letter should generate:



\* Full cover letter

\* Short cover letter

\* Subject line options



Key principles:



\* No generic template language

\* No “I am excited to apply” default opening

\* No unsupported company praise

\* No overclaiming fit

\* No repeated CV summary

\* Use 2–3 concrete evidence points

\* Adapt confidence based on fit verdict



Fit-aware behavior:



\* Strong fit / good fit: confident and direct

\* Stretch fit: careful, positioning-led, transparent

\* Low probability / not yet: conservative and gap-aware



Important idea:



The cover letter should answer:



> What is the most credible story this candidate can tell for this role?



Not:



> Can you write a polite application letter?



\---



\## 2. Cover Letter Uniqueness Engine



Priority: High

Recommended phase: Cover letter implementation



Goal:



Ensure cover letters feel meaningfully different across applications and are not just lightly edited templates.



Short-term approach without database:



The model should choose a distinct narrative angle for every cover letter based on the role and candidate evidence.



Possible narrative angles:



\* Commercial growth

\* Customer problem-solving

\* International stakeholder collaboration

\* Digital transformation

\* Product adoption

\* Market expansion

\* Operational efficiency

\* Category transition

\* Platform-led customer value

\* Demand generation and revenue impact

\* Product positioning and sales enablement



Prompt rules:



\* Choose a distinct cover letter angle before writing

\* Opening sentence must refer to a specific employer priority from the JD

\* Use concrete candidate evidence

\* Do not reuse generic phrasing

\* Do not write a cover letter that could apply to any job



Future stronger version with database:



\* Store previous cover letters

\* Compare new cover letter against previous outputs

\* Detect repeated phrases

\* Regenerate if too similar

\* Allow user to choose preferred angle or tone



\---



\## 3. Company Context / Values Alignment



Priority: High

Recommended phase: Cover letter implementation, first version from JD only



Current gap:



The app aligns the candidate to the role, but not yet to the company.



Role fit answers:



> Can I do the job?



Company fit answers:



> Can I tell a credible story for why this company?



Recommended first version:



Extract company context from the job description only.



Possible extracted fields:



```ts

companyContext: {

&#x20; source: "job\_description" | "user\_provided\_url" | "web\_search" | "not\_available";

&#x20; companyName: string;

&#x20; values: string\[];

&#x20; missionThemes: string\[];

&#x20; cultureSignals: string\[];

&#x20; businessPriorities: string\[];

&#x20; candidateAlignment: string\[];

&#x20; risksOrUnknowns: string\[];

}

```



Use cases:



\* Cover letter

\* Outreach message

\* Application strategy

\* Interview preparation later



Prompt rules:



\* Use company values only if found in the JD or provided context

\* Do not invent company values

\* Do not praise the company generically

\* Connect one company value or mission theme to one real candidate evidence point

\* If company values are unavailable, focus on role priorities instead



Example:



Company value: customer focus

Candidate evidence: managed 52 SaaS client accounts and worked consultatively on solution adoption



Company value: innovation

Candidate evidence: built AI Noobie MVP, tested AI-driven prospecting, developed gamified sales pitch concepts



Company value: international collaboration

Candidate evidence: supported campaigns across EMEA, North America, and APAC



\---



\## 4. Company Research Add-On with Web Search



Priority: Medium

Recommended phase: Later, after caching/storage exists



Possible implementation:



Add optional company research using:



\* Company website

\* Careers page

\* About page

\* Public values page

\* Recent company news, if relevant



Recommended product pattern:



Do not silently run web search in every analysis.



Instead add a deliberate button:



> Research company context



Future requirements:



\* Ask user for company website or careers page URL

\* Use web search only when useful

\* Show citations/sources in the UI

\* Cache company context to reduce repeated API calls

\* Allow user to confirm or edit extracted values



Risks:



\* Wrong company may be researched

\* More latency

\* More API cost

\* Need citations

\* Requires storage to avoid repeated searches



Recommended later flow:



1\. User enters company name and optional website

2\. App extracts company values and business priorities

3\. User reviews company context

4\. Cover letter and outreach use approved company context



\---



\# Medium-Term Feature Ideas



\## 5. Cover Letter Quality Explanation



Priority: Medium

Recommended phase: After cover letter generation works



Add a short explanation section:



> Why this cover letter works



Possible fields:



\* Chosen narrative angle

\* Employer priority addressed

\* Candidate evidence used

\* Gap handled carefully

\* Company value alignment used



This increases trust and helps users learn from the output.



\---



\## 6. Application Strategy Improvement



Priority: Medium



Current application strategy is useful, but it could become more actionable.



Future additions:



\* Recommended application decision

\* “Apply now / apply only if motivated / do not prioritize”

\* Recruiter screening risks

\* What to emphasize in the CV

\* What to emphasize in the cover letter

\* What to avoid overclaiming

\* What to prepare for interview screening

\* Missing evidence to build before applying



Possible output categories:



```txt

Apply decision

Positioning angle

Top 3 proof points

Main screening risks

Must-not-overclaim items

Application material priorities

```



\---



\## 7. Role Readiness Plan / Improvement Plan



Priority: Medium to High

Recommended phase: Paid add-on later



This is one of the strongest differentiation opportunities.



Goal:



Help candidates improve their fit for a target role, not just apply.



Inputs:



\* Fit analysis

\* Main gaps

\* User timeline

\* Available time

\* Budget

\* Preferred learning path



Already discussed intake questions:



1\. Timeline



&#x20;  \* This week

&#x20;  \* Within 2–4 weeks

&#x20;  \* Within 1–3 months

&#x20;  \* Longer-term



2\. Time available



&#x20;  \* Less than 2 hours total

&#x20;  \* 1–2 hours per week

&#x20;  \* 3–5 hours per week

&#x20;  \* 5+ hours per week



3\. Budget



&#x20;  \* €0 only

&#x20;  \* Up to €25

&#x20;  \* €25–€100

&#x20;  \* €100+



4\. Preferred path



&#x20;  \* Free resources and practical actions

&#x20;  \* Short paid courses or certifications

&#x20;  \* Hands-on projects / portfolio proof

&#x20;  \* Best mix of free and paid options



Output should include:



\* Critical gaps

\* Reality check

\* Free options

\* Paid course/certification options

\* Practical portfolio actions

\* 30/60/90-day roadmap

\* Best next actions



Important principle:



The plan should not just recommend courses. It should recommend the fastest credible way to build evidence.



\---



\## 8. Outreach Message Generation



Priority: Medium



Outreach should be generated after:



\* Fit analysis

\* Tailored CV

\* Cover letter

\* Company context



Possible outputs:



\* Recruiter message

\* Hiring manager message

\* Alumni/employee networking message

\* Follow-up message



Rules:



\* Keep short

\* Do not beg

\* Do not sound automated

\* Mention one specific role/company reason

\* Mention one candidate proof point

\* Include a clear but low-pressure ask



Future enhancement:



Generate multiple tones:



\* Direct

\* Warm

\* Brief

\* Strategic

\* Curious



\---



\## 9. Result Storage and Reuse



Priority: Medium

Recommended phase: Before broader testing



Possible tool: Supabase



Why needed:



\* Store user analyses

\* Avoid rerunning OpenAI calls unnecessarily

\* Compare multiple applications

\* Enable previous cover letter similarity checks

\* Enable user dashboard

\* Support paid add-ons

\* Support exports/downloads



Potential stored entities:



\* User

\* Candidate profile

\* CV version

\* Job description

\* Fit analysis

\* Tailored CV

\* Cover letter

\* Outreach messages

\* Company context

\* Improvement plan



Privacy principle:



Do not store raw CVs unnecessarily unless the user is authenticated and clearly consents.



\---



\## 10. Mock Mode / Real Mode Switch



Priority: Medium



Useful for testing and cost control.



Possible environment variable:



```env

USE\_OPENAI\_ANALYSIS=true

```



Or more granular:



```env

USE\_OPENAI\_FIT=true

USE\_OPENAI\_CV=true

USE\_OPENAI\_COVER\_LETTER=false

USE\_OPENAI\_OUTREACH=false

```



Benefits:



\* Lower token cost during UI work

\* Easier debugging

\* Safer demos

\* Controlled rollout per feature



\---



\# Longer-Term Feature Ideas



\## 11. Previous Output Similarity Detection



Priority: Later



Needed to truly ensure no two cover letters are the same.



Possible approach:



\* Store previous outputs

\* Compare new cover letter against older cover letters

\* Detect repeated openings, paragraphs, and subject lines

\* Regenerate if similarity is too high

\* Show “unique angle used” to user



Useful for candidates applying to many similar roles.



\---



\## 12. Recruiter Scan Simulation



Priority: Later



Feature idea:



Show how a recruiter might read the application in 10 seconds.



Possible outputs:



\* First impression

\* Evidence noticed immediately

\* Gaps noticed immediately

\* Likely shortlist risk

\* What should be moved higher in the CV



This could become a high-value differentiator.



\---



\## 13. Application Quality Score



Priority: Later



Separate from actual fit score.



Important product idea:



Actual Fit Score should answer:



> How well does the candidate match the job?



Application Quality Score should answer:



> How well does the application present the candidate?



This prevents inflated fit scoring while still letting users improve their application quality.



\---



\## 14. Candidate Evidence Bank



Priority: Later



Allow users to save reusable proof points:



\* Metrics

\* Projects

\* Tools

\* Industries

\* Achievements

\* Case studies

\* Portfolio links

\* Certificates

\* Languages

\* Work authorization

\* Preferred roles



The app can then tailor applications more accurately without asking every time.



\---



\## 15. Multi-Version CV Generation



Priority: Later



Generate CV versions by target direction:



\* B2B marketing

\* Product marketing

\* Account management

\* Business development

\* Ecommerce / marketplace

\* Growth marketing

\* Founder/operator roles



Useful for candidates with hybrid backgrounds.



\---



\## 16. Interview Preparation



Priority: Later



Use the fit analysis and gaps to generate:



\* Likely interview questions

\* Strong answers

\* Gap-handling responses

\* “Tell me about yourself”

\* Salary positioning

\* Motivation for company

\* Motivation for role transition



\---



\## 17. User Dashboard



Priority: Later



Potential views:



\* Saved jobs

\* Fit scores by job

\* Applications in progress

\* Best-fit role types

\* Common gaps across roles

\* Improvement plan progress

\* Generated documents



Avoid building this before storage/auth.



\---



\## 18. Payments and Paid Add-Ons



Priority: Later



Possible paid features:



\* Role Readiness Plan

\* Deep company research

\* Full application pack export

\* Multi-role CV strategy

\* Interview prep pack

\* Recruiter scan simulation



Possible pricing ideas:



\* One-time €10 improvement plan

\* Bundle for multiple jobs

\* Freemium analysis + paid documents

\* Subscription only later, if repeat usage is proven



\---



\# Implementation Sequence Recommendation



\## Current state



Completed:



1\. Fit analysis

2\. Application strategy

3\. Tailored CV

4\. AI/mock labels

5\. Manual calibration notes



\## Recommended next sequence



\### Phase 1C — Cover Letter



1\. Extract company context from JD

2\. Generate cover letter using:



&#x20;  \* Fit analysis

&#x20;  \* Tailored CV

&#x20;  \* Company context

&#x20;  \* Candidate evidence

3\. Add AI-generated label for cover letter

4\. Test strong-fit and stretch-fit examples

5\. Commit results



\### Phase 1D — Outreach



1\. Generate recruiter/hiring manager outreach

2\. Use company context and candidate positioning angle

3\. Keep messages short and non-generic



\### Phase 1E — Improvement Plan



1\. Replace mock roadmap with AI-generated role readiness plan

2\. Use timeline/time/budget/preference inputs

3\. Keep it as potential paid feature



\### Phase 2 — Storage and Research



1\. Add Supabase

2\. Save analyses

3\. Add company research with user-provided URL

4\. Add caching

5\. Add previous cover letter similarity checks



\### Phase 3 — Beta



1\. Add user accounts

2\. Add saved applications

3\. Add email capture / CRM integration

4\. Invite controlled testers



\---



\# Product Principles to Preserve



1\. Be honest, not flattering.

2\. Separate actual fit from application quality.

3\. Do not invent candidate experience.

4\. Do not inflate fit scores.

5\. Make every output role-specific.

6\. Make every generated asset traceable to evidence.

7\. Treat hard blockers seriously.

8\. Prefer useful truth over generic encouragement.

9\. Make mock vs AI-generated sections visible.

10\. Build slowly enough that quality does not collapse.



