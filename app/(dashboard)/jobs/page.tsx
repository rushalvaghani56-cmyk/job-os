"use client"

import { useState, useMemo } from "react"
import {
  Search,
  LayoutGrid,
  Table2,
  List,
  ChevronDown,
  Filter,
  Bookmark,
  SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilterSidebar } from "@/components/jobs/filter-sidebar"
import { JobTableView } from "@/components/jobs/job-table-view"
import { JobCardView } from "@/components/jobs/job-card-view"
import { JobCompactView } from "@/components/jobs/job-compact-view"
import { BulkActionsBar } from "@/components/jobs/bulk-actions-bar"
import { mockJobs } from "@/components/jobs/mock-data"
import type { JobFilters, ViewMode, SortOption } from "@/components/jobs/types"

const defaultFilters: JobFilters = {
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
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "score_desc", label: "Score (High to Low)" },
  { value: "date_desc", label: "Date (Newest)" },
  { value: "company_asc", label: "Company (A-Z)" },
  { value: "salary_desc", label: "Salary (High to Low)" },
  { value: "status", label: "Status" },
]

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("score_desc")
  const [filters, setFilters] = useState<JobFilters>(defaultFilters)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...mockJobs]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.skills.matched.some((s) => s.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) {
      result = result.filter(
        (job) =>
          job.score >= filters.scoreRange[0] && job.score <= filters.scoreRange[1]
      )
    }

    if (filters.status.length > 0) {
      result = result.filter((job) => filters.status.includes(job.status))
    }

    if (filters.seniority.length > 0) {
      result = result.filter((job) => filters.seniority.includes(job.seniority))
    }

    if (filters.employmentType.length > 0) {
      result = result.filter((job) =>
        filters.employmentType.includes(job.employmentType)
      )
    }

    if (filters.locationType.length > 0) {
      result = result.filter((job) =>
        filters.locationType.includes(job.locationType)
      )
    }

    if (filters.sources.length > 0) {
      result = result.filter((job) => filters.sources.includes(job.source))
    }

    if (filters.dreamCompanyOnly) {
      result = result.filter((job) => job.company.isDreamCompany)
    }

    if (filters.hasContentOnly) {
      result = result.filter((job) => job.hasContent)
    }

    if (!filters.showBlacklisted) {
      result = result.filter((job) => !job.isBlacklisted)
    }

    if (!filters.showPotentialScam) {
      result = result.filter((job) => !job.isPotentialScam)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "score_desc":
          return b.score - a.score
        case "date_desc":
          return b.postedAt.getTime() - a.postedAt.getTime()
        case "company_asc":
          return a.company.name.localeCompare(b.company.name)
        case "salary_desc":
          const aSalary = a.salary?.max ?? 0
          const bSalary = b.salary?.max ?? 0
          return bSalary - aSalary
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, filters, sortOption])

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedJobs(selected ? filteredJobs.map((job) => job.id) : [])
  }

  const handleBulkAction = (action: string) => {
    // In a real app, this would trigger API calls
    console.log(`Bulk action: ${action}`, selectedJobs)
    setSelectedJobs([])
  }

  const activeFilterCount =
    (filters.status.length > 0 ? 1 : 0) +
    (filters.seniority.length > 0 ? 1 : 0) +
    (filters.employmentType.length > 0 ? 1 : 0) +
    (filters.locationType.length > 0 ? 1 : 0) +
    (filters.sources.length > 0 ? 1 : 0) +
    (filters.dreamCompanyOnly ? 1 : 0) +
    (filters.hasContentOnly ? 1 : 0) +
    (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100 ? 1 : 0)

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
          {/* View Toggle */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            className="shrink-0"
          >
            <ToggleGroupItem
              value="table"
              aria-label="Table view"
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Table2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="cards"
              aria-label="Card view"
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="compact"
              aria-label="Compact view"
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search titles, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Sort */}
          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Saved Searches */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Bookmark className="h-4 w-4" />
                Saved
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Remote Senior Roles</DropdownMenuItem>
              <DropdownMenuItem>Dream Companies</DropdownMenuItem>
              <DropdownMenuItem>High Score (80+)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Filter Toggle */}
          {sidebarCollapsed && (
            <Button
              variant="outline"
              onClick={() => setSidebarCollapsed(false)}
              className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-b border-border bg-muted/30">
          <span>
            Showing <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
            {searchQuery && (
              <span>
                {" "}for &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
              </span>
            )}
          </span>
          {selectedJobs.length > 0 && (
            <span className="font-medium text-primary">
              {selectedJobs.length} selected
            </span>
          )}
        </div>

        {/* Job List */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {viewMode === "table" && (
              <JobTableView
                jobs={filteredJobs}
                selectedJobs={selectedJobs}
                onSelectJob={handleSelectJob}
                onSelectAll={handleSelectAll}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            )}
            {viewMode === "cards" && (
              <JobCardView
                jobs={filteredJobs}
                selectedJobs={selectedJobs}
                onSelectJob={handleSelectJob}
              />
            )}
            {viewMode === "compact" && (
              <JobCompactView
                jobs={filteredJobs}
                selectedJobs={selectedJobs}
                onSelectJob={handleSelectJob}
                onSelectAll={handleSelectAll}
              />
            )}
          </div>
        </ScrollArea>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedJobs.length}
          onClear={() => setSelectedJobs([])}
          onScoreAll={() => handleBulkAction("score")}
          onGenerateAll={() => handleBulkAction("generate")}
          onBookmark={() => handleBulkAction("bookmark")}
          onSkip={() => handleBulkAction("skip")}
          onApply={() => handleBulkAction("apply")}
        />
      </div>
    </div>
  )
}
