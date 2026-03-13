"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionErrorBoundary } from "@/components/shared/section-error-boundary";
import {
  JobDetailHeader,
  OverviewTab,
  DescriptionTab,
  CompanyTab,
  ContentTab,
  TimelineTab,
  ContactsTab,
  NotesTab,
} from "@/components/jobs/JobDetail";
import { mockJobsDetailed } from "@/lib/mock-data/jobs";
import type { JobDetailed } from "@/lib/mock-data/jobs";
import {
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Building2,
  FolderOpen,
  Clock,
  Users,
  StickyNote,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "description", label: "Description", icon: FileText },
  { id: "company", label: "Company", icon: Building2 },
  { id: "content", label: "Content", icon: FolderOpen },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type TabId = (typeof tabs)[number]["id"];

function JobDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<JobDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  useEffect(() => {
    // Simulate API call
    const fetchJob = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundJob = mockJobsDetailed.find((j) => j.id === jobId);
      setJob(foundJob || null);
      setIsLoading(false);
    };

    fetchJob();
  }, [jobId]);

  const handleBack = () => {
    router.push("/jobs");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Button>
        <JobDetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Jobs
      </Button>

      {/* Header */}
      <SectionErrorBoundary name="Job Header">
        <JobDetailHeader job={job} />
      </SectionErrorBoundary>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabId)}
        className="w-full"
      >
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1.5 data-[state=active]:bg-background"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="m-0">
            <SectionErrorBoundary name="Overview">
              <OverviewTab job={job} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="description" className="m-0">
            <SectionErrorBoundary name="Description">
              <DescriptionTab job={job} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="company" className="m-0">
            <SectionErrorBoundary name="Company">
              <CompanyTab job={job} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="content" className="m-0">
            <SectionErrorBoundary name="Content">
              <ContentTab jobId={job.id} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="timeline" className="m-0">
            <SectionErrorBoundary name="Timeline">
              <TimelineTab jobId={job.id} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="contacts" className="m-0">
            <SectionErrorBoundary name="Contacts">
              <ContactsTab jobId={job.id} companyName={job.company.name} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="notes" className="m-0">
            <SectionErrorBoundary name="Notes">
              <NotesTab jobId={job.id} />
            </SectionErrorBoundary>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
