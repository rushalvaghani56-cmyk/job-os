"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
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
  FileIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  ChevronLeftIcon,
  ChevronRightIcon as ChevronRightNavIcon,
  ZoomInIcon,
  ZoomOutIcon,
  Loader2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { useToast } from "@/hooks/use-toast"
import { FileUploader } from "@/components/shared/file-uploader"
import {
  useFiles,
  useDeleteFile,
  useDownloadFile,
  usePresignedUpload,
  type ApiFile,
} from "@/hooks/useFiles"

// Types
interface FileItem {
  id: string
  name: string
  type: "pdf" | "docx" | "png" | "jpg" | "md"
  size: number
  uploadedAt: Date
  qualityScore?: number
  variant?: "A" | "B" | "C"
}

interface FolderNode {
  id: string
  name: string
  type: "folder"
  isActive?: boolean
  children?: FolderNode[]
  files?: FileItem[]
  fileCount: number
}

// Convert ApiFile to local FileItem
function apiFileToFileItem(apiFile: ApiFile): FileItem {
  const ext = apiFile.name.split(".").pop()?.toLowerCase() || ""
  const type = (["pdf", "docx", "png", "jpg", "md"].includes(ext) ? ext : "pdf") as FileItem["type"]
  return {
    id: apiFile.id,
    name: apiFile.name,
    type,
    size: apiFile.size,
    uploadedAt: new Date(apiFile.uploaded_at),
    qualityScore: apiFile.quality_score,
    variant: apiFile.variant,
  }
}

// Build a folder tree from the flat API file list.
// Groups files by profile_name > job_name. Files without a profile go into "Uncategorized".
function buildFolderTree(apiFiles: ApiFile[]): FolderNode[] {
  const profileMap = new Map<string, { profileId: string; jobs: Map<string, { jobId: string; files: FileItem[] }>; files: FileItem[] }>()

  for (const af of apiFiles) {
    const profileKey = af.profile_name || af.folder || "Uncategorized"
    const profileId = af.profile_id || `profile-${profileKey}`

    if (!profileMap.has(profileKey)) {
      profileMap.set(profileKey, { profileId, jobs: new Map(), files: [] })
    }
    const profile = profileMap.get(profileKey)!
    const fileItem = apiFileToFileItem(af)

    if (af.job_name && af.job_id) {
      if (!profile.jobs.has(af.job_id)) {
        profile.jobs.set(af.job_id, { jobId: af.job_id, files: [] })
      }
      profile.jobs.get(af.job_id)!.files.push(fileItem)
    } else {
      profile.files.push(fileItem)
    }
  }

  const tree: FolderNode[] = []
  for (const [profileName, { profileId, jobs, files }] of profileMap) {
    const children: FolderNode[] = []
    let totalFileCount = files.length

    for (const [jobId, { files: jobFiles }] of jobs) {
      totalFileCount += jobFiles.length
      // Derive job folder name from first file's job_name
      const jobFile = apiFiles.find((f) => f.job_id === jobId)
      children.push({
        id: `job-${jobId}`,
        name: jobFile?.job_name || jobId,
        type: "folder",
        fileCount: jobFiles.length,
        files: jobFiles,
      })
    }

    const node: FolderNode = {
      id: profileId,
      name: profileName,
      type: "folder",
      fileCount: totalFileCount,
      files: files.length > 0 ? files : undefined,
      children: children.length > 0 ? children : undefined,
    }
    tree.push(node)
  }

  return tree
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

function getFileTypeColor(type: string): string {
  switch (type) {
    case "pdf":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
    case "docx":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
    case "md":
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
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
function QualityScoreRing({ score, size = 32 }: { score: number; size?: number }) {
  const radius = (size - 4) / 2
  const strokeWidth = 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 90) return "stroke-emerald-500"
    if (score >= 70) return "stroke-amber-500"
    return "stroke-red-500"
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
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold">
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
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
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
        {isExpanded || isSelected ? (
          <FolderOpenIcon className="size-4 shrink-0 text-primary" />
        ) : (
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate text-left">{node.name}</span>
        {node.isActive && (
          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
            active
          </Badge>
        )}
        <Badge variant="outline" className="text-xs font-mono ml-auto">
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
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] uppercase px-1.5 py-0 h-4", getFileTypeColor(file.type))}
                >
                  {file.type}
                </Badge>
                {file.variant && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {file.variant}
                  </Badge>
                )}
              </div>
            </div>
            {file.qualityScore !== undefined && (
              <QualityScoreRing score={file.qualityScore} size={32} />
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
              className="h-7 flex-1 text-xs rounded-lg"
              onClick={onPreview}
            >
              <EyeIcon className="size-3 mr-1" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 flex-1 text-xs rounded-lg"
              onClick={onDownload}
            >
              <DownloadIcon className="size-3 mr-1" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive rounded-lg"
              onClick={onDelete}
            >
              <TrashIcon className="size-3" />
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
            className={cn("text-[10px] uppercase px-1.5 py-0 h-4", getFileTypeColor(file.type))}
          >
            {file.type}
          </Badge>
          {file.variant && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {file.variant}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
      {file.qualityScore !== undefined && (
        <QualityScoreRing score={file.qualityScore} size={32} />
      )}
      <span className="text-xs text-muted-foreground w-20 text-right hidden sm:block">
        {formatDate(file.uploadedAt)}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={onPreview}
        >
          <EyeIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={onDownload}
        >
          <DownloadIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive rounded-lg"
          onClick={onDelete}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// PDF Viewer Modal
function PDFViewerModal({
  file,
  open,
  onOpenChange,
}: {
  file: FileItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(3)
  const [zoom, setZoom] = useState(100)

  if (!file) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileTextIcon className="size-5" />
              {file.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <DownloadIcon className="size-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRightNavIcon className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              disabled={zoom <= 50}
            >
              <ZoomOutIcon className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[50px] text-center font-mono">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              disabled={zoom >= 200}
            >
              <ZoomInIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-muted/20 flex items-center justify-center p-4">
          <div
            className="bg-background shadow-lg rounded-sm aspect-[8.5/11] w-full max-w-[612px] flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
          >
            <div className="text-center p-8">
              <FileTextIcon className="mx-auto size-16 text-muted-foreground/50 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">PDF Preview</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Document viewer renders here
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function FilesPage() {
  const { toast } = useToast()

  // Real API hooks
  const { data: apiFiles, isLoading, isError } = useFiles()
  const deleteFileMutation = useDeleteFile()
  const downloadFileMutation = useDownloadFile()
  const presignedUpload = usePresignedUpload()

  // Build folder tree from API data
  const folderTree = useMemo(() => {
    if (!apiFiles || apiFiles.length === 0) return []
    return buildFolderTree(apiFiles)
  }, [apiFiles])

  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [deleteFile, setDeleteFile] = useState<FileItem | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [mobileShowTree, setMobileShowTree] = useState(true)

  // Auto-select first folder when data loads
  useEffect(() => {
    if (folderTree.length > 0 && !selectedFolder) {
      const firstFolder = folderTree[0]
      setSelectedFolder(firstFolder.children?.[0] || firstFolder)
      setExpandedFolders(new Set([firstFolder.id]))
    }
  }, [folderTree, selectedFolder])

  const storageUsed = useMemo(() => getTotalStorageUsed(folderTree), [folderTree])
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

  const filteredFiles = useMemo(() => {
    if (!selectedFolder?.files) return []
    return selectedFolder.files.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [selectedFolder, searchQuery])

  const handleDownload = (file: FileItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    })
    downloadFileMutation.mutate(file.id)
  }

  const handleDelete = () => {
    if (deleteFile) {
      deleteFileMutation.mutate(deleteFile.id, {
        onSuccess: () => {
          // Update selected folder's files in-place to reflect deletion
          if (selectedFolder?.files) {
            setSelectedFolder({
              ...selectedFolder,
              files: selectedFolder.files.filter((f) => f.id !== deleteFile.id),
              fileCount: selectedFolder.fileCount - 1,
            })
          }
          setDeleteFile(null)
        },
        onError: () => {
          setDeleteFile(null)
        },
      })
    }
  }

  const handleDownloadAll = () => {
    toast({
      title: "Preparing ZIP",
      description: "Your files are being compressed...",
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">File Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your resumes, cover letters, and application documents
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Storage Stats */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs">
              {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
            </span>
            <Progress value={storagePercent} className="h-1.5 w-20" />
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadAll}>
            <DownloadIcon className="size-4 mr-1.5" />
            <span className="hidden sm:inline">Download All ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </Button>
          <Button size="sm" onClick={() => setShowUploadDialog(true)}>
            <UploadIcon className="size-4 mr-1.5" />
            Upload
          </Button>
        </div>
      </div>

      {/* Mobile Toggle */}
      <div className="flex items-center gap-2 border-b px-4 py-2 md:hidden">
        <Button
          variant={mobileShowTree ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMobileShowTree(true)}
          className="flex-1"
        >
          <FolderIcon className="size-4 mr-1.5" />
          Folders
        </Button>
        <Button
          variant={!mobileShowTree ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMobileShowTree(false)}
          className="flex-1"
        >
          <FileIcon className="size-4 mr-1.5" />
          Files
        </Button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Skeleton: Folder Tree */}
          <div className="w-full shrink-0 border-b md:w-[30%] md:min-w-[280px] md:max-w-[320px] md:border-b-0 md:border-r bg-surface/50 p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1 rounded" />
                <Skeleton className="h-4 w-6 rounded" />
              </div>
            ))}
          </div>
          {/* Skeleton: File Grid */}
          <div className="flex-1 p-4">
            <Skeleton className="h-5 w-48 mb-4 rounded" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                  <Skeleton className="aspect-[8.5/11] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <FileTextIcon className="mx-auto size-12 text-destructive/50 mb-3" />
            <h3 className="text-base font-medium mb-1">Failed to load files</h3>
            <p className="text-sm text-muted-foreground">
              Something went wrong. Please try refreshing the page.
            </p>
          </div>
        </div>
      ) : folderTree.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <FolderIcon className="mx-auto size-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-medium mb-1">No files yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first resume or cover letter to get started.
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <UploadIcon className="size-4 mr-1.5" />
              Upload Files
            </Button>
          </div>
        </div>
      ) : (
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left Panel - Folder Tree (30%, 280px min) */}
        <div
          className={cn(
            "w-full shrink-0 border-b md:w-[30%] md:min-w-[280px] md:max-w-[320px] md:border-b-0 md:border-r bg-surface/50",
            mobileShowTree ? "block" : "hidden md:block"
          )}
        >
          <ScrollArea className="h-full">
            <div className="p-3 space-y-0.5">
              {folderTree.map((node) => (
                <FolderTreeNode
                  key={node.id}
                  node={node}
                  selectedFolderId={selectedFolder?.id || null}
                  expandedFolders={expandedFolders}
                  onSelect={(folder) => {
                    setSelectedFolder(folder)
                    setMobileShowTree(false)
                  }}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - File Grid (70%) */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            !mobileShowTree ? "block" : "hidden md:flex"
          )}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-md"
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
                    <span className="font-medium text-foreground">{selectedFolder.name}</span>
                    <span className="ml-2 font-mono text-xs">
                      ({filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""})
                    </span>
                  </div>

                  {filteredFiles.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredFiles.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            onPreview={() => setPreviewFile(file)}
                            onDownload={() => handleDownload(file)}
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
                            onDownload={() => handleDownload(file)}
                            onDelete={() => setDeleteFile(file)}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileTextIcon className="size-12 text-muted-foreground/50 mb-3" />
                      <h3 className="text-base font-medium mb-1">No files in this folder</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery
                          ? "Try a different search term"
                          : "Files are created when AI generates content for your jobs."}
                      </p>
                      <Button onClick={() => setShowUploadDialog(true)}>
                        <UploadIcon className="size-4 mr-1.5" />
                        Upload Files
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FolderIcon className="size-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-base font-medium mb-1">No files yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Files are created when AI generates content for your jobs.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        file={previewFile}
        open={!!previewFile}
        onOpenChange={() => setPreviewFile(null)}
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <FileUploader
            accept=".pdf,.doc,.docx,.md"
            maxSize={10 * 1024 * 1024}
            onUpload={async (file) => {
              await presignedUpload.mutateAsync({ file })
            }}
            onComplete={() => {
              toast({
                title: "Upload complete",
                description: "Your file has been uploaded successfully.",
              })
              setShowUploadDialog(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteFile?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteFileMutation.isPending}
            >
              {deleteFileMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 mr-1.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
