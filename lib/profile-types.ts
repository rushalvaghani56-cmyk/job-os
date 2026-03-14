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

// Mock data for development - 3 profiles as per spec
export const mockProfiles: CandidateProfile[] = [
  {
    id: "1",
    name: "Backend Engineer Search",
    targetRole: "Senior Backend Engineer",
    seniority: "Senior",
    isActive: true,
    stats: {
      jobsFound: 47,
      applications: 12,
      interviews: 4,
      responses: 8,
      lastActive: "2h ago",
    },
    completeness: {
      percentage: 78,
      missingItems: [
        { label: "Add languages", boost: 5 },
        { label: "Work preferences", boost: 8 },
      ],
    },
    marketFitScore: 82,
    createdAt: "2026-01-15",
    updatedAt: "2026-03-12",
  },
  {
    id: "2",
    name: "ML Engineer Search",
    targetRole: "Machine Learning Engineer",
    seniority: "Mid-Level",
    isActive: false,
    stats: {
      jobsFound: 32,
      applications: 8,
      interviews: 2,
      responses: 5,
      lastActive: "3d ago",
    },
    completeness: {
      percentage: 62,
      missingItems: [
        { label: "Add portfolio", boost: 10 },
        { label: "Add certifications", boost: 7 },
        { label: "Work authorization", boost: 5 },
      ],
    },
    marketFitScore: 65,
    createdAt: "2026-01-10",
    updatedAt: "2026-03-08",
  },
  {
    id: "3",
    name: "DevOps Architect",
    targetRole: "DevOps Engineer",
    seniority: "Lead",
    isActive: false,
    stats: {
      jobsFound: 23,
      applications: 5,
      interviews: 1,
      responses: 3,
      lastActive: "1w ago",
    },
    completeness: {
      percentage: 45,
      missingItems: [
        { label: "Add work history", boost: 15 },
        { label: "Add skills", boost: 12 },
        { label: "Add education", boost: 8 },
      ],
    },
    marketFitScore: 52,
    createdAt: "2026-01-08",
    updatedAt: "2026-02-28",
  },
];
