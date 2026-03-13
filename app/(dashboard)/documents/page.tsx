"use client"

import { useState } from "react"
import {
  FolderIcon,
  FolderOpenIcon,
  FileTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UploadIcon,
  DownloadIcon,
  TrashIcon,
  EyeIcon,
  XIcon,
  FileIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// Types
interface FileItem {
  id: string
  name: string
  type: "pdf" | "docx" | "png" | "jpg"
  size: number
  uploadedAt: Date
  qualityScore?: number
  variant?: "A" | "B" | "C"
  thumbnailUrl?: string
}

interface FolderNode {
  id: string
  name: string
  type: "folder"
  children?: FolderNode[]
  files?: FileItem[]
  fileCount: number
}

// Mock data
const mockFolderTree: FolderNode[] = [
  {
    id: "master-resumes",
    name: "Master Resumes",
    type: "folder",
    fileCount: 3,
    files: [
      {
        id: "f1",
        name: "Master_Resume_2024.pdf",
        type: "pdf",
        size: 245000,
        uploadedAt: new Date("2024-01-15"),
        qualityScore: 92,
      },
      {
        id: "f2",
        name: "Master_Resume_Technical.pdf",
        type: "pdf",
        size: 198000,
        uploadedAt: new Date("2024-01-10"),
        qualityScore: 88,
      },
      {
        id: "f3",
        name: "Master_Resume_Leadership.docx",
        type: "docx",
        size: 156000,
        uploadedAt: new Date("2024-01-05"),
        qualityScore: 85,
      },
    ],
  },
  {
    id: "resume-templates",
    name: "Resume Templates",
    type: "folder",
    fileCount: 5,
    files: [
      {
        id: "t1",
        name: "Modern_Template.docx",
        type: "docx",
        size: 89000,
        uploadedAt: new Date("2023-12-20"),
      },
      {
        id: "t2",
        name: "Classic_Template.docx",
        type: "docx",
        size: 76000,
        uploadedAt: new Date("2023-12-18"),
      },
      {
        id: "t3",
        name: "Minimal_Template.docx",
        type: "docx",
        size: 62000,
        uploadedAt: new Date("2023-12-15"),
      },
      {
        id: "t4",
        name: "Creative_Template.docx",
        type: "docx",
        size: 112000,
        uploadedAt: new Date("2023-12-10"),
      },
      {
        id: "t5",
        name: "Executive_Template.docx",
        type: "docx",
        size: 98000,
        uploadedAt: new Date("2023-12-05"),
      },
    ],
  },
  {
    id: "profile-senior-fe",
    name: "Senior Frontend Engineer",
    type: "folder",
    fileCount: 12,
    children: [
      {
        id: "job-stripe",
        name: "Stripe - Staff Engineer",
        type: "folder",
        fileCount: 4,
        files: [
          {
            id: "s1",
            name: "Resume_Stripe_v1.pdf",
            type: "pdf",
            size: 234000,
            uploadedAt: new Date("2024-02-01"),
            qualityScore: 94,
            variant: "A",
          },
          {
            id: "s2",
            name: "Resume_Stripe_v2.pdf",
            type: "pdf",
            size: 238000,
            uploadedAt: new Date("2024-02-03"),
            qualityScore: 96,
            variant: "B",
          },
          {
            id: "s3",
            name: "CoverLetter_Stripe.pdf",
            type: "pdf",
            size: 145000,
            uploadedAt: new Date("2024-02-02"),
            qualityScore: 91,
          },
          {
            id: "s4",
            name: "Portfolio_Stripe.pdf",
            type: "pdf",
            size: 1250000,
            uploadedAt: new Date("2024-02-01"),
          },
        ],
      },
      {
        id: "job-vercel",
        name: "Vercel - Senior Engineer",
        type: "folder",
        fileCount: 3,
        files: [
          {
            id: "v1",
            name: "Resume_Vercel.pdf",
            type: "pdf",
            size: 228000,
            uploadedAt: new Date("2024-01-28"),
            qualityScore: 93,
          },
          {
            id: "v2",
            name: "CoverLetter_Vercel.pdf",
            type: "pdf",
            size: 142000,
            uploadedAt: new Date("2024-01-29"),
            qualityScore: 89,
          },
          {
            id: "v3",
            name: "References_Vercel.pdf",
            type: "pdf",
            size: 98000,
            uploadedAt: new Date("2024-01-30"),
          },
        ],
      },
      {
        id: "job-linear",
        name: "Linear - Frontend Lead",
        type: "folder",
        fileCount: 5,
        files: [
          {
            id: "l1",
            name: "Resume_Linear_v1.pdf",
            type: "pdf",
            size: 241000,
            uploadedAt: new Date("2024-01-20"),
            qualityScore: 91,
            variant: "A",
          },
          {
            id: "l2",
            name: "Resume_Linear_v2.pdf",
            type: "pdf",
            size: 245000,
            uploadedAt: new Date("2024-01-22"),
            qualityScore: 95,
            variant: "B",
          },
          {
            id: "l3",
            name: "Resume_Linear_v3.pdf",
            type: "pdf",
            size: 239000,
            uploadedAt: new Date("2024-01-24"),
            qualityScore: 93,
            variant: "C",
          },
          {
            id: "l4",
            name: "CoverLetter_Linear.pdf",
            type: "pdf",
            size: 138000,
            uploadedAt: new Date("2024-01-21"),
            qualityScore: 87,
          },
          {
            id: "l5",
            name: "Portfolio_Linear.pdf",
            type: "pdf",
            size: 1180000,
            uploadedAt: new Date("2024-01-20"),
          },
        ],
      },
    ],
  },
  {
    id: "profile-pm",
    name: "Product Manager",
    type: "folder",
    fileCount: 6,
    children: [
      {
        id: "job-notion",
        name: "Notion - Senior PM",
        type: "folder",
        fileCount: 3,
        files: [
          {
            id: "n1",
            name: "Resume_Notion.pdf",
            type: "pdf",
            size: 219000,
            uploadedAt: new Date("2024-01-18"),
            qualityScore: 90,
          },
          {
            id: "n2",
            name: "CoverLetter_Notion.pdf",
            type: "pdf",
            size: 134000,
            uploadedAt: new Date("2024-01-19"),
            qualityScore: 86,
          },
          {
            id: "n3",
            name: "CaseStudy_Notion.pdf",
            type: "pdf",
            size: 890000,
            uploadedAt: new Date("2024-01-17"),
          },
        ],
      },
      {
        id: "job-figma",
        name: "Figma - Product Lead",
        type: "folder",
        fileCount: 3,
        files: [
          {
            id: "fg1",
            name: "Resume_Figma.pdf",
            type: "pdf",
            size: 225000,
            uploadedAt: new Date("2024-01-12"),
            qualityScore: 88,
          },
          {
            id: "fg2",
            name: "CoverLetter_Figma.pdf",
            type: "pdf",
            size: 128000,
            uploadedAt: new Date("2024-01-13"),
            qualityScore: 84,
          },
          {
            id: "fg3",
            name: "Portfolio_Figma.pdf",
            type: "pdf",
            size: 1450000,
            uploadedAt: new Date("2024-01-11"),
          },
        ],
      },
    ],
  },
]

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getFileTypeColor(type: string): string {
  switch (type) {
    case "pdf":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
    case "docx":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
    case "png":
    case "jpg":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getAllFiles(nodes: FolderNode[]): FileItem[] {
  const files: FileItem[] = []
  function traverse(node: FolderNode) {
    if (node.files) files.push(...node.files)
    if (node.children) node.children.forEach(traverse)
  }
  nodes.forEach(traverse)
  return files
}

function getTotalStorageUsed(nodes: FolderNode[]): number {
  return getAllFiles(nodes).reduce((sum, f) => sum + f.size, 0)
}

// Quality Ring Component
function QualityRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2
  const strokeWidth = 3
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 90) return "stroke-success"
    if (score >= 70) return "stroke-warning"
    return "stroke-destructive"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        style={{ width: size, height: size }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold">
        {score}
      </span>
    </div>
  )
}

// Folder Tree Node Component
function FolderTreeNode({
  node,
  level = 0,
  selectedFolderId,
  expandedFolders,
  onSelect,
  onToggleExpand,
}: {
  node: FolderNode
  level?: number
  selectedFolderId: string | null
  expandedFolders: Set<string>
  onSelect: (folder: FolderNode) => void
  onToggleExpand: (folderId: string) => void
}) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolderId === node.id
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node)
          if (hasChildren) onToggleExpand(node.id)
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="size-4 shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpenIcon className="size-4 shrink-0 text-primary" />
        ) : (
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate text-left">{node.name}</span>
        <Badge variant="secondary" className="ml-auto text-xs">
          {node.fileCount}
        </Badge>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FolderTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// File Card Component
function FileCard({
  file,
  onPreview,
  onDownload,
  onDelete,
}: {
  file: FileItem
  onPreview: () => void
  onDownload: () => void
  onDelete: () => void
}) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Thumbnail / Preview Area */}
        <div
          className="mb-3 aspect-[8.5/11] rounded-lg bg-muted/50 border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
          onClick={onPreview}
        >
          <FileTextIcon className="size-10 text-muted-foreground/50" />
        </div>

        {/* File Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={cn("text-xs uppercase", getFileTypeColor(file.type))}
                >
                  {file.type}
                </Badge>
                {file.variant && (
                  <Badge variant="secondary" className="text-xs">
                    Variant {file.variant}
                  </Badge>
                )}
              </div>
            </div>
            {file.qualityScore !== undefined && (
              <QualityRing score={file.qualityScore} size={40} />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{formatFileSize(file.size)}</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 text-xs rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onPreview}
            >
              <EyeIcon className="size-3.5 mr-1" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 text-xs rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onDownload}
            >
              <DownloadIcon className="size-3.5 mr-1" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onDelete}
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// File List Row Component
function FileListRow({
  file,
  onPreview,
  onDownload,
  onDelete,
}: {
  file: FileItem
  onPreview: () => void
  onDownload: () => void
  onDelete: () => void
}) {
  return (
    <div className="group flex items-center gap-4 rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
        <FileIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge
            variant="outline"
            className={cn("text-xs uppercase", getFileTypeColor(file.type))}
          >
            {file.type}
          </Badge>
          {file.variant && (
            <Badge variant="secondary" className="text-xs">
              {file.variant}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
      {file.qualityScore !== undefined && (
        <QualityRing score={file.qualityScore} size={36} />
      )}
      <span className="text-xs text-muted-foreground w-24 text-right">
        {formatDate(file.uploadedAt)}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          onClick={onPreview}
        >
          <EyeIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          onClick={onDownload}
        >
          <DownloadIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          onClick={onDelete}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(
    mockFolderTree[0]
  )
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["profile-senior-fe"])
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [deleteFile, setDeleteFile] = useState<FileItem | null>(null)

  const storageUsed = getTotalStorageUsed(mockFolderTree)
  const storageLimit = 500 * 1024 * 1024 // 500MB
  const storagePercent = (storageUsed / storageLimit) * 100

  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const filteredFiles =
    selectedFolder?.files?.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <h1 className="text-xl font-semibold md:text-2xl">Documents</h1>
        <div className="flex flex-wrap items-center gap-3">
          {/* Storage Stats */}
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <span className="font-mono">
              {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
            </span>
            <Progress value={storagePercent} className="h-2 w-24" />
          </div>
          <Button variant="outline" size="sm" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary md:size-default">
            <DownloadIcon className="size-4 mr-1.5" />
            <span className="hidden sm:inline">Download All ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </Button>
          <Button size="sm" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary md:size-default">
            <UploadIcon className="size-4 mr-1.5" />
            Upload
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left Panel - Folder Tree */}
        <div className="w-full shrink-0 border-b md:w-[30%] md:border-b-0 md:border-r bg-surface/50 max-h-48 md:max-h-none">
          <ScrollArea className="h-full max-h-48 md:max-h-none">
            <div className="p-4 space-y-1">
              {mockFolderTree.map((node) => (
                <FolderTreeNode
                  key={node.id}
                  node={node}
                  selectedFolderId={selectedFolder?.id || null}
                  expandedFolders={expandedFolders}
                  onSelect={setSelectedFolder}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - File Grid (70%) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="size-4" />
              </Button>
            </div>
          </div>

          {/* Files Area */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {selectedFolder ? (
                <>
                  {/* Breadcrumb */}
                  <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <FolderIcon className="size-4" />
                    <span>{selectedFolder.name}</span>
                    <span className="ml-2 font-mono text-xs">
                      ({filteredFiles.length} files)
                    </span>
                  </div>

                  {filteredFiles.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredFiles.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            onPreview={() => setPreviewFile(file)}
                            onDownload={() => {}}
                            onDelete={() => setDeleteFile(file)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredFiles.map((file) => (
                          <FileListRow
                            key={file.id}
                            file={file}
                            onPreview={() => setPreviewFile(file)}
                            onDownload={() => {}}
                            onDelete={() => setDeleteFile(file)}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileTextIcon className="size-12 text-muted-foreground/50 mb-3" />
                      <h3 className="text-base font-medium mb-1">No files found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery
                          ? "Try a different search term"
                          : "Upload files to this folder to get started"}
                      </p>
                      <Button className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
                        <UploadIcon className="size-4 mr-1.5" />
                        Upload Files
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FolderIcon className="size-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-base font-medium mb-1">Select a folder</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a folder from the tree to view its files
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileTextIcon className="size-5" />
              {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border bg-muted/30">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FileTextIcon className="mx-auto size-16 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  PDF Preview
                </p>
                <p className="text-xs text-muted-foreground">
                  Document viewer would render here
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <DownloadIcon className="size-4 mr-1.5" />
                    Download
                  </Button>
                  <Button className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
                    <EyeIcon className="size-4 mr-1.5" />
                    Open Full Screen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteFile?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setDeleteFile(null)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
