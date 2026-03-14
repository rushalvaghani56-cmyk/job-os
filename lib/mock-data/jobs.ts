import type { Job, ScoreBreakdown, SkillMatch, JobStatus, JobSource, EmploymentType, WorkLocationType, ExperienceLevel, JobDecision } from "@/types/jobs";

/**
 * Extended Job type with additional fields for UI
 */
export interface MockJob extends Job {
  /** AI-generated summary */
  ai_summary: string;
  /** Is potential scam */
  is_scam: boolean;
  /** Interview probability percentage */
  interview_probability: number;
  /** Company data for company tab */
  company_data: CompanyData;
  /** Seniority level display */
  seniority: string;
}

export interface CompanyData {
  description: string;
  industry: string;
  size: string;
  stage: string;
  hq_location: string;
  founded_year: number;
  last_funding_round: string;
  total_raised: string;
  key_investors: string[];
  glassdoor_rating: number;
  work_life_balance: number;
  ceo_approval: number;
  pros: string[];
  cons: string[];
  tech_stack: string[];
  recent_news: Array<{ title: string; date: string }>;
}

export interface TimelineEvent {
  id: string;
  icon: string;
  title: string;
  timestamp: string;
  actor: "System" | "AI" | "User";
  details?: string;
}

export interface JobDocument {
  id: string;
  filename: string;
  type: "resume" | "cover_letter" | "application_answers";
  variant: "A" | "B" | null;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface JobContact {
  id: string;
  name: string;
  title: string;
  company: string;
  warmth: "cold" | "warm" | "hot";
  channel: "linkedin" | "email";
  linkedin_url?: string;
  email?: string;
  messages: Array<{
    id: string;
    content: string;
    status: "draft" | "sent" | "opened" | "replied";
    sent_at: string | null;
  }>;
  next_follow_up: string | null;
}

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

// Generate score breakdown
function generateScoreBreakdown(overall: number): ScoreBreakdown {
  const variance = 15;
  const randomScore = () => Math.max(0, Math.min(100, overall + Math.floor(Math.random() * variance * 2) - variance));
  return {
    skills: randomScore(),
    experience: randomScore(),
    location: randomScore(),
    salary: randomScore(),
    culture: randomScore(),
    growth: randomScore(),
    work_life_balance: randomScore(),
    stability: randomScore(),
  };
}

// Generate skill matches
function generateSkillMatches(requiredSkills: string[], preferredSkills: string[]): SkillMatch[] {
  const matchedRequired = requiredSkills.slice(0, Math.floor(requiredSkills.length * 0.75));
  const missingRequired = requiredSkills.slice(Math.floor(requiredSkills.length * 0.75));
  const matchedPreferred = preferredSkills.slice(0, Math.floor(preferredSkills.length * 0.5));
  const missingPreferred = preferredSkills.slice(Math.floor(preferredSkills.length * 0.5));

  return [
    ...matchedRequired.map((skill) => ({
      skill,
      matched: true,
      proficiency: ["intermediate", "advanced", "expert"][Math.floor(Math.random() * 3)] as "intermediate" | "advanced" | "expert",
      importance: "required" as const,
      related_skills: [],
    })),
    ...missingRequired.map((skill) => ({
      skill,
      matched: false,
      proficiency: null,
      importance: "required" as const,
      related_skills: [],
    })),
    ...matchedPreferred.map((skill) => ({
      skill,
      matched: true,
      proficiency: ["beginner", "intermediate", "advanced"][Math.floor(Math.random() * 3)] as "beginner" | "intermediate" | "advanced",
      importance: "preferred" as const,
      related_skills: [],
    })),
    ...missingPreferred.map((skill) => ({
      skill,
      matched: false,
      proficiency: null,
      importance: "preferred" as const,
      related_skills: [],
    })),
  ];
}

// Company data generator
function generateCompanyData(company: string): CompanyData {
  const companyDataMap: Record<string, Partial<CompanyData>> = {
    Google: {
      description: "Google is a multinational technology company specializing in Internet-related services and products, including online advertising technologies, search engines, cloud computing, software, and hardware.",
      industry: "Technology",
      size: "100,000+",
      stage: "Public",
      hq_location: "Mountain View, CA",
      founded_year: 1998,
      last_funding_round: "IPO",
      total_raised: "N/A (Public)",
      key_investors: ["Sequoia Capital", "Kleiner Perkins"],
      glassdoor_rating: 4.4,
      work_life_balance: 4.2,
      ceo_approval: 92,
      pros: ["Great compensation and benefits", "Cutting-edge technology", "Smart colleagues"],
      cons: ["Large company bureaucracy", "Work-life balance can vary", "Impact can feel limited"],
      tech_stack: ["Go", "Java", "Python", "Kubernetes", "BigQuery", "TensorFlow"],
      recent_news: [
        { title: "Google announces new AI features for Search", date: daysAgo(5) },
        { title: "Cloud revenue grows 28% YoY", date: daysAgo(12) },
        { title: "New sustainability initiatives launched", date: daysAgo(20) },
      ],
    },
    Stripe: {
      description: "Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
      industry: "Fintech",
      size: "5,000-10,000",
      stage: "Late Stage",
      hq_location: "San Francisco, CA",
      founded_year: 2010,
      last_funding_round: "Series I",
      total_raised: "$8.7B",
      key_investors: ["Sequoia Capital", "Andreessen Horowitz", "General Catalyst"],
      glassdoor_rating: 4.3,
      work_life_balance: 4.0,
      ceo_approval: 94,
      pros: ["Exceptional engineering culture", "High-impact work", "Competitive compensation"],
      cons: ["Fast-paced environment", "High expectations", "Can be intense"],
      tech_stack: ["Ruby", "Go", "TypeScript", "React", "PostgreSQL", "AWS"],
      recent_news: [
        { title: "Stripe expands to 5 new countries", date: daysAgo(3) },
        { title: "New invoicing features launched", date: daysAgo(8) },
        { title: "Partnership with major banks announced", date: daysAgo(15) },
      ],
    },
    Meta: {
      description: "Meta builds technologies that help people connect, find communities, and grow businesses. From Facebook to Messenger to Instagram, Meta's family of apps helps billions of people around the world.",
      industry: "Technology",
      size: "50,000+",
      stage: "Public",
      hq_location: "Menlo Park, CA",
      founded_year: 2004,
      last_funding_round: "IPO",
      total_raised: "N/A (Public)",
      key_investors: ["Accel", "Greylock Partners"],
      glassdoor_rating: 4.1,
      work_life_balance: 4.0,
      ceo_approval: 85,
      pros: ["Excellent benefits", "High compensation", "Impactful products"],
      cons: ["Public scrutiny", "Fast-changing priorities", "Large org challenges"],
      tech_stack: ["Hack", "React", "Python", "C++", "PyTorch", "GraphQL"],
      recent_news: [
        { title: "Threads reaches 200M users", date: daysAgo(2) },
        { title: "AI investments doubled", date: daysAgo(10) },
        { title: "New VR headset announced", date: daysAgo(18) },
      ],
    },
  };

  const defaultData: CompanyData = {
    description: `${company} is a leading technology company focused on innovation and growth.`,
    industry: "Technology",
    size: "1,000-5,000",
    stage: "Series D",
    hq_location: "San Francisco, CA",
    founded_year: 2015,
    last_funding_round: "Series D",
    total_raised: "$450M",
    key_investors: ["Sequoia Capital", "Andreessen Horowitz"],
    glassdoor_rating: 4.2,
    work_life_balance: 3.8,
    ceo_approval: 89,
    pros: ["Great culture", "Competitive pay", "Growth opportunities"],
    cons: ["Fast-paced", "Sometimes unclear priorities", "Growing pains"],
    tech_stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
    recent_news: [
      { title: "Company raises new funding round", date: daysAgo(7) },
      { title: "Expanding to new markets", date: daysAgo(14) },
      { title: "New product launch announced", date: daysAgo(21) },
    ],
  };

  return { ...defaultData, ...companyDataMap[company] };
}

// AI summaries
const aiSummaries = [
  "This role is a strong match due to your distributed systems experience and Go proficiency. The team is well-regarded and the compensation is above market. Consider highlighting your experience with high-throughput systems in your application.",
  "Good alignment with your skills, though they require 5+ years React which slightly exceeds your 4 years. The company culture emphasizes ownership and the role offers significant growth potential. Recommend applying with emphasis on your TypeScript expertise.",
  "Excellent match for your profile. Your experience with payment systems directly aligns with their needs. The interview process typically involves 4-5 rounds including a system design deep dive. Strong recommendation to apply.",
  "Moderate match - skills align but location preference differs. They offer hybrid flexibility which may work for you. The team is growing rapidly and the tech stack matches your experience. Worth considering if open to occasional office visits.",
  "This role requires specific domain knowledge in ML infrastructure that you're building. The company is well-funded and the team includes several industry veterans. Consider this as a stretch opportunity for growth.",
];

// 30 Mock Jobs
export const mockJobs: MockJob[] = [
  {
    id: "job-001",
    user_id: "user-1",
    title: "Senior Backend Engineer",
    company: "Stripe",
    company_logo_url: null,
    company_website: "https://stripe.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 180000,
    salary_max: 250000,
    salary_currency: "USD",
    description: "Join our Payments team to build the infrastructure that powers millions of businesses worldwide. You'll work on distributed systems handling billions of transactions.",
    required_skills: ["Go", "Distributed Systems", "PostgreSQL", "AWS", "API Design"],
    preferred_skills: ["Ruby", "Kubernetes", "gRPC", "Redis"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://stripe.com/jobs/senior-backend",
    source: "company_career_page",
    external_id: "stripe-001",
    status: "content_ready",
    decision: "auto_apply",
    match_score: 91,
    score_breakdown: generateScoreBreakdown(91),
    skill_matches: generateSkillMatches(["Go", "Distributed Systems", "PostgreSQL", "AWS", "API Design"], ["Ruby", "Kubernetes", "gRPC", "Redis"]),
    profile_id: "profile-1",
    is_dream_company: true,
    priority: 1,
    score_confidence: 0.92,
    notes: null,
    deadline: daysAgo(-14),
    posted_date: daysAgo(3),
    discovered_at: daysAgo(2),
    scored_at: daysAgo(2),
    applied_at: null,
    tags: ["fintech", "payments", "backend"],
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 34,
    company_data: generateCompanyData("Stripe"),
    seniority: "Senior",
  },
  {
    id: "job-002",
    user_id: "user-1",
    title: "Staff ML Engineer",
    company: "Google",
    company_logo_url: null,
    company_website: "https://google.com",
    location: "Mountain View, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "lead",
    salary_min: 250000,
    salary_max: 380000,
    salary_currency: "USD",
    description: "Lead the development of next-generation ML models for Google Search. You'll work with cutting-edge research and ship to billions of users.",
    required_skills: ["Python", "TensorFlow", "Machine Learning", "Distributed Computing", "System Design"],
    preferred_skills: ["JAX", "MLOps", "Kubernetes", "C++"],
    years_experience_required: 8,
    education_requirement: "MS/PhD in CS, ML, or related field",
    source_url: "https://careers.google.com/staff-ml",
    source: "linkedin",
    external_id: "google-001",
    status: "scored",
    decision: "review",
    match_score: 87,
    score_breakdown: generateScoreBreakdown(87),
    skill_matches: generateSkillMatches(["Python", "TensorFlow", "Machine Learning", "Distributed Computing", "System Design"], ["JAX", "MLOps", "Kubernetes", "C++"]),
    profile_id: "profile-1",
    is_dream_company: true,
    priority: 1,
    score_confidence: 0.85,
    notes: "Stretch role - would need to study MLOps",
    deadline: daysAgo(-21),
    posted_date: daysAgo(5),
    discovered_at: daysAgo(4),
    scored_at: daysAgo(4),
    applied_at: null,
    tags: ["ml", "search", "ai"],
    created_at: daysAgo(4),
    updated_at: daysAgo(3),
    ai_summary: aiSummaries[4],
    is_scam: false,
    interview_probability: 28,
    company_data: generateCompanyData("Google"),
    seniority: "Staff",
  },
  {
    id: "job-003",
    user_id: "user-1",
    title: "Platform Engineer",
    company: "Meta",
    company_logo_url: null,
    company_website: "https://meta.com",
    location: "Menlo Park, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 200000,
    salary_max: 300000,
    salary_currency: "USD",
    description: "Build and scale the platform that supports Facebook, Instagram, and WhatsApp. Focus on developer experience and infrastructure reliability.",
    required_skills: ["Python", "Distributed Systems", "Kubernetes", "Linux", "CI/CD"],
    preferred_skills: ["Rust", "Chef/Puppet", "Terraform", "Prometheus"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://metacareers.com/platform",
    source: "linkedin",
    external_id: "meta-001",
    status: "applied",
    decision: "auto_apply",
    match_score: 89,
    score_breakdown: generateScoreBreakdown(89),
    skill_matches: generateSkillMatches(["Python", "Distributed Systems", "Kubernetes", "Linux", "CI/CD"], ["Rust", "Chef/Puppet", "Terraform", "Prometheus"]),
    profile_id: "profile-1",
    is_dream_company: true,
    priority: 1,
    score_confidence: 0.88,
    notes: null,
    deadline: null,
    posted_date: daysAgo(7),
    discovered_at: daysAgo(6),
    scored_at: daysAgo(6),
    applied_at: daysAgo(4),
    tags: ["platform", "infrastructure", "devex"],
    created_at: daysAgo(6),
    updated_at: daysAgo(4),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 31,
    company_data: generateCompanyData("Meta"),
    seniority: "Senior",
  },
  {
    id: "job-004",
    user_id: "user-1",
    title: "Senior Full Stack Engineer",
    company: "Vercel",
    company_logo_url: null,
    company_website: "https://vercel.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 170000,
    salary_max: 230000,
    salary_currency: "USD",
    description: "Help build the future of web development. Work on Next.js, our deployment platform, and developer tools used by millions.",
    required_skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
    preferred_skills: ["Rust", "Edge Computing", "Vercel Platform", "Turborepo"],
    years_experience_required: 4,
    education_requirement: null,
    source_url: "https://vercel.com/careers/full-stack",
    source: "company_career_page",
    external_id: "vercel-001",
    status: "interview",
    decision: "auto_apply",
    match_score: 94,
    score_breakdown: generateScoreBreakdown(94),
    skill_matches: generateSkillMatches(["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"], ["Rust", "Edge Computing", "Vercel Platform", "Turborepo"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.95,
    notes: "Phone screen completed, system design next",
    deadline: null,
    posted_date: daysAgo(14),
    discovered_at: daysAgo(12),
    scored_at: daysAgo(12),
    applied_at: daysAgo(10),
    tags: ["developer-tools", "frontend", "remote"],
    created_at: daysAgo(12),
    updated_at: daysAgo(2),
    ai_summary: aiSummaries[1],
    is_scam: false,
    interview_probability: 42,
    company_data: generateCompanyData("Vercel"),
    seniority: "Senior",
  },
  {
    id: "job-005",
    user_id: "user-1",
    title: "Frontend Tech Lead",
    company: "Notion",
    company_logo_url: null,
    company_website: "https://notion.so",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "lead",
    salary_min: 200000,
    salary_max: 280000,
    salary_currency: "USD",
    description: "Lead our frontend team building the future of productivity tools. Focus on performance, accessibility, and delightful user experiences.",
    required_skills: ["TypeScript", "React", "Performance Optimization", "Team Leadership", "System Design"],
    preferred_skills: ["Electron", "WebSockets", "IndexedDB", "CRDT"],
    years_experience_required: 6,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://notion.so/careers/frontend-lead",
    source: "linkedin",
    external_id: "notion-001",
    status: "content_ready",
    decision: "auto_apply",
    match_score: 85,
    score_breakdown: generateScoreBreakdown(85),
    skill_matches: generateSkillMatches(["TypeScript", "React", "Performance Optimization", "Team Leadership", "System Design"], ["Electron", "WebSockets", "IndexedDB", "CRDT"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.82,
    notes: null,
    deadline: daysAgo(-7),
    posted_date: daysAgo(4),
    discovered_at: daysAgo(3),
    scored_at: daysAgo(3),
    applied_at: null,
    tags: ["productivity", "frontend", "leadership"],
    created_at: daysAgo(3),
    updated_at: daysAgo(2),
    ai_summary: aiSummaries[1],
    is_scam: false,
    interview_probability: 36,
    company_data: generateCompanyData("Notion"),
    seniority: "Lead",
  },
  {
    id: "job-006",
    user_id: "user-1",
    title: "DevOps Engineer",
    company: "Datadog",
    company_logo_url: null,
    company_website: "https://datadog.com",
    location: "New York, NY",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "mid",
    salary_min: 140000,
    salary_max: 190000,
    salary_currency: "USD",
    description: "Build and maintain the infrastructure that monitors the world's applications. Work with massive scale and cutting-edge observability tools.",
    required_skills: ["Kubernetes", "Terraform", "AWS", "Python", "CI/CD"],
    preferred_skills: ["Go", "Prometheus", "Datadog", "ArgoCD"],
    years_experience_required: 3,
    education_requirement: null,
    source_url: "https://datadog.com/careers/devops",
    source: "indeed",
    external_id: "datadog-001",
    status: "new",
    decision: null,
    match_score: 76,
    score_breakdown: generateScoreBreakdown(76),
    skill_matches: generateSkillMatches(["Kubernetes", "Terraform", "AWS", "Python", "CI/CD"], ["Go", "Prometheus", "Datadog", "ArgoCD"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.78,
    notes: null,
    deadline: null,
    posted_date: daysAgo(1),
    discovered_at: hoursAgo(6),
    scored_at: null,
    applied_at: null,
    tags: ["observability", "devops", "infrastructure"],
    created_at: hoursAgo(6),
    updated_at: hoursAgo(6),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 29,
    company_data: generateCompanyData("Datadog"),
    seniority: "Mid-Level",
  },
  {
    id: "job-007",
    user_id: "user-1",
    title: "Data Engineer",
    company: "Shopify",
    company_logo_url: null,
    company_website: "https://shopify.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 160000,
    salary_max: 220000,
    salary_currency: "USD",
    description: "Build data pipelines that power insights for millions of merchants. Work with petabyte-scale data and real-time analytics.",
    required_skills: ["Python", "SQL", "Spark", "Airflow", "Data Modeling"],
    preferred_skills: ["dbt", "Kafka", "Snowflake", "Flink"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS, Statistics, or related field",
    source_url: "https://shopify.com/careers/data-engineer",
    source: "linkedin",
    external_id: "shopify-001",
    status: "scored",
    decision: "review",
    match_score: 72,
    score_breakdown: generateScoreBreakdown(72),
    skill_matches: generateSkillMatches(["Python", "SQL", "Spark", "Airflow", "Data Modeling"], ["dbt", "Kafka", "Snowflake", "Flink"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.75,
    notes: "Need to brush up on Spark",
    deadline: null,
    posted_date: daysAgo(8),
    discovered_at: daysAgo(7),
    scored_at: daysAgo(7),
    applied_at: null,
    tags: ["data", "e-commerce", "remote"],
    created_at: daysAgo(7),
    updated_at: daysAgo(6),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 25,
    company_data: generateCompanyData("Shopify"),
    seniority: "Senior",
  },
  {
    id: "job-008",
    user_id: "user-1",
    title: "Senior Full Stack Engineer",
    company: "Linear",
    company_logo_url: null,
    company_website: "https://linear.app",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 180000,
    salary_max: 240000,
    salary_currency: "USD",
    description: "Build the issue tracking tool that developers love. Focus on performance, offline-first architecture, and beautiful UI.",
    required_skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
    preferred_skills: ["Electron", "CRDT", "WebSockets", "Figma"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://linear.app/careers",
    source: "company_career_page",
    external_id: "linear-001",
    status: "bookmarked",
    decision: "review",
    match_score: 88,
    score_breakdown: generateScoreBreakdown(88),
    skill_matches: generateSkillMatches(["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"], ["Electron", "CRDT", "WebSockets", "Figma"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.86,
    notes: "Love their product, would be great fit",
    deadline: null,
    posted_date: daysAgo(10),
    discovered_at: daysAgo(9),
    scored_at: daysAgo(9),
    applied_at: null,
    tags: ["developer-tools", "productivity", "remote"],
    created_at: daysAgo(9),
    updated_at: daysAgo(5),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 38,
    company_data: generateCompanyData("Linear"),
    seniority: "Senior",
  },
  {
    id: "job-009",
    user_id: "user-1",
    title: "Backend Engineer",
    company: "Coinbase",
    company_logo_url: null,
    company_website: "https://coinbase.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 185000,
    salary_max: 260000,
    salary_currency: "USD",
    description: "Build the infrastructure for the future of finance. Work on secure, scalable systems handling billions in transactions.",
    required_skills: ["Go", "PostgreSQL", "Distributed Systems", "Security", "AWS"],
    preferred_skills: ["Blockchain", "Ruby", "Kubernetes", "gRPC"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://coinbase.com/careers/backend",
    source: "linkedin",
    external_id: "coinbase-001",
    status: "rejected",
    decision: "auto_apply",
    match_score: 83,
    score_breakdown: generateScoreBreakdown(83),
    skill_matches: generateSkillMatches(["Go", "PostgreSQL", "Distributed Systems", "Security", "AWS"], ["Blockchain", "Ruby", "Kubernetes", "gRPC"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.80,
    notes: "Rejected after final round",
    deadline: null,
    posted_date: daysAgo(30),
    discovered_at: daysAgo(28),
    scored_at: daysAgo(28),
    applied_at: daysAgo(25),
    tags: ["crypto", "fintech", "remote"],
    created_at: daysAgo(28),
    updated_at: daysAgo(3),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 0,
    company_data: generateCompanyData("Coinbase"),
    seniority: "Senior",
  },
  {
    id: "job-010",
    user_id: "user-1",
    title: "Senior Software Engineer",
    company: "Netflix",
    company_logo_url: null,
    company_website: "https://netflix.com",
    location: "Los Gatos, CA",
    work_location_type: "onsite",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 300000,
    salary_max: 450000,
    salary_currency: "USD",
    description: "Build the platform that delivers entertainment to 250M+ subscribers worldwide. Work on video encoding, content delivery, and personalization.",
    required_skills: ["Java", "Distributed Systems", "AWS", "Microservices", "System Design"],
    preferred_skills: ["Python", "Kafka", "Cassandra", "ML"],
    years_experience_required: 6,
    education_requirement: "Bachelor's/Master's in CS",
    source_url: "https://netflix.com/jobs/swe",
    source: "company_career_page",
    external_id: "netflix-001",
    status: "content_ready",
    decision: "review",
    match_score: 82,
    score_breakdown: generateScoreBreakdown(82),
    skill_matches: generateSkillMatches(["Java", "Distributed Systems", "AWS", "Microservices", "System Design"], ["Python", "Kafka", "Cassandra", "ML"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.79,
    notes: "High compensation but onsite requirement",
    deadline: null,
    posted_date: daysAgo(6),
    discovered_at: daysAgo(5),
    scored_at: daysAgo(5),
    applied_at: null,
    tags: ["streaming", "media", "high-comp"],
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 26,
    company_data: generateCompanyData("Netflix"),
    seniority: "Senior",
  },
  {
    id: "job-011",
    user_id: "user-1",
    title: "Software Engineer II",
    company: "Amazon",
    company_logo_url: null,
    company_website: "https://amazon.com",
    location: "Seattle, WA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "mid",
    salary_min: 145000,
    salary_max: 200000,
    salary_currency: "USD",
    description: "Join AWS to build cloud services used by millions. Work on distributed systems at massive scale.",
    required_skills: ["Java", "AWS", "Distributed Systems", "SQL", "Linux"],
    preferred_skills: ["Python", "DynamoDB", "Kubernetes", "CDK"],
    years_experience_required: 3,
    education_requirement: "Bachelor's in CS",
    source_url: "https://amazon.jobs/sde2",
    source: "linkedin",
    external_id: "amazon-001",
    status: "skipped",
    decision: "skip",
    match_score: 68,
    score_breakdown: generateScoreBreakdown(68),
    skill_matches: generateSkillMatches(["Java", "AWS", "Distributed Systems", "SQL", "Linux"], ["Python", "DynamoDB", "Kubernetes", "CDK"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.72,
    notes: "Not interested in relocating to Seattle",
    deadline: null,
    posted_date: daysAgo(12),
    discovered_at: daysAgo(11),
    scored_at: daysAgo(11),
    applied_at: null,
    tags: ["cloud", "aws", "big-tech"],
    created_at: daysAgo(11),
    updated_at: daysAgo(10),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 35,
    company_data: generateCompanyData("Amazon"),
    seniority: "Mid-Level",
  },
  {
    id: "job-012",
    user_id: "user-1",
    title: "Senior Backend Developer",
    company: "Razorpay",
    company_logo_url: null,
    company_website: "https://razorpay.com",
    location: "Bangalore, India",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 3500000,
    salary_max: 5500000,
    salary_currency: "INR",
    description: "Build payment infrastructure for India's businesses. Work on high-throughput systems processing millions of transactions daily.",
    required_skills: ["Go", "PostgreSQL", "Redis", "Microservices", "AWS"],
    preferred_skills: ["Kubernetes", "gRPC", "Kafka", "Python"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://razorpay.com/careers/backend",
    source: "company_career_page",
    external_id: "razorpay-001",
    status: "offer",
    decision: "auto_apply",
    match_score: 90,
    score_breakdown: generateScoreBreakdown(90),
    skill_matches: generateSkillMatches(["Go", "PostgreSQL", "Redis", "Microservices", "AWS"], ["Kubernetes", "gRPC", "Kafka", "Python"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.91,
    notes: "Offer received! Negotiating comp",
    deadline: daysAgo(-5),
    posted_date: daysAgo(35),
    discovered_at: daysAgo(33),
    scored_at: daysAgo(33),
    applied_at: daysAgo(30),
    tags: ["fintech", "payments", "india"],
    created_at: daysAgo(33),
    updated_at: daysAgo(1),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 100,
    company_data: generateCompanyData("Razorpay"),
    seniority: "Senior",
  },
  {
    id: "job-013",
    user_id: "user-1",
    title: "SWE III - Infrastructure",
    company: "Airbnb",
    company_logo_url: null,
    company_website: "https://airbnb.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 190000,
    salary_max: 270000,
    salary_currency: "USD",
    description: "Build the infrastructure powering the travel industry. Work on service mesh, observability, and developer productivity.",
    required_skills: ["Go", "Kubernetes", "AWS", "Terraform", "Service Mesh"],
    preferred_skills: ["Rust", "Envoy", "Prometheus", "gRPC"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS or equivalent",
    source_url: "https://airbnb.com/careers/infra",
    source: "linkedin",
    external_id: "airbnb-001",
    status: "interview",
    decision: "auto_apply",
    match_score: 86,
    score_breakdown: generateScoreBreakdown(86),
    skill_matches: generateSkillMatches(["Go", "Kubernetes", "AWS", "Terraform", "Service Mesh"], ["Rust", "Envoy", "Prometheus", "gRPC"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.84,
    notes: "Onsite scheduled for next week",
    deadline: null,
    posted_date: daysAgo(18),
    discovered_at: daysAgo(16),
    scored_at: daysAgo(16),
    applied_at: daysAgo(14),
    tags: ["travel", "infrastructure", "hybrid"],
    created_at: daysAgo(16),
    updated_at: daysAgo(2),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 55,
    company_data: generateCompanyData("Airbnb"),
    seniority: "Senior",
  },
  {
    id: "job-014",
    user_id: "user-1",
    title: "Senior Frontend Engineer",
    company: "Uber",
    company_logo_url: null,
    company_website: "https://uber.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 175000,
    salary_max: 250000,
    salary_currency: "USD",
    description: "Build the apps that move millions of people every day. Work on React Native, mapping, and real-time systems.",
    required_skills: ["TypeScript", "React", "React Native", "GraphQL", "Performance"],
    preferred_skills: ["Swift", "Kotlin", "WebGL", "Maps"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS",
    source_url: "https://uber.com/careers/frontend",
    source: "linkedin",
    external_id: "uber-001",
    status: "ghosted",
    decision: "auto_apply",
    match_score: 81,
    score_breakdown: generateScoreBreakdown(81),
    skill_matches: generateSkillMatches(["TypeScript", "React", "React Native", "GraphQL", "Performance"], ["Swift", "Kotlin", "WebGL", "Maps"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.78,
    notes: "No response after recruiter screen",
    deadline: null,
    posted_date: daysAgo(25),
    discovered_at: daysAgo(23),
    scored_at: daysAgo(23),
    applied_at: daysAgo(21),
    tags: ["mobility", "frontend", "mobile"],
    created_at: daysAgo(23),
    updated_at: daysAgo(7),
    ai_summary: aiSummaries[1],
    is_scam: false,
    interview_probability: 0,
    company_data: generateCompanyData("Uber"),
    seniority: "Senior",
  },
  {
    id: "job-015",
    user_id: "user-1",
    title: "Software Engineer",
    company: "Microsoft",
    company_logo_url: null,
    company_website: "https://microsoft.com",
    location: "Redmond, WA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "mid",
    salary_min: 140000,
    salary_max: 190000,
    salary_currency: "USD",
    description: "Join Azure to build cloud infrastructure at global scale. Work on networking, compute, and storage services.",
    required_skills: ["C#", ".NET", "Azure", "Distributed Systems", "SQL"],
    preferred_skills: ["Go", "Kubernetes", "Networking", "Linux"],
    years_experience_required: 3,
    education_requirement: "Bachelor's in CS",
    source_url: "https://careers.microsoft.com/swe",
    source: "linkedin",
    external_id: "microsoft-001",
    status: "new",
    decision: null,
    match_score: 64,
    score_breakdown: generateScoreBreakdown(64),
    skill_matches: generateSkillMatches(["C#", ".NET", "Azure", "Distributed Systems", "SQL"], ["Go", "Kubernetes", "Networking", "Linux"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.65,
    notes: null,
    deadline: null,
    posted_date: daysAgo(2),
    discovered_at: hoursAgo(12),
    scored_at: null,
    applied_at: null,
    tags: ["cloud", "azure", "big-tech"],
    created_at: hoursAgo(12),
    updated_at: hoursAgo(12),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 28,
    company_data: generateCompanyData("Microsoft"),
    seniority: "Mid-Level",
  },
  {
    id: "job-016",
    user_id: "user-1",
    title: "Backend Engineer - Payments",
    company: "Plaid",
    company_logo_url: null,
    company_website: "https://plaid.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 180000,
    salary_max: 250000,
    salary_currency: "USD",
    description: "Build the infrastructure that connects applications to financial institutions. Work on secure, reliable payment systems.",
    required_skills: ["Go", "PostgreSQL", "AWS", "API Design", "Security"],
    preferred_skills: ["Ruby", "Kafka", "Terraform", "Banking APIs"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://plaid.com/careers/backend",
    source: "company_career_page",
    external_id: "plaid-001",
    status: "scored",
    decision: "auto_apply",
    match_score: 87,
    score_breakdown: generateScoreBreakdown(87),
    skill_matches: generateSkillMatches(["Go", "PostgreSQL", "AWS", "API Design", "Security"], ["Ruby", "Kafka", "Terraform", "Banking APIs"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.85,
    notes: null,
    deadline: daysAgo(-10),
    posted_date: daysAgo(5),
    discovered_at: daysAgo(4),
    scored_at: daysAgo(4),
    applied_at: null,
    tags: ["fintech", "payments", "api"],
    created_at: daysAgo(4),
    updated_at: daysAgo(3),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 33,
    company_data: generateCompanyData("Plaid"),
    seniority: "Senior",
  },
  {
    id: "job-017",
    user_id: "user-1",
    title: "Full Stack Developer",
    company: "Atlassian",
    company_logo_url: null,
    company_website: "https://atlassian.com",
    location: "Sydney, Australia",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "mid",
    salary_min: 150000,
    salary_max: 200000,
    salary_currency: "AUD",
    description: "Build the tools that help teams work better together. Work on Jira, Confluence, and our platform.",
    required_skills: ["TypeScript", "React", "Java", "PostgreSQL", "REST APIs"],
    preferred_skills: ["Kotlin", "GraphQL", "AWS", "Microservices"],
    years_experience_required: 3,
    education_requirement: "Bachelor's in CS",
    source_url: "https://atlassian.com/careers/full-stack",
    source: "linkedin",
    external_id: "atlassian-001",
    status: "new",
    decision: null,
    match_score: 74,
    score_breakdown: generateScoreBreakdown(74),
    skill_matches: generateSkillMatches(["TypeScript", "React", "Java", "PostgreSQL", "REST APIs"], ["Kotlin", "GraphQL", "AWS", "Microservices"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.76,
    notes: null,
    deadline: null,
    posted_date: daysAgo(3),
    discovered_at: daysAgo(2),
    scored_at: null,
    applied_at: null,
    tags: ["developer-tools", "remote", "apac"],
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    ai_summary: aiSummaries[1],
    is_scam: false,
    interview_probability: 30,
    company_data: generateCompanyData("Atlassian"),
    seniority: "Mid-Level",
  },
  {
    id: "job-018",
    user_id: "user-1",
    title: "Senior Platform Engineer",
    company: "Twilio",
    company_logo_url: null,
    company_website: "https://twilio.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 165000,
    salary_max: 230000,
    salary_currency: "USD",
    description: "Build the communications platform used by millions of developers. Work on scalable, reliable infrastructure.",
    required_skills: ["Java", "AWS", "Kubernetes", "Microservices", "CI/CD"],
    preferred_skills: ["Go", "Terraform", "Service Mesh", "Chaos Engineering"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://twilio.com/careers/platform",
    source: "indeed",
    external_id: "twilio-001",
    status: "content_ready",
    decision: "review",
    match_score: 79,
    score_breakdown: generateScoreBreakdown(79),
    skill_matches: generateSkillMatches(["Java", "AWS", "Kubernetes", "Microservices", "CI/CD"], ["Go", "Terraform", "Service Mesh", "Chaos Engineering"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.77,
    notes: "Good remote culture",
    deadline: null,
    posted_date: daysAgo(9),
    discovered_at: daysAgo(8),
    scored_at: daysAgo(8),
    applied_at: null,
    tags: ["communications", "api", "remote"],
    created_at: daysAgo(8),
    updated_at: daysAgo(6),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 31,
    company_data: generateCompanyData("Twilio"),
    seniority: "Senior",
  },
  {
    id: "job-019",
    user_id: "user-1",
    title: "Staff Software Engineer",
    company: "Figma",
    company_logo_url: null,
    company_website: "https://figma.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "lead",
    salary_min: 220000,
    salary_max: 320000,
    salary_currency: "USD",
    description: "Build the collaborative design tool used by millions. Work on real-time collaboration, rendering, and performance.",
    required_skills: ["TypeScript", "C++", "WebGL", "Performance", "System Design"],
    preferred_skills: ["Rust", "WASM", "Canvas API", "CRDT"],
    years_experience_required: 8,
    education_requirement: "Bachelor's/Master's in CS",
    source_url: "https://figma.com/careers/staff",
    source: "company_career_page",
    external_id: "figma-001",
    status: "applied",
    decision: "auto_apply",
    match_score: 78,
    score_breakdown: generateScoreBreakdown(78),
    skill_matches: generateSkillMatches(["TypeScript", "C++", "WebGL", "Performance", "System Design"], ["Rust", "WASM", "Canvas API", "CRDT"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.74,
    notes: "Stretch role - great learning opportunity",
    deadline: null,
    posted_date: daysAgo(15),
    discovered_at: daysAgo(13),
    scored_at: daysAgo(13),
    applied_at: daysAgo(11),
    tags: ["design-tools", "graphics", "real-time"],
    created_at: daysAgo(13),
    updated_at: daysAgo(8),
    ai_summary: aiSummaries[4],
    is_scam: false,
    interview_probability: 22,
    company_data: generateCompanyData("Figma"),
    seniority: "Staff",
  },
  {
    id: "job-020",
    user_id: "user-1",
    title: "Backend Developer",
    company: "Slack",
    company_logo_url: null,
    company_website: "https://slack.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 175000,
    salary_max: 240000,
    salary_currency: "USD",
    description: "Build the workplace communication platform. Work on messaging, search, and real-time features.",
    required_skills: ["Java", "MySQL", "Redis", "Microservices", "AWS"],
    preferred_skills: ["Go", "Kafka", "Elasticsearch", "gRPC"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS",
    source_url: "https://slack.com/careers/backend",
    source: "linkedin",
    external_id: "slack-001",
    status: "applied",
    decision: "auto_apply",
    match_score: 84,
    score_breakdown: generateScoreBreakdown(84),
    skill_matches: generateSkillMatches(["Java", "MySQL", "Redis", "Microservices", "AWS"], ["Go", "Kafka", "Elasticsearch", "gRPC"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.82,
    notes: "Applied 5 days ago, waiting for response",
    deadline: null,
    posted_date: daysAgo(12),
    discovered_at: daysAgo(10),
    scored_at: daysAgo(10),
    applied_at: daysAgo(5),
    tags: ["messaging", "enterprise", "real-time"],
    created_at: daysAgo(10),
    updated_at: daysAgo(5),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 35,
    company_data: generateCompanyData("Slack"),
    seniority: "Senior",
  },
  // Adding more jobs with varied statuses and scores
  {
    id: "job-021",
    user_id: "user-1",
    title: "Junior Software Engineer",
    company: "TechStartup Inc",
    company_logo_url: null,
    company_website: "https://techstartup.io",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "entry",
    salary_min: 70000,
    salary_max: 95000,
    salary_currency: "USD",
    description: "Join our fast-growing startup. Great opportunity for junior developers to learn and grow.",
    required_skills: ["JavaScript", "React", "Node.js", "Git"],
    preferred_skills: ["TypeScript", "PostgreSQL", "AWS"],
    years_experience_required: 1,
    education_requirement: "Bachelor's in CS or bootcamp",
    source_url: "https://techstartup.io/careers",
    source: "indeed",
    external_id: "techstartup-001",
    status: "new",
    decision: null,
    match_score: 55,
    score_breakdown: generateScoreBreakdown(55),
    skill_matches: generateSkillMatches(["JavaScript", "React", "Node.js", "Git"], ["TypeScript", "PostgreSQL", "AWS"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.55,
    notes: null,
    deadline: null,
    posted_date: daysAgo(1),
    discovered_at: hoursAgo(3),
    scored_at: null,
    applied_at: null,
    tags: ["startup", "junior", "remote"],
    created_at: hoursAgo(3),
    updated_at: hoursAgo(3),
    ai_summary: "This role is below your experience level. Consider only if interested in a less demanding position with potentially more ownership.",
    is_scam: false,
    interview_probability: 65,
    company_data: generateCompanyData("TechStartup Inc"),
    seniority: "Junior",
  },
  {
    id: "job-022",
    user_id: "user-1",
    title: "Senior Developer - URGENT HIRE",
    company: "Unknown Corp",
    company_logo_url: null,
    company_website: null,
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 250000,
    salary_max: 400000,
    salary_currency: "USD",
    description: "URGENT! We need a senior developer ASAP. No interview needed! Start immediately. Payment via crypto.",
    required_skills: ["Any", "Programming"],
    preferred_skills: [],
    years_experience_required: 0,
    education_requirement: null,
    source_url: "https://unknowncorp.xyz/job",
    source: "indeed",
    external_id: "unknown-001",
    status: "new",
    decision: null,
    match_score: 48,
    score_breakdown: generateScoreBreakdown(48),
    skill_matches: [],
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.25,
    notes: "Flagged as potential scam",
    deadline: daysAgo(-1),
    posted_date: daysAgo(1),
    discovered_at: hoursAgo(8),
    scored_at: null,
    applied_at: null,
    tags: ["flagged"],
    created_at: hoursAgo(8),
    updated_at: hoursAgo(8),
    ai_summary: "WARNING: This posting shows multiple red flags typical of job scams. Recommend skipping.",
    is_scam: true,
    interview_probability: 0,
    company_data: generateCompanyData("Unknown Corp"),
    seniority: "Senior",
  },
  {
    id: "job-023",
    user_id: "user-1",
    title: "Blockchain Developer - Work from Home!!",
    company: "CryptoJobs Ltd",
    company_logo_url: null,
    company_website: null,
    location: "Remote",
    work_location_type: "remote",
    employment_type: "contract",
    experience_level: "mid",
    salary_min: 150000,
    salary_max: 300000,
    salary_currency: "USD",
    description: "Make $300k working from home! No experience needed! Just send us your personal details to get started.",
    required_skills: ["Enthusiasm"],
    preferred_skills: [],
    years_experience_required: 0,
    education_requirement: null,
    source_url: "https://cryptojobs.scam/apply",
    source: "indeed",
    external_id: "crypto-scam-001",
    status: "skipped",
    decision: "skip",
    match_score: 42,
    score_breakdown: generateScoreBreakdown(42),
    skill_matches: [],
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.15,
    notes: "Definite scam - skipped",
    deadline: null,
    posted_date: daysAgo(2),
    discovered_at: daysAgo(1),
    scored_at: daysAgo(1),
    applied_at: null,
    tags: ["flagged", "scam"],
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    ai_summary: "SCAM ALERT: This posting is a confirmed scam. Do not apply or share any personal information.",
    is_scam: true,
    interview_probability: 0,
    company_data: generateCompanyData("CryptoJobs Ltd"),
    seniority: "Mid-Level",
  },
  {
    id: "job-024",
    user_id: "user-1",
    title: "Senior Software Engineer",
    company: "Dropbox",
    company_logo_url: null,
    company_website: "https://dropbox.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 170000,
    salary_max: 245000,
    salary_currency: "USD",
    description: "Build the future of file sync and collaboration. Work on distributed storage and real-time sync.",
    required_skills: ["Python", "Go", "Distributed Systems", "AWS", "SQL"],
    preferred_skills: ["Rust", "Kubernetes", "gRPC", "SQLite"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS",
    source_url: "https://dropbox.com/careers/swe",
    source: "linkedin",
    external_id: "dropbox-001",
    status: "content_ready",
    decision: "auto_apply",
    match_score: 85,
    score_breakdown: generateScoreBreakdown(85),
    skill_matches: generateSkillMatches(["Python", "Go", "Distributed Systems", "AWS", "SQL"], ["Rust", "Kubernetes", "gRPC", "SQLite"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.83,
    notes: null,
    deadline: null,
    posted_date: daysAgo(6),
    discovered_at: daysAgo(5),
    scored_at: daysAgo(5),
    applied_at: null,
    tags: ["storage", "sync", "remote"],
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
    ai_summary: aiSummaries[0],
    is_scam: false,
    interview_probability: 32,
    company_data: generateCompanyData("Dropbox"),
    seniority: "Senior",
  },
  {
    id: "job-025",
    user_id: "user-1",
    title: "Backend Engineer",
    company: "Discord",
    company_logo_url: null,
    company_website: "https://discord.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 185000,
    salary_max: 260000,
    salary_currency: "USD",
    description: "Build the platform where communities thrive. Work on real-time messaging at massive scale.",
    required_skills: ["Elixir", "Python", "PostgreSQL", "Redis", "Distributed Systems"],
    preferred_skills: ["Rust", "Kafka", "Cassandra", "WebSockets"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://discord.com/careers/backend",
    source: "company_career_page",
    external_id: "discord-001",
    status: "scored",
    decision: "review",
    match_score: 77,
    score_breakdown: generateScoreBreakdown(77),
    skill_matches: generateSkillMatches(["Elixir", "Python", "PostgreSQL", "Redis", "Distributed Systems"], ["Rust", "Kafka", "Cassandra", "WebSockets"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.74,
    notes: "Would need to learn Elixir",
    deadline: null,
    posted_date: daysAgo(7),
    discovered_at: daysAgo(6),
    scored_at: daysAgo(6),
    applied_at: null,
    tags: ["gaming", "community", "real-time"],
    created_at: daysAgo(6),
    updated_at: daysAgo(5),
    ai_summary: aiSummaries[4],
    is_scam: false,
    interview_probability: 27,
    company_data: generateCompanyData("Discord"),
    seniority: "Senior",
  },
  {
    id: "job-026",
    user_id: "user-1",
    title: "Senior Site Reliability Engineer",
    company: "GitLab",
    company_logo_url: null,
    company_website: "https://gitlab.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 155000,
    salary_max: 225000,
    salary_currency: "USD",
    description: "Help make GitLab the most reliable DevOps platform. Work on infrastructure serving millions of developers.",
    required_skills: ["Kubernetes", "Terraform", "GCP", "Ruby", "Prometheus"],
    preferred_skills: ["Go", "Chef", "PostgreSQL", "Redis"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://gitlab.com/careers/sre",
    source: "company_career_page",
    external_id: "gitlab-001",
    status: "new",
    decision: null,
    match_score: 73,
    score_breakdown: generateScoreBreakdown(73),
    skill_matches: generateSkillMatches(["Kubernetes", "Terraform", "GCP", "Ruby", "Prometheus"], ["Go", "Chef", "PostgreSQL", "Redis"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.71,
    notes: null,
    deadline: null,
    posted_date: daysAgo(4),
    discovered_at: daysAgo(3),
    scored_at: null,
    applied_at: null,
    tags: ["devops", "remote", "sre"],
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    ai_summary: aiSummaries[3],
    is_scam: false,
    interview_probability: 30,
    company_data: generateCompanyData("GitLab"),
    seniority: "Senior",
  },
  {
    id: "job-027",
    user_id: "user-1",
    title: "Full Stack Engineer",
    company: "Supabase",
    company_logo_url: null,
    company_website: "https://supabase.com",
    location: "Remote",
    work_location_type: "remote",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 160000,
    salary_max: 220000,
    salary_currency: "USD",
    description: "Build the open source Firebase alternative. Work on PostgreSQL, real-time subscriptions, and developer tools.",
    required_skills: ["TypeScript", "PostgreSQL", "React", "Node.js", "Docker"],
    preferred_skills: ["Elixir", "Rust", "Deno", "Edge Functions"],
    years_experience_required: 4,
    education_requirement: null,
    source_url: "https://supabase.com/careers",
    source: "company_career_page",
    external_id: "supabase-001",
    status: "scored",
    decision: "auto_apply",
    match_score: 92,
    score_breakdown: generateScoreBreakdown(92),
    skill_matches: generateSkillMatches(["TypeScript", "PostgreSQL", "React", "Node.js", "Docker"], ["Elixir", "Rust", "Deno", "Edge Functions"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.90,
    notes: "Great match - love their open source approach",
    deadline: null,
    posted_date: daysAgo(3),
    discovered_at: daysAgo(2),
    scored_at: daysAgo(2),
    applied_at: null,
    tags: ["open-source", "database", "developer-tools"],
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 40,
    company_data: generateCompanyData("Supabase"),
    seniority: "Senior",
  },
  {
    id: "job-028",
    user_id: "user-1",
    title: "Backend Engineer - UK",
    company: "Monzo",
    company_logo_url: null,
    company_website: "https://monzo.com",
    location: "London, UK",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 80000,
    salary_max: 110000,
    salary_currency: "GBP",
    description: "Build the bank of the future. Work on real-time payments, security, and scale.",
    required_skills: ["Go", "Kubernetes", "AWS", "Microservices", "PostgreSQL"],
    preferred_skills: ["Kafka", "Cassandra", "Terraform", "gRPC"],
    years_experience_required: 5,
    education_requirement: null,
    source_url: "https://monzo.com/careers/backend",
    source: "linkedin",
    external_id: "monzo-001",
    status: "bookmarked",
    decision: "review",
    match_score: 86,
    score_breakdown: generateScoreBreakdown(86),
    skill_matches: generateSkillMatches(["Go", "Kubernetes", "AWS", "Microservices", "PostgreSQL"], ["Kafka", "Cassandra", "Terraform", "gRPC"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 2,
    score_confidence: 0.84,
    notes: "Would need UK work authorization",
    deadline: null,
    posted_date: daysAgo(8),
    discovered_at: daysAgo(7),
    scored_at: daysAgo(7),
    applied_at: null,
    tags: ["fintech", "banking", "uk"],
    created_at: daysAgo(7),
    updated_at: daysAgo(4),
    ai_summary: aiSummaries[2],
    is_scam: false,
    interview_probability: 28,
    company_data: generateCompanyData("Monzo"),
    seniority: "Senior",
  },
  {
    id: "job-029",
    user_id: "user-1",
    title: "Senior Backend Engineer",
    company: "Instacart",
    company_logo_url: null,
    company_website: "https://instacart.com",
    location: "San Francisco, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "senior",
    salary_min: 175000,
    salary_max: 245000,
    salary_currency: "USD",
    description: "Build the grocery delivery platform serving millions. Work on logistics, search, and recommendations.",
    required_skills: ["Ruby", "Rails", "PostgreSQL", "Redis", "AWS"],
    preferred_skills: ["Go", "Elasticsearch", "Kafka", "ML"],
    years_experience_required: 5,
    education_requirement: "Bachelor's in CS",
    source_url: "https://instacart.com/careers/backend",
    source: "linkedin",
    external_id: "instacart-001",
    status: "applied",
    decision: "auto_apply",
    match_score: 80,
    score_breakdown: generateScoreBreakdown(80),
    skill_matches: generateSkillMatches(["Ruby", "Rails", "PostgreSQL", "Redis", "AWS"], ["Go", "Elasticsearch", "Kafka", "ML"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.78,
    notes: "Applied last week",
    deadline: null,
    posted_date: daysAgo(14),
    discovered_at: daysAgo(12),
    scored_at: daysAgo(12),
    applied_at: daysAgo(8),
    tags: ["logistics", "e-commerce", "delivery"],
    created_at: daysAgo(12),
    updated_at: daysAgo(8),
    ai_summary: aiSummaries[1],
    is_scam: false,
    interview_probability: 30,
    company_data: generateCompanyData("Instacart"),
    seniority: "Senior",
  },
  {
    id: "job-030",
    user_id: "user-1",
    title: "Principal Engineer",
    company: "Snowflake",
    company_logo_url: null,
    company_website: "https://snowflake.com",
    location: "San Mateo, CA",
    work_location_type: "hybrid",
    employment_type: "full_time",
    experience_level: "executive",
    salary_min: 280000,
    salary_max: 400000,
    salary_currency: "USD",
    description: "Lead technical direction for our data cloud platform. Work on distributed systems at extreme scale.",
    required_skills: ["C++", "Distributed Systems", "Cloud Architecture", "Technical Leadership", "System Design"],
    preferred_skills: ["Java", "Data Warehousing", "Query Optimization", "Kubernetes"],
    years_experience_required: 12,
    education_requirement: "MS/PhD in CS",
    source_url: "https://snowflake.com/careers/principal",
    source: "linkedin",
    external_id: "snowflake-001",
    status: "new",
    decision: null,
    match_score: 65,
    score_breakdown: generateScoreBreakdown(65),
    skill_matches: generateSkillMatches(["C++", "Distributed Systems", "Cloud Architecture", "Technical Leadership", "System Design"], ["Java", "Data Warehousing", "Query Optimization", "Kubernetes"]),
    profile_id: "profile-1",
    is_dream_company: false,
    priority: 3,
    score_confidence: 0.62,
    notes: null,
    deadline: null,
    posted_date: daysAgo(5),
    discovered_at: daysAgo(4),
    scored_at: null,
    applied_at: null,
    tags: ["data", "cloud", "principal"],
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    ai_summary: "This role requires more experience than you currently have. Consider as a long-term career goal.",
    is_scam: false,
    interview_probability: 15,
    company_data: generateCompanyData("Snowflake"),
    seniority: "Principal",
  },
];

// Timeline events for a job
export function generateTimelineEvents(job: MockJob): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "event-1",
      icon: "Search",
      title: `Job discovered from ${job.source === "linkedin" ? "LinkedIn" : job.source === "indeed" ? "Indeed" : "Company Page"}`,
      timestamp: job.discovered_at,
      actor: "System",
    },
  ];

  if (job.scored_at) {
    events.push({
      id: "event-2",
      icon: "Target",
      title: `Scored ${job.match_score}/100 (${job.score_confidence && job.score_confidence > 0.8 ? "High" : job.score_confidence && job.score_confidence > 0.6 ? "Medium" : "Low"} confidence)`,
      timestamp: job.scored_at,
      actor: "AI",
    });
  }

  if (job.status !== "new" && job.status !== "scored") {
    const contentDate = new Date(job.scored_at || job.discovered_at);
    contentDate.setMinutes(contentDate.getMinutes() + 10);
    events.push({
      id: "event-3",
      icon: "FileText",
      title: "Resume + Cover Letter generated (2 variants)",
      timestamp: contentDate.toISOString(),
      actor: "AI",
    });

    events.push({
      id: "event-4",
      icon: "ClipboardCheck",
      title: `Added to Review Queue (Priority: ${job.priority === 1 ? "Dream Company" : job.priority === 2 ? "High" : "Normal"})`,
      timestamp: contentDate.toISOString(),
      actor: "System",
    });
  }

  if (job.applied_at) {
    const approvalDate = new Date(job.applied_at);
    approvalDate.setHours(approvalDate.getHours() - 1);
    events.push({
      id: "event-5",
      icon: "CheckCircle",
      title: "Resume Variant A approved",
      timestamp: approvalDate.toISOString(),
      actor: "User",
    });

    events.push({
      id: "event-6",
      icon: "Send",
      title: `Application submitted via ${job.source === "linkedin" ? "LinkedIn Easy Apply" : "Company ATS"}`,
      timestamp: job.applied_at,
      actor: "System",
    });

    const confirmDate = new Date(job.applied_at);
    confirmDate.setMinutes(confirmDate.getMinutes() + 25);
    events.push({
      id: "event-7",
      icon: "Mail",
      title: "Confirmation email detected",
      timestamp: confirmDate.toISOString(),
      actor: "System",
    });
  }

  if (job.status === "interview" || job.status === "offer") {
    const followUpDate = new Date(job.applied_at || job.discovered_at);
    followUpDate.setDate(followUpDate.getDate() + 5);
    events.push({
      id: "event-8",
      icon: "Mail",
      title: "Follow-up email sent (Day 5)",
      timestamp: followUpDate.toISOString(),
      actor: "System",
    });

    const replyDate = new Date(followUpDate);
    replyDate.setDate(replyDate.getDate() + 2);
    events.push({
      id: "event-9",
      icon: "Users",
      title: "Recruiter reply detected (positive)",
      timestamp: replyDate.toISOString(),
      actor: "System",
    });

    const interviewDate = new Date(replyDate);
    interviewDate.setHours(interviewDate.getHours() + 3);
    events.push({
      id: "event-10",
      icon: "Calendar",
      title: `Interview scheduled: ${job.status === "offer" ? "Offer call" : "Phone Screen"} ${job.status === "offer" ? "completed" : "upcoming"}`,
      timestamp: interviewDate.toISOString(),
      actor: "System",
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Documents for a job
export function generateDocuments(job: MockJob): JobDocument[] {
  if (job.status === "new" || !job.scored_at) {
    return [];
  }

  const baseDate = job.scored_at;
  return [
    {
      id: "doc-1",
      filename: `Resume_${job.company.replace(/\s+/g, "_")}_VariantA.pdf`,
      type: "resume",
      variant: "A",
      quality_score: Math.min(100, (job.match_score || 70) + Math.floor(Math.random() * 10)),
      created_at: baseDate,
      updated_at: job.applied_at || baseDate,
    },
    {
      id: "doc-2",
      filename: `Resume_${job.company.replace(/\s+/g, "_")}_VariantB.pdf`,
      type: "resume",
      variant: "B",
      quality_score: Math.min(100, (job.match_score || 70) + Math.floor(Math.random() * 8)),
      created_at: baseDate,
      updated_at: baseDate,
    },
    {
      id: "doc-3",
      filename: `CoverLetter_${job.company.replace(/\s+/g, "_")}.pdf`,
      type: "cover_letter",
      variant: null,
      quality_score: Math.min(100, (job.match_score || 70) + Math.floor(Math.random() * 12)),
      created_at: baseDate,
      updated_at: job.applied_at || baseDate,
    },
    {
      id: "doc-4",
      filename: `ApplicationAnswers_${job.company.replace(/\s+/g, "_")}.pdf`,
      type: "application_answers",
      variant: null,
      quality_score: Math.min(100, (job.match_score || 70) + Math.floor(Math.random() * 5)),
      created_at: baseDate,
      updated_at: baseDate,
    },
  ];
}

// Contacts for a job
export function generateContacts(job: MockJob): JobContact[] {
  if (job.status === "new" || job.status === "scored") {
    return [];
  }

  const contacts: JobContact[] = [
    {
      id: "contact-1",
      name: "Sarah Chen",
      title: "Senior Technical Recruiter",
      company: job.company,
      warmth: job.status === "interview" || job.status === "offer" ? "hot" : "warm",
      channel: "linkedin",
      linkedin_url: "https://linkedin.com/in/sarahchen",
      messages: [
        {
          id: "msg-1",
          content: `Hi Sarah, I recently applied for the ${job.title} position and wanted to express my strong interest...`,
          status: job.status === "interview" ? "replied" : "sent",
          sent_at: job.applied_at,
        },
      ],
      next_follow_up: job.status === "applied" ? daysAgo(-3) : null,
    },
    {
      id: "contact-2",
      name: "Michael Torres",
      title: "Engineering Manager",
      company: job.company,
      warmth: "cold",
      channel: "linkedin",
      linkedin_url: "https://linkedin.com/in/michaeltorres",
      messages: [],
      next_follow_up: null,
    },
  ];

  if (job.status === "interview" || job.status === "offer") {
    contacts.push({
      id: "contact-3",
      name: "Emily Watson",
      title: "HR Business Partner",
      company: job.company,
      warmth: "hot",
      channel: "email",
      email: "emily.watson@" + job.company.toLowerCase().replace(/\s+/g, "") + ".com",
      messages: [
        {
          id: "msg-2",
          content: "Thank you for taking the time to interview. I wanted to follow up on next steps...",
          status: "replied",
          sent_at: daysAgo(2),
        },
      ],
      next_follow_up: null,
    });
  }

  return contacts;
}

// Saved search presets
export const savedSearchPresets = [
  {
    id: "preset-1",
    name: "Remote Senior Backend",
    filters: {
      work_location_type: ["remote"],
      experience_level: ["senior", "lead"],
      min_score: 75,
      tags: ["backend"],
    },
  },
  {
    id: "preset-2",
    name: "Bay Area ML",
    filters: {
      location: ["San Francisco", "Mountain View", "Palo Alto"],
      tags: ["ml", "ai"],
      min_score: 70,
    },
  },
  {
    id: "preset-3",
    name: "EU Full-Stack",
    filters: {
      location: ["London", "Berlin", "Amsterdam"],
      tags: ["full-stack", "frontend", "backend"],
      min_score: 70,
    },
  },
];

// Helper to get job by ID
export function getJobById(id: string): MockJob | undefined {
  return mockJobs.find((job) => job.id === id);
}

// Helper to filter jobs
export function filterJobs(jobs: MockJob[], filters: Partial<{
  search: string;
  status: JobStatus[];
  minScore: number;
  maxScore: number;
  minConfidence: number;
  maxConfidence: number;
  workLocationType: WorkLocationType[];
  employmentType: EmploymentType[];
  experienceLevel: ExperienceLevel[];
  source: JobSource[];
  isDreamCompany: boolean;
  hasContent: boolean;
  company: string;
  postedWithin: "today" | "week" | "month" | "all";
}>): MockJob[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.required_skills.some((s) => s.toLowerCase().includes(searchLower)) ||
        job.preferred_skills.some((s) => s.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(job.status)) return false;
    }

    if (filters.minScore !== undefined && job.match_score !== null) {
      if (job.match_score < filters.minScore) return false;
    }

    if (filters.maxScore !== undefined && job.match_score !== null) {
      if (job.match_score > filters.maxScore) return false;
    }

    if (filters.minConfidence !== undefined && job.score_confidence !== null) {
      if (job.score_confidence < filters.minConfidence) return false;
    }

    if (filters.maxConfidence !== undefined && job.score_confidence !== null) {
      if (job.score_confidence > filters.maxConfidence) return false;
    }

    if (filters.workLocationType && filters.workLocationType.length > 0) {
      if (!filters.workLocationType.includes(job.work_location_type)) return false;
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      if (!filters.employmentType.includes(job.employment_type)) return false;
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      if (!filters.experienceLevel.includes(job.experience_level)) return false;
    }

    if (filters.source && filters.source.length > 0) {
      if (!filters.source.includes(job.source)) return false;
    }

    if (filters.isDreamCompany !== undefined) {
      if (job.is_dream_company !== filters.isDreamCompany) return false;
    }

    if (filters.hasContent) {
      const contentStatuses: JobStatus[] = ["content_ready", "applied", "interview", "offer", "rejected", "ghosted"];
      if (!contentStatuses.includes(job.status)) return false;
    }

    if (filters.company) {
      if (!job.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
    }

    if (filters.postedWithin && filters.postedWithin !== "all") {
      const postedDate = new Date(job.posted_date || job.discovered_at);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filters.postedWithin) {
        case "today":
          if (diffDays > 1) return false;
          break;
        case "week":
          if (diffDays > 7) return false;
          break;
        case "month":
          if (diffDays > 30) return false;
          break;
      }
    }

    return true;
  });
}

// Helper to sort jobs
export function sortJobs(jobs: MockJob[], sortBy: string, sortOrder: "asc" | "desc"): MockJob[] {
  return [...jobs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "score":
        comparison = (a.match_score || 0) - (b.match_score || 0);
        break;
      case "date":
        comparison = new Date(a.discovered_at).getTime() - new Date(b.discovered_at).getTime();
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "salary":
        comparison = (a.salary_max || 0) - (b.salary_max || 0);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}

// Get status counts
export function getStatusCounts(jobs: MockJob[]): Record<JobStatus, number> {
  const counts: Record<JobStatus, number> = {
    new: 0,
    scored: 0,
    content_ready: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    skipped: 0,
    bookmarked: 0,
    ghosted: 0,
  };

  jobs.forEach((job) => {
    counts[job.status]++;
  });

  return counts;
}

// Get unique companies
export function getUniqueCompanies(jobs: MockJob[]): string[] {
  return [...new Set(jobs.map((job) => job.company))].sort();
}

// Get unique locations
export function getUniqueLocations(jobs: MockJob[]): string[] {
  return [...new Set(jobs.map((job) => job.location))].sort();
}

// JobDetailed type for job detail page
export interface JobDetailed extends MockJob {
  company: {
    name: string;
    logo_url: string | null;
    website: string | null;
    description: string;
    industry: string;
    size: string;
    stage: string;
    hq_location: string;
    founded_year: number;
    last_funding_round: string;
    total_raised: string;
    key_investors: string[];
    glassdoor_rating: number;
    work_life_balance: number;
    ceo_approval: number;
    pros: string[];
    cons: string[];
    tech_stack: string[];
    recent_news: Array<{ title: string; date: string }>;
  };
  jd_summary: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  interview_process: string[];
  // Computed properties for UI
  skills_matched: string[];
  skills_missing: string[];
  company_size: number;
  days_since_posted: number;
  is_blacklisted: boolean;
  ai_decision: "strong_apply" | "consider" | "skip";
}

// Convert MockJob to JobDetailed
function toJobDetailed(job: MockJob): JobDetailed {
  // Calculate days since posted
  const postedDate = new Date(job.posted_date || job.discovered_at);
  const daysSincePosted = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Extract matched/missing skills from skill_matches
  const matchedSkills = job.skill_matches.filter(s => s.matched).map(s => s.skill);
  const missingSkills = job.skill_matches.filter(s => !s.matched).map(s => s.skill);
  
  // Determine AI decision based on score
  const aiDecision = job.match_score && job.match_score >= 85 
    ? "strong_apply" 
    : job.match_score && job.match_score >= 70 
      ? "consider" 
      : "skip";

  return {
    ...job,
    company: {
      name: job.company,
      logo_url: job.company_logo_url,
      website: job.company_website,
      ...job.company_data,
    },
    jd_summary: job.ai_summary,
    responsibilities: [
      "Design, build, and maintain scalable backend services and APIs",
      "Collaborate with cross-functional teams to define and implement new features",
      "Write clean, well-tested, and efficient code following best practices",
      "Participate in code reviews and provide constructive feedback",
      "Mentor junior engineers and contribute to technical documentation",
      "Investigate and resolve production issues with urgency and precision",
      "Drive technical decisions and architecture improvements",
    ],
    qualifications: [
      `${job.years_experience_required}+ years of professional software development experience`,
      `Strong proficiency in ${job.required_skills.slice(0, 3).join(", ")}`,
      "Experience with distributed systems and microservices architecture",
      "Excellent problem-solving skills and attention to detail",
      "Strong communication skills and ability to work collaboratively",
      job.education_requirement || "Bachelor's degree in Computer Science or equivalent experience",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Unlimited PTO policy",
      "401(k) matching",
      "Learning and development budget",
      "Home office setup allowance",
      "Wellness programs and gym membership",
    ],
    interview_process: [
      "Initial recruiter screen (30 min)",
      "Technical phone screen with engineer (45 min)",
      "Take-home coding assignment (2-4 hours)",
      "Virtual onsite: System design (1 hour)",
      "Virtual onsite: Coding interview (1 hour)",
      "Virtual onsite: Behavioral with hiring manager (45 min)",
      "Final round with team leads (30 min)",
    ],
    // Computed properties
    skills_matched: matchedSkills,
    skills_missing: missingSkills,
    company_size: [50, 200, 500, 1000, 5000, 10000][Math.floor(Math.random() * 6)],
    days_since_posted: daysSincePosted,
    is_blacklisted: false,
    ai_decision: aiDecision,
  };
}

// Export detailed jobs for job detail page
export const mockJobsDetailed: JobDetailed[] = mockJobs.map(toJobDetailed);
