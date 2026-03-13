"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { JobStatus, JobSource, EmploymentType, WorkLocationType, ExperienceLevel } from "@/types/jobs";

export interface JobFiltersState {
  scoreRange: [number, number];
  confidenceRange: [number, number];
  status: JobStatus[];
  seniority: ExperienceLevel[];
  employmentType: EmploymentType[];
  workLocationType: WorkLocationType[];
  company: string;
  source: JobSource[];
  postedWithin: "today" | "week" | "month" | "all";
  isDreamCompany: boolean;
  hasContent: boolean;
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  statusCounts: Record<JobStatus, number>;
  companies: string[];
  className?: string;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "scored", label: "Scored" },
  { value: "content_ready", label: "Content Ready" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "skipped", label: "Skipped" },
  { value: "bookmarked", label: "Bookmarked" },
  { value: "ghosted", label: "Ghosted" },
];

const seniorityOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const employmentOptions: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const locationTypeOptions: { value: WorkLocationType; label: string }[] = [
  { value: "remote", label: "Fully Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
];

const sourceOptions: { value: JobSource; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "company_career_page", label: "Company Page" },
  { value: "manual", label: "Manual" },
  { value: "referral", label: "Referral" },
];

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b py-3">
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function JobFilters({
  filters,
  onFiltersChange,
  statusCounts,
  companies,
  className,
}: JobFiltersProps) {
  const [companySearch, setCompanySearch] = useState("");

  const updateFilter = <K extends keyof JobFiltersState>(
    key: K,
    value: JobFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T,>(array: T[], value: T): T[] => {
    return array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];
  };

  const clearAllFilters = () => {
    onFiltersChange({
      scoreRange: [0, 100],
      confidenceRange: [0, 1],
      status: [],
      seniority: [],
      employmentType: [],
      workLocationType: [],
      company: "",
      source: [],
      postedWithin: "all",
      isDreamCompany: false,
      hasContent: false,
    });
  };

  const hasActiveFilters =
    filters.scoreRange[0] > 0 ||
    filters.scoreRange[1] < 100 ||
    filters.confidenceRange[0] > 0 ||
    filters.confidenceRange[1] < 1 ||
    filters.status.length > 0 ||
    filters.seniority.length > 0 ||
    filters.employmentType.length > 0 ||
    filters.workLocationType.length > 0 ||
    filters.company !== "" ||
    filters.source.length > 0 ||
    filters.postedWithin !== "all" ||
    filters.isDreamCompany ||
    filters.hasContent;

  const filteredCompanies = companies.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto px-2 py-1 text-xs text-primary"
          >
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="pr-4">
          {/* Score Range */}
          <FilterSection title="Score Range">
            <div className="space-y-3">
              <Slider
                value={filters.scoreRange}
                onValueChange={(value) => updateFilter("scoreRange", value as [number, number])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.scoreRange[0]}</span>
                <span>{filters.scoreRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          {/* Confidence Range */}
          <FilterSection title="Confidence">
            <div className="space-y-3">
              <Slider
                value={[filters.confidenceRange[0] * 100, filters.confidenceRange[1] * 100]}
                onValueChange={(value) =>
                  updateFilter("confidenceRange", [value[0] / 100, value[1] / 100])
                }
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round(filters.confidenceRange[0] * 100)}%</span>
                <span>{Math.round(filters.confidenceRange[1] * 100)}%</span>
              </div>
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status">
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={() =>
                        updateFilter("status", toggleArrayFilter(filters.status, option.value))
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {statusCounts[option.value] || 0}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Seniority */}
          <FilterSection title="Seniority">
            <div className="space-y-2">
              {seniorityOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={filters.seniority.includes(option.value)}
                    onCheckedChange={() =>
                      updateFilter(
                        "seniority",
                        toggleArrayFilter(filters.seniority, option.value)
                      )
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Employment Type */}
          <FilterSection title="Employment Type">
            <div className="space-y-2">
              {employmentOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={filters.employmentType.includes(option.value)}
                    onCheckedChange={() =>
                      updateFilter(
                        "employmentType",
                        toggleArrayFilter(filters.employmentType, option.value)
                      )
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Location Type */}
          <FilterSection title="Location Type">
            <div className="space-y-2">
              {locationTypeOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={filters.workLocationType.includes(option.value)}
                    onCheckedChange={() =>
                      updateFilter(
                        "workLocationType",
                        toggleArrayFilter(filters.workLocationType, option.value)
                      )
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Company */}
          <FilterSection title="Company">
            <div className="space-y-2">
              <Input
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="h-8 text-sm"
              />
              {filters.company && (
                <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs">
                  <span>{filters.company}</span>
                  <button
                    onClick={() => updateFilter("company", "")}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {companySearch && (
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {filteredCompanies.slice(0, 5).map((company) => (
                    <button
                      key={company}
                      onClick={() => {
                        updateFilter("company", company);
                        setCompanySearch("");
                      }}
                      className="block w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FilterSection>

          {/* Source */}
          <FilterSection title="Source">
            <div className="space-y-2">
              {sourceOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={filters.source.includes(option.value)}
                    onCheckedChange={() =>
                      updateFilter("source", toggleArrayFilter(filters.source, option.value))
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Date Range */}
          <FilterSection title="Posted Within">
            <RadioGroup
              value={filters.postedWithin}
              onValueChange={(value) =>
                updateFilter("postedWithin", value as JobFiltersState["postedWithin"])
              }
            >
              {[
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
                { value: "all", label: "All Time" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`date-${option.value}`} />
                  <Label htmlFor={`date-${option.value}`} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          {/* Toggles */}
          <FilterSection title="Other Filters">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dream-toggle" className="text-sm font-normal">
                  Dream Company Only
                </Label>
                <Switch
                  id="dream-toggle"
                  checked={filters.isDreamCompany}
                  onCheckedChange={(checked) => updateFilter("isDreamCompany", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="content-toggle" className="text-sm font-normal">
                  Has Content
                </Label>
                <Switch
                  id="content-toggle"
                  checked={filters.hasContent}
                  onCheckedChange={(checked) => updateFilter("hasContent", checked)}
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}
