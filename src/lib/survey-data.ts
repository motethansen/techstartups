export const GROUPS = ["Group 1", "Group 2", "Group 3", "Group 4"] as const;
export type GroupName = (typeof GROUPS)[number];

export const DIMENSIONS = [
  { key: "problemClarity", label: "Problem Clarity", description: "Is the problem real, specific, and significant?" },
  { key: "solutionFit", label: "Solution Fit", description: "Does the tech solution actually solve the problem?" },
  { key: "marketInsight", label: "Market Insight", description: "Do they understand the target customer deeply?" },
  { key: "growthThinking", label: "Growth Thinking", description: "Are growth drivers plausible and evidence-based?" },
  { key: "financingRationale", label: "Financing Rationale", description: "Does the financing mode fit the stage and context?" },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export interface GroupRanking {
  [dimensionKey: string]: number;
}

export interface SurveySubmission {
  evaluatorGroup: GroupName;
  ratings: Record<string, GroupRanking>; // targetGroup -> { dimensionKey: score }
  submittedAt: string;
}

export function getStoredSubmissions(): SurveySubmission[] {
  const data = localStorage.getItem("survey-submissions");
  return data ? JSON.parse(data) : [];
}

export function saveSubmission(submission: SurveySubmission) {
  const existing = getStoredSubmissions();
  existing.push(submission);
  localStorage.setItem("survey-submissions", JSON.stringify(existing));
}
