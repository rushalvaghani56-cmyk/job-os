'use client'

import { useState, useRef } from 'react'
import { FileText, Linkedin, Pencil, Upload, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OnboardingData } from '@/lib/onboarding-types'

interface StepImportDataProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const importOptions = [
  {
    id: 'resume' as const,
    label: 'Upload Resume',
    description: 'PDF or DOCX file',
    icon: FileText,
    accept: '.pdf,.docx',
  },
  {
    id: 'linkedin' as const,
    label: 'Import LinkedIn PDF',
    description: 'Export from LinkedIn',
    icon: Linkedin,
    accept: '.pdf',
  },
  {
    id: 'manual' as const,
    label: 'Add Manually',
    description: 'Enter details yourself',
    icon: Pencil,
    accept: '',
  },
]

export function StepImportData({ data, updateData }: StepImportDataProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateExtraction = () => {
    setIsExtracting(true)
    setExtractionProgress(0)

    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExtracting(false)
          updateData({
            extractedData: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1 (555) 123-4567',
              location: 'San Francisco, CA',
              experience: '5 years',
              skills: 'React, TypeScript, Node.js, Python',
            },
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileUpload = (file: File) => {
    updateData({ uploadedFile: file })
    simulateExtraction()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleOptionSelect = (optionId: 'resume' | 'linkedin' | 'manual') => {
    updateData({ importMethod: optionId })
    if (optionId === 'manual') {
      updateData({
        extractedData: {
          name: '',
          email: '',
          phone: '',
          location: '',
          experience: '',
          skills: '',
        },
      })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const clearUpload = () => {
    updateData({
      uploadedFile: null,
      extractedData: null,
      importMethod: null,
    })
    setExtractionProgress(0)
  }

  if (!data.importMethod) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold mb-2">
            How would you like to add your profile data?
          </h3>
          <p className="text-sm text-muted-foreground">
            Import from an existing source or enter manually
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {importOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed',
                  'transition-all hover:border-primary hover:bg-primary/5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                )}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (data.importMethod === 'manual' || data.extractedData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {data.importMethod === 'manual'
                ? 'Enter Your Details'
                : 'Extracted Data'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.importMethod === 'manual'
                ? 'Fill in your profile information'
                : 'Review and edit the extracted information'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearUpload}>
            <X className="h-4 w-4 mr-1" />
            Start Over
          </Button>
        </div>

        {data.uploadedFile && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{data.uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(data.uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Check className="h-5 w-5 text-green-500" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {data.extractedData &&
            Object.entries(data.extractedData).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) =>
                    updateData({
                      extractedData: {
                        ...data.extractedData,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="rounded-md"
                />
              </div>
            ))}
        </div>
      </div>
    )
  }

  const selectedOption = importOptions.find((o) => o.id === data.importMethod)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{selectedOption?.label}</h3>
          <p className="text-sm text-muted-foreground">
            {selectedOption?.description}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearUpload}>
          <X className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={selectedOption?.accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {isExtracting ? (
        <div className="space-y-4 p-8 rounded-xl border bg-muted/20">
          <div className="text-center">
            <p className="font-medium mb-2">Extracting data with AI...</p>
            <p className="text-sm text-muted-foreground">
              This usually takes a few seconds
            </p>
          </div>
          <Progress value={extractionProgress} className="h-2" />
          <p className="text-center text-sm font-mono text-muted-foreground">
            {extractionProgress}%
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer',
            'transition-all hover:border-primary hover:bg-primary/5',
            isDragging && 'border-primary bg-primary/10'
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-semibold">
              Drag and drop your file here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Accepts {selectedOption?.accept.replace(/\./g, '').toUpperCase()}
          </p>
        </div>
      )}
    </div>
  )
}
