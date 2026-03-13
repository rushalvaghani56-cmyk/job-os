"use client";

import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Building2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConfidenceBar } from "@/components/shared/confidence-bar";
import type { MockJob } from "@/lib/mock-data/jobs";

interface OverviewTabProps {
  job: MockJob;
}

// AI-generated summary reasons
const generateMatchReasons = (job: MockJob) => ({
  good: [
    `Strong skill match (${job.skills_matched?.length || 0}/${(job.skills_matched?.length || 0) + (job.skills_missing?.length || 0)} required skills)`,
    job.salary_max && job.salary_min
      ? `Salary within target range ($${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k)`
      : null,
    job.work_location_type === "remote" ? "Remote work available" : null,
    job.seniority === "senior" || job.seniority === "mid"
      ? `${job.seniority.charAt(0).toUpperCase() + job.seniority.slice(1)} level matches your experience`
      : null,
    job.company_size && job.company_size < 200
      ? "Startup environment (faster growth potential)"
      : null,
  ].filter(Boolean),
  bad: [
    job.skills_missing && job.skills_missing.length > 2
      ? `Missing ${job.skills_missing.length} key skills`
      : null,
    job.is_scam ? "Potential scam indicators detected" : null,
    job.is_blacklisted ? "Company is on your blacklist" : null,
    !job.salary_min ? "No salary information provided" : null,
    job.days_since_posted && job.days_since_posted > 30
      ? "Posted over 30 days ago"
      : null,
  ].filter(Boolean),
});

export function OverviewTab({ job }: OverviewTabProps) {
  const matchReasons = generateMatchReasons(job);

  return (
    <div className="space-y-6">
      {/* AI Match Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-violet-500" />
            AI Match Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ScoreBadge
                score={job.match_score || 0}
                size="lg"
                isDream={job.is_dream_company}
              />
              <div>
                <p className="text-sm font-medium">Overall Match Score</p>
                <p className="text-xs text-muted-foreground">
                  Based on your profile and preferences
                </p>
              </div>
            </div>
            {job.score_confidence && (
              <div className="text-right">
                <ConfidenceBar
                  confidence={job.score_confidence}
                  showLabel
                  className="w-20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Score confidence
                </p>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Good reasons */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                Why Apply
              </h4>
              <ul className="space-y-1">
                {matchReasons.good.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {reason}
                  </li>
                ))}
                {matchReasons.good.length === 0 && (
                  <li className="text-sm text-muted-foreground">No positive signals identified</li>
                )}
              </ul>
            </div>

            {/* Bad reasons */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <TrendingDown className="h-4 w-4" />
                Considerations
              </h4>
              <ul className="space-y-1">
                {matchReasons.bad.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {reason}
                  </li>
                ))}
                {matchReasons.bad.length === 0 && (
                  <li className="text-sm text-muted-foreground">No concerns identified</li>
                )}
              </ul>
            </div>
          </div>

          {/* AI Decision */}
          {job.ai_decision && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-medium">AI Recommendation</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm",
                    job.ai_decision === "strong_apply" &&
                      "border-green-500 bg-green-500/10 text-green-600",
                    job.ai_decision === "consider" &&
                      "border-blue-500 bg-blue-500/10 text-blue-600",
                    job.ai_decision === "skip" &&
                      "border-amber-500 bg-amber-500/10 text-amber-600"
                  )}
                >
                  {job.ai_decision === "strong_apply"
                    ? "Strongly Recommend"
                    : job.ai_decision === "consider"
                      ? "Consider Applying"
                      : "May Skip"}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Skills Match</span>
              <span className="font-medium">
                {job.skills_matched?.length || 0}/
                {(job.skills_matched?.length || 0) + (job.skills_missing?.length || 0)}
              </span>
            </div>
            <Progress
              value={
                ((job.skills_matched?.length || 0) /
                  ((job.skills_matched?.length || 0) +
                    (job.skills_missing?.length || 0))) *
                100
              }
              className="h-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Matched Skills */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                Skills You Have ({job.skills_matched?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_matched?.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
                {(!job.skills_matched || job.skills_matched.length === 0) && (
                  <span className="text-sm text-muted-foreground">No matched skills</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                Skills to Learn ({job.skills_missing?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_missing?.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
                {(!job.skills_missing || job.skills_missing.length === 0) && (
                  <span className="text-sm text-muted-foreground">No missing skills</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Salary */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salary Range</p>
                {job.salary_min && job.salary_max ? (
                  <p className="font-semibold">
                    ${(job.salary_min / 1000).toFixed(0)}k - $
                    {(job.salary_max / 1000).toFixed(0)}k
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not specified</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posted Date */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="font-semibold">
                  {job.days_since_posted === 0
                    ? "Today"
                    : job.days_since_posted === 1
                      ? "Yesterday"
                      : `${job.days_since_posted} days ago`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <MapPin className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{job.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Size */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Company Size</p>
                <p className="font-semibold">
                  {job.company_size
                    ? `${job.company_size.toLocaleString()} employees`
                    : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {(job.is_scam || job.is_blacklisted) && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">
                  Warning
                </h4>
                {job.is_scam && (
                  <p className="text-sm text-muted-foreground">
                    This job posting has been flagged as a potential scam.
                    Exercise caution before proceeding.
                  </p>
                )}
                {job.is_blacklisted && (
                  <p className="text-sm text-muted-foreground">
                    This company is on your blacklist.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
