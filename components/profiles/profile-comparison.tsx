"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CandidateProfile } from "@/lib/profile-types";
import { cn } from "@/lib/utils";

interface ProfileComparisonProps {
  profiles: CandidateProfile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileComparison({
  profiles,
  open,
  onOpenChange,
}: ProfileComparisonProps) {
  const metrics = [
    {
      label: "Jobs Found",
      key: "jobsFound" as const,
      getValue: (p: CandidateProfile) => p.stats.jobsFound,
    },
    {
      label: "Applications",
      key: "applications" as const,
      getValue: (p: CandidateProfile) => p.stats.applications,
    },
    {
      label: "Interviews",
      key: "interviews" as const,
      getValue: (p: CandidateProfile) => p.stats.interviews,
    },
    {
      label: "Response Rate",
      key: "responseRate" as const,
      getValue: (p: CandidateProfile) => {
        if (p.stats.applications === 0) return 0;
        return Math.round((p.stats.responses / p.stats.applications) * 100);
      },
      format: (v: number) => `${v}%`,
    },
    {
      label: "Interview Rate",
      key: "interviewRate" as const,
      getValue: (p: CandidateProfile) => {
        if (p.stats.applications === 0) return 0;
        return Math.round((p.stats.interviews / p.stats.applications) * 100);
      },
      format: (v: number) => `${v}%`,
    },
    {
      label: "Market Fit",
      key: "marketFit" as const,
      getValue: (p: CandidateProfile) => p.marketFitScore,
      format: (v: number) => `${v}/100`,
    },
    {
      label: "Completeness",
      key: "completeness" as const,
      getValue: (p: CandidateProfile) => p.completeness.percentage,
      format: (v: number) => `${v}%`,
    },
  ];

  const getHighestValue = (key: string) => {
    const values = profiles.map((p) => {
      const metric = metrics.find((m) => m.key === key);
      return metric ? metric.getValue(p) : 0;
    });
    return Math.max(...values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Profile Comparison</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Metric</TableHead>
                {profiles.map((profile) => (
                  <TableHead key={profile.id} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{profile.name}</span>
                      {profile.isActive && (
                        <Badge className="bg-emerald-500 text-xs">Active</Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => {
                const highest = getHighestValue(metric.key);
                return (
                  <TableRow key={metric.key}>
                    <TableCell className="font-medium">{metric.label}</TableCell>
                    {profiles.map((profile) => {
                      const value = metric.getValue(profile);
                      const isHighest = value === highest && highest > 0;
                      const formatted = metric.format
                        ? metric.format(value)
                        : value.toString();
                      return (
                        <TableCell key={profile.id} className="text-center">
                          <span
                            className={cn(
                              "font-mono",
                              isHighest && "font-bold text-primary"
                            )}
                          >
                            {formatted}
                          </span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
