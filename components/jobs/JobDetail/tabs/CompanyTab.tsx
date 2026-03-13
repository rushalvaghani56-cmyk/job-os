"use client";

import {
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Linkedin,
  Twitter,
  Star,
  TrendingUp,
  Shield,
  AlertTriangle,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CompanyLogo } from "@/components/shared/company-logo";
import type { JobDetailed } from "@/lib/mock-data/jobs";

interface CompanyTabProps {
  job: JobDetailed;
}

// Generate mock company data
function generateCompanyData(job: JobDetailed) {
  return {
    name: job.company,
    industry: "Technology",
    founded: 2015 + Math.floor(Math.random() * 8),
    headquarters: job.location.split(",")[0] || "San Francisco, CA",
    website: `https://${job.company.toLowerCase().replace(/\s+/g, "")}.com`,
    linkedin: `https://linkedin.com/company/${job.company.toLowerCase().replace(/\s+/g, "-")}`,
    twitter: `https://twitter.com/${job.company.toLowerCase().replace(/\s+/g, "")}`,
    funding: {
      stage: ["Seed", "Series A", "Series B", "Series C", "Public"][
        Math.floor(Math.random() * 5)
      ],
      amount: `$${Math.floor(Math.random() * 500 + 10)}M`,
    },
    rating: {
      overall: 3.5 + Math.random() * 1.5,
      workLife: 3 + Math.random() * 2,
      culture: 3 + Math.random() * 2,
      compensation: 3 + Math.random() * 2,
      management: 3 + Math.random() * 2,
      reviewCount: Math.floor(Math.random() * 500 + 50),
    },
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Kubernetes",
    ],
    perks: [
      "Remote Work",
      "Unlimited PTO",
      "401k Match",
      "Health Insurance",
      "Learning Budget",
    ],
    recentNews: [
      {
        title: `${job.company} raises funding to expand AI capabilities`,
        date: "2 weeks ago",
      },
      {
        title: `${job.company} announces partnership with major tech company`,
        date: "1 month ago",
      },
    ],
    openRoles: Math.floor(Math.random() * 20 + 5),
  };
}

export function CompanyTab({ job }: CompanyTabProps) {
  // Use company data from job if available, otherwise generate
  const company = {
    name: job.company.name,
    industry: job.company.industry || "Technology",
    founded: job.company.founded_year,
    headquarters: job.company.hq_location,
    website: job.company.website || `https://${job.company.name.toLowerCase().replace(/\s+/g, "")}.com`,
    linkedin: `https://linkedin.com/company/${job.company.name.toLowerCase().replace(/\s+/g, "-")}`,
    twitter: `https://twitter.com/${job.company.name.toLowerCase().replace(/\s+/g, "")}`,
    funding: {
      stage: job.company.stage,
      amount: job.company.total_raised,
    },
    rating: {
      overall: job.company.glassdoor_rating,
      workLife: job.company.work_life_balance,
      culture: 3.8 + Math.random(),
      compensation: 4.0 + Math.random() * 0.5,
      management: 3.5 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 500 + 50),
    },
    techStack: job.company.tech_stack,
    perks: [
      "Remote Work",
      "Unlimited PTO",
      "401k Match",
      "Health Insurance",
      "Learning Budget",
    ],
    recentNews: job.company.recent_news,
    openRoles: Math.floor(Math.random() * 20 + 5),
    pros: job.company.pros,
    cons: job.company.cons,
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CompanyLogo
              company={job.company.name}
              logoUrl={job.company.logo_url}
              size="xl"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{company.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {company.industry}
                  </p>
                </div>
                {job.is_dream_company && (
                  <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    Dream Company
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.headquarters}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job.company_size?.toLocaleString() || "50-200"} employees
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Founded {company.founded}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {company.openRoles} open roles
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {job.is_blacklisted && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">
                  Blacklisted Company
                </h4>
                <p className="text-sm text-muted-foreground">
                  You added this company to your blacklist.{" "}
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Remove from blacklist
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Employee Ratings
              </span>
              <span className="text-2xl font-bold">
                {company.rating.overall.toFixed(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Work-Life Balance", value: company.rating.workLife },
                { label: "Culture & Values", value: company.rating.culture },
                { label: "Compensation", value: company.rating.compensation },
                { label: "Management", value: company.rating.management },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value.toFixed(1)}</span>
                  </div>
                  <Progress value={item.value * 20} className="h-1.5" />
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Based on {company.rating.reviewCount} reviews on Glassdoor
            </p>
          </CardContent>
        </Card>

        {/* Funding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Funding & Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Funding Stage</p>
                <p className="text-lg font-semibold">{company.funding.stage}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Raised</p>
                <p className="text-lg font-semibold">{company.funding.amount}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-medium">Recent News</h4>
              <div className="space-y-2">
                {company.recentNews.map((news, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{news.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground/60">
                      {news.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-blue-500" />
              Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Perks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-violet-500" />
              Perks & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.perks.map((perk) => (
                <Badge
                  key={perk}
                  variant="outline"
                  className="border-violet-500/30 bg-violet-500/10"
                >
                  {perk}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View More */}
      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          View All {company.openRoles} Open Positions at {company.name}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
