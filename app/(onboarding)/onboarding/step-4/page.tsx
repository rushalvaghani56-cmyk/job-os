"use client"

import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { FileText, Upload, X, File, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { useOnboardingStore } from "@/stores/onboardingStore"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Import" },
  { id: 3, label: "Deep Profile" },
  { id: 4, label: "Resumes" },
  { id: 5, label: "AI Keys" },
]

interface UploadedResume {
  name: string
  type: "PDF" | "DOCX"
  size: number
}

export default function OnboardingStep4() {
  const router = useRouter()
  const { data, updateData, completedSteps, markStepComplete } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingTemplate, setIsDraggingTemplate] = useState(false)
  const [resumes, setResumes] = useState<UploadedResume[]>(data.masterResumes || [])
  const [template, setTemplate] = useState<{ name: string; size: number } | null>(
    data.resumeTemplate ? { name: data.resumeTemplate.name, size: data.resumeTemplate.size } : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const templateInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList) => {
    const newResumes: UploadedResume[] = Array.from(files).map((file) => ({
      name: file.name,
      type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
      size: file.size,
    }))
    setResumes([...resumes, ...newResumes])
  }

  const handleRemoveResume = (index: number) => {
    setResumes(resumes.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleTemplateDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingTemplate(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setTemplate({ name: file.name, size: file.size })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleBack = () => {
    router.push("/onboarding/step-3")
  }

  const handleSkip = () => {
    router.push("/onboarding/step-5")
  }

  const handleContinue = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    updateData({
      masterResumes: resumes,
    })

    markStepComplete(4)
    setIsSubmitting(false)
    router.push("/onboarding/step-5")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <ProgressStepper steps={steps} currentStep={4} completedSteps={completedSteps} />
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Master Resumes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your existing resume files for AI tailoring
            </p>
          </div>

          <div className="space-y-8">
            {/* Resume Upload Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Upload Your Resumes</h3>
                <p className="text-sm text-muted-foreground">
                  Add your existing resume(s) to use as templates for AI tailoring
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />

              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-4 p-4 sm:p-8 rounded-xl border-2 border-dashed cursor-pointer",
                  "transition-all hover:border-primary hover:bg-primary/5",
                  isDragging && "border-primary bg-primary/10"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF or DOCX files</p>
                </div>
              </div>

              {resumes.length > 0 && (
                <div className="space-y-2">
                  {resumes.map((resume, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{resume.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(resume.size)}
                        </p>
                      </div>
                      <Badge variant="secondary">{resume.type}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveResume(index)
                        }}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {resumes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No resumes uploaded yet. You can always add them later in Settings.
                </p>
              )}
            </div>

            {/* Template Upload Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Resume Template (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your preferred resume format. Our AI will fill it with tailored content
                  for each job.
                </p>
              </div>

              <input
                ref={templateInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setTemplate({ name: file.name, size: file.size })
                  }
                }}
                className="hidden"
              />

              {template ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{template.name}</p>
                    <p className="text-xs text-muted-foreground">Template</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTemplate(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onDrop={handleTemplateDrop}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingTemplate(true)
                  }}
                  onDragLeave={() => setIsDraggingTemplate(false)}
                  onClick={() => templateInputRef.current?.click()}
                  className={cn(
                    "flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer",
                    "transition-all hover:border-primary hover:bg-primary/5",
                    isDraggingTemplate && "border-primary bg-primary/10"
                  )}
                >
                  <File className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop a template file or click to upload
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
              Skip for now
            </Button>
            <Button onClick={handleContinue} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
