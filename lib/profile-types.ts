export interface ProfileStats {
  jobsFound: number;
  applications: number;
  interviews: number;
  responses: number;
  lastActive: string;
}

export interface ProfileCompleteness {
  percentage: number;
  missingItems: { label: string; boost: number }[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  targetRole: string;
  seniority: string;
  isActive: boolean;
  stats: ProfileStats;
  completeness: ProfileCompleteness;
  marketFitScore: number;
  createdAt: string;
  updatedAt: string;
}