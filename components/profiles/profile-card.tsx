"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CompletenessRing } from "./completeness-ring";
import { CandidateProfile } from "@/lib/profile-types";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  ArrowRightLeft,
  Power,
  Trash2,
  Briefcase,
  FileText,
  Clock,
  TrendingUp,
} from "lucide-react";

interface ProfileCardProps {
  profile: CandidateProfile;
  onEdit?: (id: string) => void;
  onClone?: (id: string) => void;
  onSwitch?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProfileCard({
  profile,
  onEdit,
  onClone,
  onSwitch,
  onToggleActive,
  onDelete,
}: ProfileCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getMarketFitColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200 hover:shadow-md",
          profile.isActive && [
            "border-primary",
            "shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]",
            "dark:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]",
          ]
        )}
      >
        <CardContent className="p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-foreground">
                  {profile.name}
                </h3>
                <Badge
                  variant={profile.isActive ? "default" : "secondary"}
                  className={cn(
                    "shrink-0",
                    profile.isActive && "bg-emerald-500 hover:bg-emerald-500/90"
                  )}
                >
                  {profile.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.targetRole} · {profile.seniority}
              </p>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Profile actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit?.(profile.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onClone?.(profile.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Clone Profile
                </DropdownMenuItem>
                {!profile.isActive && (
                  <DropdownMenuItem onClick={() => onSwitch?.(profile.id)}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Switch to This
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleActive?.(profile.id)}>
                  <Power className="mr-2 h-4 w-4" />
                  {profile.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats Row */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span className="font-mono">{profile.stats.jobsFound}</span>
              <span>jobs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span className="font-mono">{profile.stats.applications}</span>
              <span>apps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{profile.stats.lastActive}</span>
            </div>
          </div>

          {/* Main Content: Ring + Info */}
          <div className="mt-5 flex items-center gap-5">
            <CompletenessRing percentage={profile.completeness.percentage} size={64} strokeWidth={6} />

            <div className="flex-1 space-y-3">
              {/* Missing Items */}
              {profile.completeness.missingItems.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Boost your profile:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.completeness.missingItems.slice(0, 2).map((item, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="cursor-pointer text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {item.label}{" "}
                        <span className="ml-1 text-emerald-500">+{item.boost}%</span>
                      </Badge>
                    ))}
                    {profile.completeness.missingItems.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.completeness.missingItems.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Market Fit Score */}
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <Badge className={cn("font-mono", getMarketFitColor(profile.marketFitScore))}>
                  {profile.marketFitScore}/100 market fit
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{profile.name}&rdquo;? This action
              cannot be undone. All associated job matches and applications will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete?.(profile.id);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
