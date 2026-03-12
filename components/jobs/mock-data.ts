import type { Job, JobStatus, SeniorityLevel, EmploymentType, LocationType, JobSource, DecisionType } from "./types"

const companies = [
  { name: "Stripe", logo: "/logos/stripe.svg", isDreamCompany: true },
  { name: "Vercel", logo: "/logos/vercel.svg", isDreamCompany: true },
  { name: "Linear", logo: "/logos/linear.svg", isDreamCompany: true },
  { name: "Notion", logo: "/logos/notion.svg", isDreamCompany: true },
  { name: "Figma", logo: "/logos/figma.svg", isDreamCompany: false },
  { name: "Slack", logo: "/logos/slack.svg", isDreamCompany: false },
  { name: "Spotify", logo: "/logos/spotify.svg", isDreamCompany: false },
  { name: "Airbnb", logo: "/logos/airbnb.svg", isDreamCompany: false },
  { name: "Netflix", logo: "/logos/netflix.svg", isDreamCompany: false },
  { name: "Meta", logo: "/logos/meta.svg", isDreamCompany: false },
  { name: "Google", logo: "/logos/google.svg", isDreamCompany: true },
  { name: "Apple", logo: "/logos/apple.svg", isDreamCompany: true },
  { name: "Microsoft", logo: "/logos/microsoft.svg", isDreamCompany: false },
  { name: "Amazon", logo: "/logos/amazon.svg", isDreamCompany: false },
  { name: "OpenAI", logo: "/logos/openai.svg", isDreamCompany: true },
]

const titles = [
  "Senior Frontend Engineer",
  "Full Stack Developer",
  "Staff Software Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Product Designer",
  "Senior Product Designer",
  "Backend Engineer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Solutions Architect",
  "Technical Lead",
  "Software Engineer II",
  "Platform Engineer",
]

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Remote - US",
  "Remote - Worldwide",
  "London, UK",
  "Berlin, Germany",
  "Toronto, Canada",
  "Singapore",
]

const statuses: JobStatus[] = ["new", "scored", "content_ready", "applied", "interview", "offer", "rejected", "skipped", "bookmarked", "ghosted"]
const seniorityLevels: SeniorityLevel[] = ["intern", "entry", "mid", "senior", "staff", "principal", "director", "vp", "c_level"]
const employmentTypes: EmploymentType[] = ["full_time", "part_time", "contract", "temporary"]
const locationTypes: LocationType[] = ["remote", "remote_tz", "hybrid_flex", "hybrid_fixed", "onsite"]
const sources: JobSource[] = ["linkedin", "indeed", "glassdoor", "company_site", "wellfound", "ycombinator"]
const decisions: DecisionType[] = ["auto", "review", "skip"]

const allSkills = [
  "React", "TypeScript", "Node.js", "Python", "Go", "Rust",
  "AWS", "GCP", "Kubernetes", "Docker", "PostgreSQL", "MongoDB",
  "GraphQL", "REST API", "Next.js", "Tailwind CSS", "Redis",
  "Terraform", "CI/CD", "System Design", "Microservices"
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomDate(daysAgo: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

function generateJob(id: number): Job {
  const score = Math.floor(Math.random() * 100)
  const matchedSkills = randomItems(allSkills, 3, 7)
  const remainingSkills = allSkills.filter(s => !matchedSkills.includes(s))
  const missingSkills = randomItems(remainingSkills, 1, 3)
  
  return {
    id: `job-${id}`,
    title: randomItem(titles),
    company: randomItem(companies),
    score,
    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    status: randomItem(statuses),
    location: randomItem(locations),
    locationType: randomItem(locationTypes),
    seniority: randomItem(seniorityLevels),
    employmentType: randomItem(employmentTypes),
    salary: Math.random() > 0.2 ? {
      min: Math.floor(Math.random() * 100 + 80) * 1000,
      max: Math.floor(Math.random() * 100 + 150) * 1000,
      currency: "USD",
      estimated: Math.random() > 0.5,
    } : undefined,
    postedAt: randomDate(30),
    source: randomItem(sources),
    skills: {
      matched: matchedSkills,
      missing: missingSkills,
    },
    decision: score >= 75 ? "auto" : score >= 50 ? "review" : "skip",
    hasContent: Math.random() > 0.3,
    isPotentialScam: Math.random() > 0.95,
    isBlacklisted: Math.random() > 0.98,
  }
}

// Generate 50 mock jobs
export const mockJobs: Job[] = Array.from({ length: 50 }, (_, i) => generateJob(i + 1))

// Generate score distribution for histogram (fake data showing bell curve)
export const scoreDistribution = [
  { range: "0-10", count: 45 },
  { range: "10-20", count: 78 },
  { range: "20-30", count: 134 },
  { range: "30-40", count: 189 },
  { range: "40-50", count: 256 },
  { range: "50-60", count: 312 },
  { range: "60-70", count: 287 },
  { range: "70-80", count: 198 },
  { range: "80-90", count: 112 },
  { range: "90-100", count: 56 },
]

// Status counts
export const statusCounts: Record<JobStatus, number> = {
  new: 342,
  scored: 567,
  content_ready: 234,
  applied: 89,
  interview: 23,
  offer: 5,
  rejected: 67,
  skipped: 156,
  bookmarked: 78,
  ghosted: 34,
}

// Source counts
export const sourceCounts: Record<JobSource, number> = {
  linkedin: 456,
  indeed: 234,
  glassdoor: 123,
  company_site: 312,
  wellfound: 89,
  ycombinator: 67,
}
