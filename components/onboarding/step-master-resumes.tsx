'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, X, File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '@/lib/onboarding-types'

interface StepMasterResumesProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

export function StepMasterResumes({ data, updateData }: StepMasterResumesProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingTemplate, setIsDraggingTemplate] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const templateInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList) => {
    const newResumes = Array.from(files).map((file) => ({
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'PDF' : 'DOCX',
      size: file.size,
    }))
    updateData({ masterResumes: [...data.masterResumes, ...newResumes] })
  }

  const handleRemoveResume = (index: number) => {
    updateData({
      masterResumes: data.masterResumes.filter((_, i) => i !== index),
    })
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
      updateData({ resumeTemplate: file })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Upload Your Resumes</h3>
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
            'flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer',
            'transition-all hover:border-primary hover:bg-primary/5',
            isDragging && 'border-primary bg-primary/10'
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF or DOCX files
            </p>
          </div>
        </div>

        {data.masterResumes.length > 0 && (
          <div className="space-y-2">
            {data.masterResumes.map((resume, index) => (
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
                  onClick={() => handleRemoveResume(index)}
                  className="rounded-lg shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Resume Template (Optional)</h3>
          <p className="text-sm text-muted-foreground">
            Upload a custom template for AI to use when generating new resumes
          </p>
        </div>

        <input
          ref={templateInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              updateData({ resumeTemplate: file })
            }
          }}
          className="hidden"
        />

        {data.resumeTemplate ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {data.resumeTemplate.name}
              </p>
              <p className="text-xs text-muted-foreground">Template</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateData({ resumeTemplate: null })}
              className="rounded-lg shrink-0"
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
              'flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer',
              'transition-all hover:border-primary hover:bg-primary/5',
              isDraggingTemplate && 'border-primary bg-primary/10'
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
  )
}
