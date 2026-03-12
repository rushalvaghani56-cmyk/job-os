"use client"

import { useState } from "react"
import { FileText, Download, RefreshCw, Upload, Eye, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { JobDocument } from "../types"

interface TabDocumentsProps {
  documents: JobDocument[]
}

const typeLabels: Record<string, string> = {
  resume_v1: "Resume V1",
  resume_v2: "Resume V2",
  cover_letter: "Cover Letter",
  portfolio: "Portfolio",
  references: "References",
}

const typeColors: Record<string, string> = {
  resume_v1: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  resume_v2: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  cover_letter: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  portfolio: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
  references: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
}

function QualityRing({ score }: { score: number }) {
  const radius = 18
  const strokeWidth = 3
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 90) return "stroke-green-500"
    if (score >= 70) return "stroke-amber-500"
    return "stroke-red-500"
  }

  return (
    <div className="relative size-12">
      <svg className="size-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          className={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold">
        {score}
      </span>
    </div>
  )
}

function DocumentCard({ doc }: { doc: JobDocument }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Quality Ring */}
          <QualityRing score={doc.qualityScore} />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium truncate">{doc.filename}</span>
              {doc.variant && (
                <Badge variant="outline" className="text-xs">
                  Variant {doc.variant}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", typeColors[doc.type])}>
                {typeLabels[doc.type]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Template: {doc.template}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => setIsPreviewing(!isPreviewing)}
              className={cn(isPreviewing && "text-primary")}
            >
              <Eye className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Download className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        {isPreviewing && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
            <div className="aspect-[8.5/11] bg-background rounded border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="size-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">PDF Preview</p>
                <p className="text-xs">Click to view full document</p>
              </div>
            </div>
          </div>
        )}

        {/* Version History */}
        {doc.versions.length > 1 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mt-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {doc.versions.length} versions
                </span>
                {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
                {doc.versions.map((v) => (
                  <div key={v.version} className="flex items-center justify-between text-xs py-1">
                    <span className="text-muted-foreground">Version {v.version}</span>
                    <span className="text-muted-foreground">{formatDate(v.date)}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

export function TabDocuments({ documents }: TabDocumentsProps) {
  return (
    <div className="p-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Generated Documents</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Upload className="size-4 mr-1.5" />
            Upload
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Download className="size-4 mr-1.5" />
            Download All ZIP
          </Button>
          <Button size="sm" className="rounded-lg">
            <RefreshCw className="size-4 mr-1.5" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <FileText className="size-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="text-base font-medium mb-1">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate tailored documents for this application
          </p>
          <Button className="rounded-lg">
            <RefreshCw className="size-4 mr-1.5" />
            Generate Documents
          </Button>
        </div>
      )}
    </div>
  )
}
