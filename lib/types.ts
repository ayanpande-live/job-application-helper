export type FitVerdict =
  | "strong_fit"
  | "good_fit"
  | "stretch_fit"
  | "low_probability"
  | "not_yet";

export type AnalysisSource = "openai" | "mock";

export interface AnalysisSectionSources {
  fit: AnalysisSource;
  strategy: AnalysisSource;
  cv: AnalysisSource;
  coverLetter: AnalysisSource;
  outreach: AnalysisSource;
  roadmap: AnalysisSource;
}
  
export interface AnalyzeRequest {
  cv: string;
  jobDescription: string;
  strengths?: string;
  improvements?: string;
  jobTitle?: string;
  company?: string;
}

export interface EvidenceItem {
  label: string;
  detail: string;
}

export interface FitAnalysis {
  score: number;
  verdict: FitVerdict;
  verdictLabel: string;
  summary: string;
  positioning: string;
  strengths: EvidenceItem[];
  gaps: EvidenceItem[];
}

export interface ApplicationStrategy {
  shouldApply: string;
  positioningAdvice: string;
  whatToEmphasize: string[];
  whatToAvoidOverclaiming: string[];
  screeningRisks: string[];
}

export interface ExperienceSection {
  role: string;
  bullets: string[];
}

export interface PortalRoleDescription {
  role: string;
  description: string;
}

export interface CvDraft {
  profile: string;
  keySkills: string[];
  atsKeywords: string[];
  experienceSections: ExperienceSection[];
  portalRoleDescriptions: PortalRoleDescription[];
  changeNotes: string[];
}

export interface CoverLetterDraft {
  full: string;
  short: string;
  subjectLines: string[];
}

export interface OutreachDraft {
  label: string;
  to: string;
  body: string;
}

export interface RoadmapItem {
  n: number;
  title: string;
  detail: string;
  action: string;
}

export interface AnalysisResult {
  jobId: string;
  jobTitle: string;
  company: string;
  fit: FitAnalysis;
  applicationStrategy: ApplicationStrategy;
  cv: CvDraft;
  coverLetter: CoverLetterDraft;
  outreach: OutreachDraft[];
  roadmap: RoadmapItem[];
  sectionSources?: AnalysisSectionSources;
}

export type RequestedAction =
  | "email_results"
  | "download_cv"
  | "improvement_plan"
  | "product_updates";

export interface EmailCaptureRequest {
  email: string;
  firstName?: string;
  jobId?: string;
  requestedAction: RequestedAction;
  consent: boolean;
}

export interface EmailCaptureResponse {
  success: boolean;
  message: string;
}

export type TimelinePreference =
  | "This week"
  | "Within 2–4 weeks"
  | "Within 1–3 months"
  | "Longer-term";

export type TimeCommitmentPreference =
  | "Less than 2 hours total"
  | "1–2 hours per week"
  | "3–5 hours per week"
  | "5+ hours per week";

export type BudgetPreference = "€0 only" | "Up to €25" | "€25–€100" | "€100+";

export type CredibilityPreference =
  | "Free resources and practical actions"
  | "Short paid courses or certifications"
  | "Hands-on projects / portfolio proof"
  | "Best mix of free and paid options";

export interface ImprovementAnalysisSnapshot {
  jobTitle: string;
  company: string;
  fit: FitAnalysis;
  applicationStrategy: ApplicationStrategy;
  cv: {
    profile: string;
    keySkills: string[];
    atsKeywords: string[];
    changeNotes: string[];
  };
}

export interface ImprovementPlanRequest {
  jobId: string;
  email?: string;
  timeline: TimelinePreference | string;
  timeCommitment: TimeCommitmentPreference | string;
  budget: BudgetPreference | string;
  credibilityPath: CredibilityPreference | string;
  analysisSnapshot: ImprovementAnalysisSnapshot;
}

export interface RecommendedAction {
  gap: string;
  whyItMatters: string;
  bestActionType: string;
  estimatedEffort: string;
  expectedImpact: string;
}

export interface RoadmapPhase {
  period: "30 days" | "60 days" | "90 days" | string;
  title: string;
  actions: string[];
}

export interface RoleImprovementPlan {
  roleSummary: string;
  criticalGaps: string[];
  realityCheck: string[];
  recommendedActions: RecommendedAction[];
  freeOptions: string[];
  paidOptions: string[];
  practicalActions: string[];
  roadmap: RoadmapPhase[];
  bestNextActions: string[];
}

export interface ImprovementPlanResponse {
  success: boolean;
  message: string;
  plan: RoleImprovementPlan;
}
