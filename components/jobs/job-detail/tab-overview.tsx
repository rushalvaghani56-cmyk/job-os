"use client"

import { Sparkles, DollarSign, TrendingUp, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { JobDetail } from "../types"

interface TabOverviewProps {
  job: JobDetail
}

function ScoreBar({ dimension, score, maxScore }: { dimension: string; score: number; maxScore: number }) {
  const percentage = (score / maxScore) * 100
  const getColor = () => {
    if (score >= 7) return "bg-green-500"
    if (score >= 4) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-32 truncate">{dimension}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", getColor())} style={{ width: `${percentage}%` }} />
      </div>
      <span className={cn(
        "text-sm font-mono w-8 text-right",
        score >= 7 ? "text-green-600 dark:text-green-400" :
        score >= 4 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
      )}>
        {score}
      </span>
    </div>
  )
}

function SkillPill({ skill, matched, type }: { skill: string; matched: boolean; type: "required" | "preferred" }) {
  if (matched) {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
        {skill}
      </Badge>
    )
  }
  if (type === "required") {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30">
        {skill}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
      {skill}
    </Badge>
  )
}

export function TabOverview({ job }: TabOverviewProps) {
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: job.salary?.currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-5 gap-6 p-6">
      {/* Left Column - 60% */}
      <div className="col-span-3 flex flex-col gap-6">
        {/* AI Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" />
              AI Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {job.aiSummary}
            </p>
            {job.riskFactors.length > 0 && (
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2">Risk Factors</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {job.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Match */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Skills Match</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Required Skills */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Required</p>
              <div className="flex flex-wrap gap-2">
                {job.matchedRequirements.map((skill) => (
                  <SkillPill key={skill} skill={skill} matched type="required" />
                ))}
                {job.missingRequirements.map((skill) => (
                  <SkillPill key={skill} skill={skill} matched={false} type="required" />
                ))}
              </div>
            </div>
            {/* Preferred Skills */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Preferred</p>
              <div className="flex flex-wrap gap-2">
                {job.matchedPreferred.map((skill) => (
                  <SkillPill key={skill} skill={skill} matched type="preferred" />
                ))}
                {job.missingPreferred.map((skill) => (
                  <SkillPill key={skill} skill={skill} matched={false} type="preferred" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Job Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {job.description.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.replace("## ", "")}</h3>
                }
                if (line.startsWith("- ")) {
                  // Check if this skill is matched
                  const text = line.replace("- ", "")
                  const isMatched = job.skills.matched.some(skill => 
                    text.toLowerCase().includes(skill.toLowerCase())
                  )
                  return (
                    <li key={i} className={cn(
                      "text-sm mb-1",
                      isMatched && "underline decoration-green-500 decoration-2 underline-offset-2"
                    )}>
                      {text}
                    </li>
                  )
                }
                if (line.trim()) {
                  return <p key={i} className="text-sm text-muted-foreground mb-2">{line}</p>
                }
                return null
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - 40% */}
      <div className="col-span-2 flex flex-col gap-6">
        {/* Score Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {job.scoreBreakdown.map((item) => (
              <ScoreBar key={item.dimension} {...item} />
            ))}
            {job.bonusPoints > 0 && (
              <div className="pt-3 border-t mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bonus Points (Dream Company)</span>
                  <span className="font-mono text-primary">+{job.bonusPoints}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Salary */}
        {job.salary && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="size-4" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold font-mono">
                  {formatSalary(job.salary.min)} - {formatSalary(job.salary.max)}
                </span>
                {job.salary.estimated && (
                  <Badge variant="secondary" className="text-xs">Estimated</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {job.marketSalaryContext}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Interview Probability */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4" />
              Interview Probability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold font-mono text-primary">
                {job.interviewProbability}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on similar applications from users with your profile
            </p>
          </CardContent>
        </Card>

        {/* Content Quality */}
        {job.contentQuality && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCheck className="size-4" />
                Content Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resume Score</span>
                  <span className={cn(
                    "font-mono font-semibold",
                    job.contentQuality.resumeScore >= 90 ? "text-green-600 dark:text-green-400" :
                    job.contentQuality.resumeScore >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {job.contentQuality.resumeScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cover Letter Score</span>
                  <span className={cn(
                    "font-mono font-semibold",
                    job.contentQuality.coverLetterScore >= 90 ? "text-green-600 dark:text-green-400" :
                    job.contentQuality.coverLetterScore >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {job.contentQuality.coverLetterScore}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
