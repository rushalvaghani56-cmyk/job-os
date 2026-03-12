"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
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
import { mockJobDetail } from "@/components/jobs/job-detail-mock"
import type { JobStatus } from "@/components/jobs/types"

export default function JobDetailPage() {
  const params = useParams()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentTab, setCurrentTab] = useState("overview")

  // In a real app, fetch job by ID. For now, use mock data.
  const job = mockJobDetail

  const handleStatusChange = (status: JobStatus) => {
    // In a real app, update status in database
    console.log("Status changed to:", status)
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
