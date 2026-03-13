"use client";

import {
  FileText,
  Clock,
  ChevronRight,
  List,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobDetailed } from "@/lib/mock-data/jobs";

interface DescriptionTabProps {
  job: JobDetailed;
}

// Sample job description sections (in a real app, these would be parsed from the job)
function generateJobSections(job: JobDetailed) {
  return {
    about: `${job.company.name} is a leading technology company building the next generation of AI-powered solutions. We're looking for talented individuals to join our team and help shape the future of technology.`,
    responsibilities: [
      `Lead the development of ${job.title.toLowerCase().includes("senior") ? "complex" : "new"} features and systems`,
      "Collaborate with cross-functional teams including Product, Design, and QA",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and architectural discussions",
      "Mentor junior team members and contribute to team growth",
      "Help define technical standards and best practices",
    ],
    requirements: [
      `${job.seniority === "senior" ? "5+" : job.seniority === "mid" ? "3+" : "1+"} years of experience in software development`,
      ...(job.skills_matched || []).map((skill) => `Proficiency in ${skill}`),
      "Strong problem-solving and analytical skills",
      "Excellent communication and collaboration abilities",
      "Experience with agile development methodologies",
    ],
    niceToHave: [
      ...(job.skills_missing || []).map((skill) => `Experience with ${skill}`),
      "Contributions to open source projects",
      "Experience in a startup environment",
      "Previous remote work experience",
    ],
    benefits: [
      job.salary_min && job.salary_max
        ? `Competitive salary ($${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k)`
        : "Competitive compensation package",
      "Comprehensive health, dental, and vision insurance",
      "401(k) with company matching",
      "Unlimited PTO policy",
      job.work_location_type === "remote"
        ? "Fully remote work environment"
        : job.work_location_type === "hybrid"
          ? "Flexible hybrid work arrangement"
          : "Modern office space with amenities",
      "Professional development budget",
      "Home office stipend",
      "Regular team events and offsites",
    ],
  };
}

export function DescriptionTab({ job }: DescriptionTabProps) {
  const sections = generateJobSections(job);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Tabs defaultValue="formatted" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="formatted" className="gap-2">
              <List className="h-4 w-4" />
              Formatted
            </TabsTrigger>
            <TabsTrigger value="original" className="gap-2">
              <AlignLeft className="h-4 w-4" />
              Original
            </TabsTrigger>
          </TabsList>

          {/* Reading time estimate */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>~3 min read</span>
          </div>
        </div>

        <TabsContent value="formatted" className="mt-4 space-y-6">
          {/* About the Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-500" />
                About the Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {sections.about}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{job.seniority}</Badge>
                <Badge variant="outline">
                  {job.employment_type === "full_time"
                    ? "Full-time"
                    : job.employment_type === "part_time"
                      ? "Part-time"
                      : job.employment_type === "contract"
                        ? "Contract"
                        : "Internship"}
                </Badge>
                <Badge variant="outline">
                  {job.work_location_type === "remote"
                    ? "Remote"
                    : job.work_location_type === "hybrid"
                      ? "Hybrid"
                      : "On-site"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sections.responsibilities.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Must Have</h4>
                <ul className="space-y-2">
                  {sections.requirements.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-medium">Nice to Have</h4>
                <ul className="space-y-2">
                  {sections.niceToHave.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {sections.benefits.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="original" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h2>About {job.company.name}</h2>
                <p>{sections.about}</p>

                <h2>What You&apos;ll Do</h2>
                <ul>
                  {sections.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h2>What We&apos;re Looking For</h2>
                <h3>Requirements</h3>
                <ul>
                  {sections.requirements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h3>Nice to Have</h3>
                <ul>
                  {sections.niceToHave.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h2>Benefits</h2>
                <ul>
                  {sections.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <hr />
                <p className="text-muted-foreground">
                  <em>
                    {job.company.name} is an equal opportunity employer. We celebrate
                    diversity and are committed to creating an inclusive environment
                    for all employees.
                  </em>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
