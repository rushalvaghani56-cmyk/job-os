"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JobFilters, JobStatus, SeniorityLevel, EmploymentType, LocationType, JobSource } from "./types"
import { statusCounts, sourceCounts, scoreDistribution } from "./mock-data"

interface FilterSidebarProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const statusLabels: Record<JobStatus, string> = {
  new: "New",
  scored: "Scored",
  content_ready: "Content Ready",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  skipped: "Skipped",
  bookmarked: "Bookmarked",
  ghosted: "Ghosted",
}

const seniorityLabels: Record<SeniorityLevel, string> = {
  intern: "Intern",
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  staff: "Staff",
  principal: "Principal",
  director: "Director",
  vp: "VP",
  c_level: "C-Level",
}

const employmentLabels: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  temporary: "Temporary",
}

const locationTypeLabels: Record<LocationType, string> = {
  remote: "Remote",
  remote_tz: "Remote (TZ restricted)",
  hybrid_flex: "Hybrid (Flexible)",
  hybrid_fixed: "Hybrid (Fixed)",
  onsite: "Onsite",
}

const sourceLabels: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  glassdoor: "Glassdoor",
  company_site: "Company Site",
  wellfound: "Wellfound",
  ycombinator: "Y Combinator",
}

interface FilterSectionProps {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}

function FilterSection({ title, count, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border py-3">
      <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-xs text-muted-foreground font-normal">({count})</span>
          )}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function ScoreHistogram({ distribution }: { distribution: typeof scoreDistribution }) {
  const maxCount = Math.max(...distribution.map(d => d.count))
  
  return (
    <div className="flex items-end gap-0.5 h-8 mb-2">
      {distribution.map((item, index) => (
        <div
          key={index}
          className="flex-1 bg-muted-foreground/20 rounded-t-sm transition-colors hover:bg-primary/30"
          style={{ height: `${(item.count / maxCount) * 100}%` }}
          title={`${item.range}: ${item.count} jobs`}
        />
      ))}
    </div>
  )
}

export function FilterSidebar({ filters, onFiltersChange, isCollapsed, onToggleCollapse }: FilterSidebarProps) {
  const [companySearch, setCompanySearch] = useState("")
  const [locationSearch, setLocationSearch] = useState("")

  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K] extends (infer T)[] ? T : never
  ) => {
    const currentArray = filters[key] as unknown[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as JobFilters[K])
  }

  const clearAllFilters = () => {
    onFiltersChange({
      scoreRange: [0, 100],
      confidenceRange: [0, 1],
      status: [],
      seniority: [],
      employmentType: [],
      locationType: [],
      locations: [],
      companies: [],
      salaryRange: [0, 500000],
      salaryCurrency: "USD",
      sources: [],
      dateRange: {},
      dreamCompanyOnly: false,
      hasContentOnly: false,
      showBlacklisted: false,
      showPotentialScam: false,
    })
  }

  const hasActiveFilters = 
    filters.scoreRange[0] > 0 ||
    filters.scoreRange[1] < 100 ||
    filters.status.length > 0 ||
    filters.seniority.length > 0 ||
    filters.employmentType.length > 0 ||
    filters.locationType.length > 0 ||
    filters.sources.length > 0 ||
    filters.dreamCompanyOnly ||
    filters.hasContentOnly

  if (isCollapsed) {
    return (
      <div className="w-10 border-r border-border bg-surface flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-[280px] border-r border-border bg-surface flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-0">
          {/* Score Range with Histogram */}
          <FilterSection title="Score" count={undefined} defaultOpen>
            <ScoreHistogram distribution={scoreDistribution} />
            <Slider
              value={filters.scoreRange}
              onValueChange={(value) => updateFilter("scoreRange", value as [number, number])}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{filters.scoreRange[0]}</span>
              <span>{filters.scoreRange[1]}</span>
            </div>
          </FilterSection>

          {/* Confidence Range */}
          <FilterSection title="Confidence" defaultOpen>
            <Slider
              value={[filters.confidenceRange[0] * 100, filters.confidenceRange[1] * 100]}
              onValueChange={(value) => updateFilter("confidenceRange", [value[0] / 100, value[1] / 100])}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{filters.confidenceRange[0].toFixed(2)}</span>
              <span>{filters.confidenceRange[1].toFixed(2)}</span>
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status" count={filters.status.length || undefined}>
            <div className="space-y-2">
              {(Object.keys(statusLabels) as JobStatus[]).map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => toggleArrayFilter("status", status)}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm cursor-pointer"
                    >
                      {statusLabels[status]}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {statusCounts[status]}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Seniority */}
          <FilterSection title="Seniority" count={filters.seniority.length || undefined}>
            <div className="space-y-2">
              {(Object.keys(seniorityLabels) as SeniorityLevel[]).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    id={`seniority-${level}`}
                    checked={filters.seniority.includes(level)}
                    onCheckedChange={() => toggleArrayFilter("seniority", level)}
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Label
                    htmlFor={`seniority-${level}`}
                    className="text-sm cursor-pointer"
                  >
                    {seniorityLabels[level]}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Employment Type */}
          <FilterSection title="Employment" count={filters.employmentType.length || undefined}>
            <div className="space-y-2">
              {(Object.keys(employmentLabels) as EmploymentType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`employment-${type}`}
                    checked={filters.employmentType.includes(type)}
                    onCheckedChange={() => toggleArrayFilter("employmentType", type)}
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Label
                    htmlFor={`employment-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {employmentLabels[type]}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Location Type */}
          <FilterSection title="Location Type" count={filters.locationType.length || undefined}>
            <div className="space-y-2">
              {(Object.keys(locationTypeLabels) as LocationType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`location-${type}`}
                    checked={filters.locationType.includes(type)}
                    onCheckedChange={() => toggleArrayFilter("locationType", type)}
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Label
                    htmlFor={`location-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {locationTypeLabels[type]}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Location Search */}
          <FilterSection title="Location">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </FilterSection>

          {/* Company Search */}
          <FilterSection title="Company">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </FilterSection>

          {/* Salary Range */}
          <FilterSection title="Salary">
            <div className="flex items-center gap-2 mb-3">
              <Select
                value={filters.salaryCurrency}
                onValueChange={(value) => updateFilter("salaryCurrency", value)}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Slider
              value={filters.salaryRange}
              onValueChange={(value) => updateFilter("salaryRange", value as [number, number])}
              min={0}
              max={500000}
              step={5000}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>${(filters.salaryRange[0] / 1000).toFixed(0)}k</span>
              <span>${(filters.salaryRange[1] / 1000).toFixed(0)}k</span>
            </div>
          </FilterSection>

          {/* Source */}
          <FilterSection title="Source" count={filters.sources.length || undefined}>
            <div className="space-y-2">
              {(Object.keys(sourceLabels) as JobSource[]).map((source) => (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={filters.sources.includes(source)}
                      onCheckedChange={() => toggleArrayFilter("sources", source)}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <Label
                      htmlFor={`source-${source}`}
                      className="text-sm cursor-pointer"
                    >
                      {sourceLabels[source]}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {sourceCounts[source]}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Toggles */}
          <FilterSection title="Quick Filters">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dream-company" className="text-sm cursor-pointer">
                  Dream Company Only
                </Label>
                <Switch
                  id="dream-company"
                  checked={filters.dreamCompanyOnly}
                  onCheckedChange={(checked) => updateFilter("dreamCompanyOnly", checked)}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="has-content" className="text-sm cursor-pointer">
                  Has Content
                </Label>
                <Switch
                  id="has-content"
                  checked={filters.hasContentOnly}
                  onCheckedChange={(checked) => updateFilter("hasContentOnly", checked)}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-blacklisted" className="text-sm cursor-pointer text-muted-foreground">
                  Show Blacklisted
                </Label>
                <Switch
                  id="show-blacklisted"
                  checked={filters.showBlacklisted}
                  onCheckedChange={(checked) => updateFilter("showBlacklisted", checked)}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-scam" className="text-sm cursor-pointer text-muted-foreground">
                  Potential Scam
                </Label>
                <Switch
                  id="show-scam"
                  checked={filters.showPotentialScam}
                  onCheckedChange={(checked) => updateFilter("showPotentialScam", checked)}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
