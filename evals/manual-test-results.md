\# Manual Fit Analysis Test Results



\## Phase 1B Calibration



\### Test 1: Hard mismatch — Marketing CV vs Senior Legal Counsel JD

Expected: not\_yet, 0–15 after scoring adjustment  

Observed: Passed after tightening prompt  

Notes: Mandatory legal credentials and legal counsel experience should trigger hard mismatch scoring.



\### Test 2: Strong fit — B2B Marketing Manager

Expected: strong\_fit or good\_fit, 85–95  

Observed: 92  

Notes: Score is appropriate because the candidate evidence directly matches demand generation, SEO/SEA, LinkedIn advertising, CRM, sales coordination, agency coordination, and international B2B marketing.



\### Test 3: Stretch fit — Product Marketing Manager, B2B SaaS

Expected: stretch\_fit, 70–79  

Observed: 72  

Notes: Score is appropriate because the candidate has adjacent B2B marketing, launch support, sales enablement, and positioning experience, but lacks formal PMM title, SaaS product marketing ownership, pricing, and competitive intelligence evidence.



\## Tailored CV Generation



\### First CV generation test

Expected: Tailored CV section marked AI-generated  

Observed: Passed  

Notes: Fit Verdict, Application Strategy, and Tailored CV are now AI-generated. Cover Letter, Outreach, and Roadmap remain prototype mock sections.

## Cover Letter Generation

### First cover letter generation test
Expected: Cover Letter section marked AI-generated  
Observed: Passed  
Notes: Cover letter generation now uses the fit analysis, tailored CV, job description, and JD-visible company context. Outreach and Roadmap remain prototype mock sections.

\## Current conclusion



The Phase 1B fit analysis engine is calibrated well enough for limited prototype testing.



The Tailored CV generation flow is connected and works locally.



Approved next steps:

1\. Keep Fit Verdict, Application Strategy, and Tailored CV AI-generated.

2\. Keep Cover Letter, Outreach, and Roadmap clearly labelled as Prototype mock.

3\. Run controlled short-input tests before connecting the next AI section.

4\. Next AI section candidate: Cover Letter.

