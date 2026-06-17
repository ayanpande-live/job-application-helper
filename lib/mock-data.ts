import type {
  AnalysisResult,
  AnalyzeRequest,
  ImprovementPlanResponse,
} from "./types";

export const sampleAnalyzeRequest: AnalyzeRequest = {
  jobTitle: "Regional Growth Manager",
  company: "Fictional Mobility Co.",
  cv:
    "Growth and marketing professional with 7+ years across B2B SaaS, digital marketing, demand generation and commercial projects. Managed international campaigns across EMEA and APAC, improved lead generation 3x, supported €1.6M revenue impact, and managed 50+ SaaS client accounts earlier in career.",
  jobDescription:
    "We are hiring a Regional Growth Manager to improve marketplace supply growth across European markets. The role requires campaign planning, stakeholder management, performance reporting, experimentation, process improvement and working closely with operations, product and finance teams.",
  strengths:
    "Cross-functional collaboration, digital growth campaigns, commercial communication, account management, experimentation mindset.",
  improvements:
    "Less direct experience in marketplace operations and SQL-heavy analytics. Limited formal ownership of incentive design.",
};

export const mockAnalysis: AnalysisResult = {
  jobId: "demo",
  jobTitle: "Regional Growth Manager",
  company: "Fictional Mobility Co.",
  fit: {
    score: 72,
    verdict: "stretch_fit",
    verdictLabel: "Stretch Fit",
    summary:
      "This is a credible stretch. Your growth, demand-generation and stakeholder-management experience maps well to the role, but the employer will likely look for direct marketplace operations, incentive design and deeper analytics ownership.",
    positioning:
      "A commercially minded growth operator who can turn market insights, campaigns and cross-functional execution into measurable acquisition outcomes.",
    strengths: [
      {
        label: "Multi-market growth support",
        detail:
          "Your experience supporting EMEA and APAC marketing initiatives gives you a believable foundation for regional execution.",
      },
      {
        label: "Commercial communication",
        detail:
          "You can translate business priorities into clear value propositions, which matters in cross-functional growth roles.",
      },
      {
        label: "Client/account exposure",
        detail:
          "Earlier SaaS account work gives you customer-facing credibility and shows comfort with adoption, retention and commercial problem-solving.",
      },
      {
        label: "Experimentation mindset",
        detail:
          "Campaign testing, AI-driven prospecting and new-channel evaluation show a practical test-and-learn approach.",
      },
    ],
    gaps: [
      {
        label: "Direct marketplace operations",
        detail:
          "The role may expect hands-on supply/demand balancing or platform operations experience, which is adjacent rather than direct in your background.",
      },
      {
        label: "Incentive design",
        detail:
          "You have campaign and growth experience, but limited explicit proof of designing financial incentives or ROI models.",
      },
      {
        label: "Advanced analytics tooling",
        detail:
          "If the role expects SQL or deep dashboard ownership, your CV should either show evidence or avoid overstating this area.",
      },
    ],
  },
  applicationStrategy: {
    shouldApply:
      "Apply if you are motivated by the role and can position yourself as a growth operator moving into marketplace operations. Do not present yourself as a pure operations specialist; lead with growth execution and cross-functional commercial impact.",
    positioningAdvice:
      "Frame the application around regional growth execution, stakeholder alignment, performance reporting and your ability to convert insights into practical campaigns. Acknowledge the marketplace gap indirectly by emphasizing adjacent SaaS/platform and e-commerce exposure.",
    whatToEmphasize: [
      "3x lead-generation improvement and €1.6M revenue impact from international B2B campaigns",
      "SaaS account-management experience with 50+ clients and adoption-focused work",
      "Experience evaluating new growth channels and translating market data into commercial action",
      "Cross-functional work with sales, technical experts, agencies and regional stakeholders",
    ],
    whatToAvoidOverclaiming: [
      "Do not claim deep marketplace operations ownership if you have not managed supply/demand mechanics directly.",
      "Do not overstate incentive-design experience; present it as an area you are ready to build on.",
      "Do not position yourself as a data scientist or SQL-heavy analyst unless the evidence is real.",
    ],
    screeningRisks: [
      "Recruiters may filter for direct marketplace, mobility or delivery-platform experience.",
      "The hiring team may expect stronger ownership of operational KPIs and incentive ROI.",
      "A generic marketing CV could undersell your commercial and growth relevance.",
    ],
  },
  cv: {
    profile:
      "Growth and commercial marketing professional with 7+ years of experience across B2B SaaS, digital demand generation, account management and international growth projects. Experienced in turning market insights, campaigns and stakeholder input into measurable lead, prospect and revenue outcomes across EMEA and APAC. Strong fit for growth roles requiring cross-functional execution, practical experimentation and clear commercial positioning.",
    keySkills: [
      "Growth Campaign Planning",
      "Demand Generation",
      "Commercial Marketing",
      "SaaS Account Management",
      "Stakeholder Management",
      "Performance Reporting",
      "Experimentation",
      "Market Research",
      "CRM Coordination",
      "E-commerce Operations",
    ],
    atsKeywords: [
      "growth strategy",
      "regional growth",
      "market expansion",
      "cross-functional collaboration",
      "campaign performance",
      "supply growth",
      "stakeholder management",
      "experimentation",
      "CRM",
      "market insights",
    ],
    experienceSections: [
      {
        role: "Marketing Communications Manager · International B2B Materials Business",
        bullets: [
          "Supported international digital marketing and demand-generation initiatives across EMEA, North America and APAC, contributing to 3x lead growth, 1,500+ new prospects and approximately €1.6M in revenue impact.",
          "Translated market needs, product capabilities and sales priorities into targeted campaigns, web content, LinkedIn advertising and localized go-to-market material.",
          "Created monthly performance updates summarizing lead and CRM data to help commercial teams understand market response and prioritize follow-up actions.",
          "Evaluated third-party lead-generation and sales channels, including industry aggregators and e-commerce opportunities, to identify new routes to market.",
        ],
      },
      {
        role: "Sales Manager / Account Manager · Food & Beverage SaaS",
        bullets: [
          "Managed 52 restaurant client accounts, advising customers on e-commerce operations, promotional offers, digital marketing services and platform adoption.",
          "Supported growth of a delivery-related feature, increasing processed requests from 500 to 3,000 in the first month.",
          "Worked consultatively with clients to improve order management, online storefront usage and adoption of add-on services including SEA, social media and SMS marketing.",
        ],
      },
    ],
    portalRoleDescriptions: [
      {
        role: "Growth & Commercial Marketing",
        description:
          "International growth marketer with experience in demand generation, commercial campaign execution, stakeholder alignment and performance reporting across B2B and SaaS environments.",
      },
      {
        role: "Platform / SaaS Account Growth",
        description:
          "Client-facing SaaS and e-commerce operator with experience managing 50+ accounts, improving platform adoption and supporting feature growth through consultative customer engagement.",
      },
    ],
    changeNotes: [
      "Positioned marketing experience as growth and commercial execution rather than only communications.",
      "Brought SaaS account-management experience higher because it supports the platform-growth angle.",
      "Avoided claiming direct marketplace operations ownership while still showing relevant adjacent proof.",
    ],
  },
  coverLetter: {
    full:
      "Dear Hiring Team,\n\nI am applying for the Regional Growth Manager role at Fictional Mobility Co. What draws me to this opportunity is the chance to work at the intersection of growth, operations and market execution — helping regional teams turn insights into practical actions that improve acquisition and marketplace performance.\n\nMy background combines B2B demand generation, SaaS account management and commercial growth support across international environments. At my current company, I supported digital marketing and demand-generation initiatives across EMEA, North America and APAC, contributing to 3x lead growth, 1,500+ new prospects and approximately €1.6M in revenue impact. Earlier, in a SaaS account-management role, I managed 52 client accounts and supported adoption of a delivery-related feature that increased processed requests from 500 to 3,000 in the first month.\n\nI would bring a practical growth mindset, strong stakeholder-management skills and the ability to connect market needs with clear execution. While my background is not a pure marketplace-operations profile, I believe my mix of commercial campaigns, SaaS adoption and cross-functional execution would allow me to contribute strongly to regional growth priorities.\n\nKind regards,\nYour Name",
    short:
      "Dear Hiring Team,\n\nI am applying for the Regional Growth Manager role. My background combines international B2B demand generation, SaaS account management and commercial growth support. I have contributed to 3x lead growth, 1,500+ new prospects and approximately €1.6M in revenue impact, and earlier managed 52 SaaS client accounts while supporting adoption of a delivery-related feature that grew processed requests from 500 to 3,000 in the first month.\n\nI would bring a practical growth mindset, strong stakeholder-management skills and the ability to translate market needs into focused execution.\n\nKind regards,\nYour Name",
    subjectLines: [
      "Application for Regional Growth Manager",
      "Regional Growth Manager — Growth and SaaS Background",
      "Application: Regional Growth Manager at Fictional Mobility Co.",
    ],
  },
  outreach: [
    {
      label: "Hiring manager",
      to: "Hiring manager or regional growth lead",
      body:
        "Hi — I saw the Regional Growth Manager opening and was interested because my background sits between growth campaigns, SaaS account adoption and international commercial execution. I have supported 3x lead growth across regional B2B markets and earlier managed 50+ SaaS client accounts. I’d value the chance to understand what success in this role looks like and share how I’d approach the first 90 days.",
    },
    {
      label: "Peer / similar profile",
      to: "Current growth or operations team member",
      body:
        "Hi — I’m exploring the Regional Growth Manager role and noticed your experience in growth/operations. My background is in international demand generation and SaaS account growth, so I’m trying to understand how the team balances campaign execution, operations and stakeholder management. Would you be open to a short exchange about what the role is really like?",
    },
    {
      label: "Short connection note",
      to: "LinkedIn connection request",
      body:
        "Hi — I’m applying for the Regional Growth Manager role and would love to connect. My background is in growth campaigns, SaaS adoption and international commercial execution.",
    },
  ],
  roadmap: [
    {
      n: 1,
      title: "Translate marketing proof into growth-operations language",
      detail:
        "The role likely values operational outcomes more than campaign activity. Reframe your strongest examples around acquisition, activation, market response and follow-up discipline.",
      action: "Rewrite 3 achievements using growth/operations KPIs rather than marketing-only language.",
    },
    {
      n: 2,
      title: "Build a lightweight incentive and ROI point of view",
      detail:
        "Incentive design is a likely gap. You do not need to pretend you have owned it, but you should show you understand the logic.",
      action: "Create a one-page sample plan explaining how you would test incentives, measure ROI and avoid waste.",
    },
    {
      n: 3,
      title: "Prepare a marketplace-operations bridge story",
      detail:
        "Your SaaS and e-commerce experience is adjacent. Make the bridge explicit so the hiring team does not have to infer it.",
      action: "Prepare a short interview story connecting client adoption, platform usage and growth outcomes.",
    },
  ],
};

export function createMockAnalysis(jobId: string, request?: AnalyzeRequest): AnalysisResult {
  const cleanTitle = request?.jobTitle?.trim();
  const cleanCompany = request?.company?.trim();

  return {
    ...mockAnalysis,
    jobId,
    jobTitle: cleanTitle || mockAnalysis.jobTitle,
    company: cleanCompany || mockAnalysis.company,
  };
}

export const mockImprovementPlan: ImprovementPlanResponse = {
  success: true,
  message: "Your role improvement plan has been generated.",
  plan: {
    roleSummary:
      "This role rewards candidates who can connect growth campaigns with operational execution. Your strongest path is to prove you can move from marketing-led growth into marketplace-style growth decisioning.",
    criticalGaps: [
      "Direct marketplace operations experience",
      "Incentive design and ROI modelling",
      "Advanced analytics or SQL-heavy reporting evidence",
    ],
    realityCheck: [
      "A course alone will not fix the marketplace-operations gap; you need a proof artifact or case exercise.",
      "The fastest credibility win is to reframe existing SaaS and campaign work around growth outcomes.",
      "If applying this week, prioritize positioning and interview stories over long courses.",
    ],
    recommendedActions: [
      {
        gap: "Marketplace operations",
        whyItMatters:
          "The hiring team may want evidence that you understand supply/demand dynamics and operational trade-offs.",
        bestActionType: "Hands-on case exercise",
        estimatedEffort: "3–5 hours",
        expectedImpact: "High credibility gain if included in outreach or interview prep.",
      },
      {
        gap: "Incentive design",
        whyItMatters:
          "Growth roles often require spending efficiently, not just launching campaigns.",
        bestActionType: "Short learning + one-page model",
        estimatedEffort: "2–4 hours",
        expectedImpact: "Medium to high, especially for interview confidence.",
      },
      {
        gap: "Analytics depth",
        whyItMatters:
          "If the job expects SQL or dashboard ownership, weak evidence can hurt screening.",
        bestActionType: "Free analytics refresher or dashboard project",
        estimatedEffort: "4–8 hours",
        expectedImpact: "Medium; useful if the job description strongly emphasizes analytics.",
      },
    ],
    freeOptions: [
      "Watch free YouTube explainers on marketplace growth loops and supply/demand balancing.",
      "Use free vendor documentation or tutorials to refresh dashboarding and funnel analysis concepts.",
      "Read public marketplace case studies and summarize one in your own 1-page growth plan.",
    ],
    paidOptions: [
      "A short paid course on marketplace strategy or growth analytics may be useful if it is under 5 hours and directly role-relevant.",
      "Avoid expensive certificates unless you are targeting similar roles over the next 3–6 months.",
      "If budget is limited, prioritize a practical proof project over a paid certificate.",
    ],
    practicalActions: [
      "Create a 1-page 30/60/90-day growth plan for the target role.",
      "Build a sample incentive test plan with expected metrics, guardrails and ROI logic.",
      "Rewrite your top 3 CV bullets using growth, adoption and operational outcome language.",
    ],
    roadmap: [
      {
        period: "30 days",
        title: "Reframe and prove the bridge",
        actions: [
          "Rewrite CV bullets around growth outcomes.",
          "Prepare a marketplace bridge story for interviews.",
          "Create one role-specific 30/60/90-day plan.",
        ],
      },
      {
        period: "60 days",
        title: "Build operational credibility",
        actions: [
          "Complete one short marketplace/growth analytics resource.",
          "Create an incentive-test case study.",
          "Ask 2–3 people in similar roles for feedback on your positioning.",
        ],
      },
      {
        period: "90 days",
        title: "Strengthen the role family fit",
        actions: [
          "Build a small portfolio page with your case exercise and growth plan.",
          "Target similar growth-operations roles to test market response.",
          "Refine your CV based on recruiter feedback.",
        ],
      },
    ],
    bestNextActions: [
      "Rewrite your CV summary so it says growth and commercial execution before marketing communications.",
      "Create a one-page incentive test plan for this role and use it in outreach or interview prep.",
    ],
  },
};

export const landingSteps = [
  {
    n: "1",
    title: "Paste the role",
    body: "Add your CV and the job description. Use pasted text for this prototype.",
  },
  {
    n: "2",
    title: "See your real fit",
    body: "Get an honest verdict, not just a keyword score.",
  },
  {
    n: "3",
    title: "Apply with strategy",
    body: "Receive positioning advice, tailored assets and a realistic improvement path.",
  },
];

export const deliverables = [
  "Honest fit verdict",
  "Evidence-based gap diagnosis",
  "Application strategy",
  "Tailored CV draft",
  "Cover letter and outreach drafts",
  "Role readiness roadmap",
];

export const loadingSteps = [
  "Analyzing role fit",
  "Finding match evidence",
  "Identifying candidacy gaps",
  "Building application strategy",
  "Drafting tailored assets",
];

export const intakeQuestions = [
  {
    key: "timeline" as const,
    label: "How soon do you want to improve your candidacy?",
    options: ["This week", "Within 2–4 weeks", "Within 1–3 months", "Longer-term"],
  },
  {
    key: "timeCommitment" as const,
    label: "How much time can you realistically invest over the next 4–8 weeks?",
    options: [
      "Less than 2 hours total",
      "1–2 hours per week",
      "3–5 hours per week",
      "5+ hours per week",
    ],
  },
  {
    key: "budget" as const,
    label: "What budget are you comfortable spending?",
    options: ["€0 only", "Up to €25", "€25–€100", "€100+"],
  },
  {
    key: "credibilityPath" as const,
    label: "What kind of recommendation would help you most?",
    options: [
      "Free resources and practical actions",
      "Short paid courses or certifications",
      "Hands-on projects / portfolio proof",
      "Best mix of free and paid options",
    ],
  },
];
