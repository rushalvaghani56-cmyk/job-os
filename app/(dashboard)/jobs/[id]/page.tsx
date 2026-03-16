"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobHeader } from "@/components/jobs/job-detail/job-header"
import { TabOverview } from "@/components/jobs/job-detail/tab-overview"
import { TabDocuments } from "@/components/jobs/job-detail/tab-documents"
import { TabTimeline } from "@/components/jobs/job-detail/tab-timeline"
import { TabAnalytics } from "@/components/jobs/job-detail/tab-analytics"
import { TabCompany } from "@/components/jobs/job-detail/tab-company"
import { TabOutreach } from "@/components/jobs/job-detail/tab-outreach"
import { TabCopilot } from "@/components/jobs/job-detail/tab-copilot"
import { useJob } from "@/hooks/useJobs"
import type { Job as ApiJob } from "@/types/jobs"
import type { JobDetail, JobStatus } from "@/components/jobs/types"

/** Map API Job to the view-layer JobDetail shape used by detail sub-components */
function mapJobForDetailView(apiJob: ApiJob): JobDetail {
  const matchedSkills = apiJob.skill_matches
    ?.filter((s) => s.matched)
    .map((s) => s.skill) ?? []
  const missingSkills = apiJob.skill_matches
    ?.filter((s) => !s.matched)
    .map((s) => s.skill) ?? []

  const requiredSkills = apiJob.required_skills ?? []
  const preferredSkills = apiJob.preferred_skills ?? []

  const matchedRequirements = requiredSkills.filter((s) =>
    matchedSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())
  )
  const missingRequirements = requiredSkills.filter(
    (s) => !matchedSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())
  )
  const matchedPreferred = preferredSkills.filter((s) =>
    matchedSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())
  )
  const missingPreferred = preferredSkills.filter(
    (s) => !matchedSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())
  )

  const scoreBreakdown = apiJob.score_breakdown
    ? [
        { dimension: "Skills Match", score: Math.round(apiJob.score_breakdown.skills / 10), maxScore: 10 },
        { dimension: "Experience Level", score: Math.round(apiJob.score_breakdown.experience / 10), maxScore: 10 },
        { dimension: "Location Fit", score: Math.round(apiJob.score_breakdown.location / 10), maxScore: 10 },
        { dimension: "Salary Alignment", score: Math.round(apiJob.score_breakdown.salary / 10), maxScore: 10 },
        { dimension: "Company Culture", score: Math.round(apiJob.score_breakdown.culture / 10), maxScore: 10 },
        { dimension: "Growth Potential", score: Math.round(apiJob.score_breakdown.growth / 10), maxScore: 10 },
        { dimension: "Work-Life Balance", score: Math.round(apiJob.score_breakdown.work_life_balance / 10), maxScore: 10 },
        { dimension: "Stability", score: Math.round(apiJob.score_breakdown.stability / 10), maxScore: 10 },
      ]
    : []

  return {
    id: apiJob.id,
    title: apiJob.title,
    company: {
      name: apiJob.company,
      logo: apiJob.company_logo_url ?? undefined,
      isDreamCompany: apiJob.is_dream_company,
    },
    score: apiJob.match_score ?? 0,
    confidence: apiJob.score_confidence ?? 0,
    status: apiJob.status as JobDetail["status"],
    location: apiJob.location,
    locationType: (apiJob.work_location_type === "hybrid"
      ? "hybrid_flex"
      : apiJob.work_location_type) as JobDetail["locationType"],
    seniority: (apiJob.experience_level === "lead"
      ? "staff"
      : apiJob.experience_level === "executive"
        ? "director"
        : apiJob.experience_level) as JobDetail["seniority"],
    employmentType: (apiJob.employment_type === "internship"
      ? "temporary"
      : apiJob.employment_type) as JobDetail["employmentType"],
    salary: apiJob.salary_max
      ? {
          min: apiJob.salary_min ?? 0,
          max: apiJob.salary_max,
          currency: apiJob.salary_currency,
        }
      : undefined,
    postedAt: new Date(apiJob.posted_date ?? apiJob.discovered_at),
    source: apiJob.source as JobDetail["source"],
    skills: {
      matched: matchedSkills,
      missing: missingSkills,
    },
    decision:
      apiJob.decision === "auto_apply"
        ? "auto"
        : (apiJob.decision as JobDetail["decision"]) ?? "review",
    hasContent: false,
    description: apiJob.description ?? "",
    requirements: requiredSkills,
    preferredSkills,
    matchedRequirements,
    missingRequirements,
    matchedPreferred,
    missingPreferred,
    aiSummary: "",
    riskFactors: [],
    recommendedAction: "",
    scoreBreakdown,
    bonusPoints: 0,
    marketSalaryContext: "",
    interviewProbability: 0,
    documents: [],
    timeline: [],
    contacts: [],
    messages: [],
    companyInfo: {
      description: "",
      industry: "",
      size: "",
      stage: "",
      hq: "",
      founded: 0,
      funding: { lastRound: "", totalRaised: "", investors: [] },
      culture: { glassdoorRating: 0, workLifeBalance: 0, pros: [], cons: [] },
      techStack: [],
      news: [],
      healthSignals: { employeeGrowth: 0, glassdoorTrend: "stable", layoffSignals: false },
    },
    applicationHistory: [],
    externalUrl: apiJob.source_url ?? "",
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string | undefined
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentTab, setCurrentTab] = useState("overview")

  const { data: apiJob, isLoading, isError } = useJob(jobId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !apiJob) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
        <span>Failed to load job details. Please try again later.</span>
        <Button variant="outline" asChild>
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    )
  }

  const job = mapJobForDetailView(apiJob)

  const handleStatusChange = (status: JobStatus) => {
    // Status change would be persisted to database
  }

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Back Navigation */}
      <div className="px-6 py-3 border-b bg-background">
        <Button variant="ghost" size="sm" asChild className="rounded-lg -ml-2">
          <Link href="/jobs">
            <ArrowLeft className="size-4 mr-1.5" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      {/* Sticky Header */}
      <JobHeader
        job={job}
        onStatusChange={handleStatusChange}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={isBookmarked}
      />

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1">
        {/* Tab Bar - Underline Style */}
        <div className="border-b bg-background sticky top-0 z-10">
          <TabsList className="h-auto p-0 bg-transparent rounded-none justify-start gap-0 px-6">
            {[
              { value: "overview", label: "Overview" },
              { value: "documents", label: "Documents" },
              { value: "timeline", label: "Timeline" },
              { value: "analytics", label: "Analytics" },
              { value: "company", label: "Company" },
              { value: "outreach", label: "Outreach" },
              { value: "copilot", label: "AI Copilot" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-muted/30">
          <TabsContent value="overview" className="mt-0">
            <TabOverview job={job} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <TabDocuments documents={job.documents} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <TabTimeline events={job.timeline} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <TabAnalytics job={job} />
          </TabsContent>

          <TabsContent value="company" className="mt-0">
            <TabCompany
              companyInfo={job.companyInfo}
              companyName={job.company.name}
              applicationHistory={job.applicationHistory}
            />
          </TabsContent>

          <TabsContent value="outreach" className="mt-0">
            <TabOutreach contacts={job.contacts} messages={job.messages} />
          </TabsContent>

          <TabsContent value="copilot" className="mt-0">
            <TabCopilot job={job} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
