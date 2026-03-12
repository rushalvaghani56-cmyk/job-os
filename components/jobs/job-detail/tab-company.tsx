"use client"

import { 
  Building2, 
  DollarSign, 
  Heart, 
  Code2, 
  Newspaper,
  Activity,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Users,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CompanyInfo, JobDetail } from "../types"

interface TabCompanyProps {
  companyInfo: CompanyInfo
  companyName: string
  applicationHistory: JobDetail["applicationHistory"]
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star 
          key={i} 
          className={cn(
            "size-4",
            i < Math.floor(rating) 
              ? "text-yellow-500 fill-yellow-500" 
              : i < rating 
                ? "text-yellow-500 fill-yellow-500/50"
                : "text-muted"
          )}
        />
      ))}
      <span className="ml-1.5 text-sm font-mono">{rating.toFixed(1)}</span>
    </div>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-4 text-green-500" />
    case "down":
      return <TrendingDown className="size-4 text-red-500" />
    default:
      return <Minus className="size-4 text-muted-foreground" />
  }
}

export function TabCompany({ companyInfo, companyName, applicationHistory }: TabCompanyProps) {
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Company Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {companyInfo.description}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-sm font-medium">{companyInfo.industry}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Company Size</p>
              <p className="text-sm font-medium">{companyInfo.size}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stage</p>
              <p className="text-sm font-medium">{companyInfo.stage}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Founded</p>
              <p className="text-sm font-medium">{companyInfo.founded}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <MapPin className="size-4" />
            <span>{companyInfo.hq}</span>
          </div>
        </CardContent>
      </Card>

      {/* Funding */}
      {companyInfo.funding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="size-4" />
              Funding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last Round</p>
                <p className="text-sm font-medium">{companyInfo.funding.lastRound}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Raised</p>
                <p className="text-sm font-medium">{companyInfo.funding.totalRaised}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Key Investors</p>
              <div className="flex flex-wrap gap-2">
                {companyInfo.funding.investors.map((investor) => (
                  <Badge key={investor} variant="secondary" className="text-xs">
                    {investor}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Culture & Ratings */}
      {companyInfo.culture && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="size-4" />
              Culture & Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Glassdoor Rating</span>
              <StarRating rating={companyInfo.culture.glassdoorRating} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Work-Life Balance</span>
              <StarRating rating={companyInfo.culture.workLifeBalance} />
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground">Pros</p>
              <div className="space-y-1">
                {companyInfo.culture.pros.map((pro, i) => (
                  <p key={i} className="text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                    <span className="mt-1">+</span>
                    {pro}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Cons</p>
              <div className="space-y-1">
                {companyInfo.culture.cons.map((con, i) => (
                  <p key={i} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                    <span className="mt-1">-</span>
                    {con}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Code2 className="size-4" />
            Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {companyInfo.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Inferred from job descriptions and engineering blog
          </p>
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="size-4" />
            Recent News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companyInfo.news.map((item, i) => (
              <div key={i} className="group">
                <Button variant="link" className="h-auto p-0 text-sm font-medium text-left justify-start" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ExternalLink className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="size-3" />
                  {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Signals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4" />
            Health Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Employee Growth
            </span>
            <span className={cn(
              "text-sm font-mono font-medium",
              companyInfo.healthSignals.employeeGrowth > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {companyInfo.healthSignals.employeeGrowth > 0 ? "+" : ""}{companyInfo.healthSignals.employeeGrowth}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Glassdoor Trend</span>
            <div className="flex items-center gap-1">
              <TrendIcon trend={companyInfo.healthSignals.glassdoorTrend} />
              <span className="text-sm capitalize">{companyInfo.healthSignals.glassdoorTrend}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Layoff Signals</span>
            {companyInfo.healthSignals.layoffSignals ? (
              <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs">
                <AlertTriangle className="size-3 mr-1" />
                Detected
              </Badge>
            ) : (
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                None
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your History */}
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your History at {companyName}</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationHistory.length > 0 ? (
            <div className="space-y-2">
              {applicationHistory.map((app) => (
                <div key={app.jobId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{app.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {app.outcome}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              This is your first application at {companyName}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
