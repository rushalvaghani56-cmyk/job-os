"use client"

import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import {
  FileText,
  Linkedin,
  Pencil,
  Upload,
  X,
  Check,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

type ImportMethod = "resume" | "linkedin" | "manual" | null

const importOptions = [
  {
    id: "resume" as const,
    label: "Upload Resume",
    description: "We'll extract your skills, experience, and education",
    icon: FileText,
    accept: ".pdf,.docx",
  },
  {
    id: "linkedin" as const,
    label: "Import LinkedIn PDF",
    description: "Export your LinkedIn profile as PDF and upload it",
    icon: Linkedin,
    accept: ".pdf",
  },
  {
    id: "manual" as const,
    label: "Add Manually",
    description: "Enter your details step by step",
    icon: Pencil,
    accept: "",
  },
]

interface ExtractedData {
  skills: string[]
  experience: { company: string; title: string; duration: string }[]
  education: { school: string; degree: string; year: string }[]
}

export default function OnboardingStep2() {
  const router = useRouter()
  const { data, updateData, completedSteps, markStepComplete } = useOnboardingStore()
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateExtraction = () => {
    setIsExtracting(true)
    setExtractionProgress(0)

    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExtracting(false)
          setExtractedData({
            skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS"],
            experience: [
              { company: "Tech Corp", title: "Senior Engineer", duration: "2020 - Present" },
              { company: "Startup Inc", title: "Software Engineer", duration: "2018 - 2020" },
            ],
            education: [
              { school: "State University", degree: "BS Computer Science", year: "2018" },
            ],
          })
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleBack = () => {
    router.push("/onboarding/step-1")
  }

  const handleSkip = () => {
    router.push("/onboarding/step-3")
  }

  const handleContinue = () => {
    if (extractedData) {
      updateData({
        extractedData: {
          skills: extractedData.skills.join(", "),
          experience: extractedData.experience.map((e) => `${e.title} at ${e.company}`).join("; "),
          education: extractedData.education.map((e) => `${e.degree} from ${e.school}`).join("; "),
        },
      })
    }
    markStepComplete(2)
    router.push("/onboarding/step-3")
  }

  const handleReset = () => {
    setSelectedMethod(null)
    setUploadedFile(null)
    setExtractedData(null)
    setExtractionProgress(0)
  }

  const handleRemoveSkill = (skill: string) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        skills: extractedData.skills.filter((s) => s !== skill),
      })
    }
  }

  // No method selected yet - show options
  if (!selectedMethod) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <ProgressStepper steps={steps} currentStep={2} completedSteps={completedSteps} />
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold">Import Your Data</h2>
              <p className="text-sm text-muted-foreground mt-1">
                How would you like to add your profile data?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {importOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed",
                      "transition-all hover:border-primary hover:bg-primary/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
                Skip for now
              </Button>
              <div className="w-20" /> {/* Spacer for alignment */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Manual entry mode
  if (selectedMethod === "manual") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <ProgressStepper steps={steps} currentStep={2} completedSteps={completedSteps} />
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Enter Your Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in your profile information manually
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-1" />
                Start Over
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  placeholder="React, TypeScript, Node.js..."
                  defaultValue={extractedData?.skills.join(", ")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Summary</Label>
                <Input
                  id="experience"
                  placeholder="Senior Engineer at Tech Corp (2020-Present)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="BS Computer Science, State University (2018)"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
                Skip for now
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // File upload mode (resume or linkedin)
  const selectedOption = importOptions.find((o) => o.id === selectedMethod)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <ProgressStepper steps={steps} currentStep={2} completedSteps={completedSteps} />
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{selectedOption?.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedOption?.description}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
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

          {!uploadedFile && !isExtracting && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer",
                "transition-all hover:border-primary hover:bg-primary/5",
                isDragging && "border-primary bg-primary/10"
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Accepts {selectedOption?.accept.replace(/\./g, "").toUpperCase()}
              </p>
            </div>
          )}

          {isExtracting && (
            <div className="space-y-4 p-8 rounded-xl border bg-muted/20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="font-medium mb-2">Extracting data with AI...</p>
                <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
              </div>
              <Progress value={extractionProgress} className="h-2" />
              <p className="text-center text-sm font-mono text-muted-foreground">
                {extractionProgress}%
              </p>
            </div>
          )}

          {uploadedFile && extractedData && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success-muted border border-success">
                <FileText className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Check className="h-5 w-5 text-success" />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Extracted Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {extractedData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <div className="space-y-2 mt-2">
                    {extractedData.experience.map((exp, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                        <p className="font-medium text-sm">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.company} | {exp.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Education</Label>
                  <div className="space-y-2 mt-2">
                    {extractedData.education.map((edu, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                        <p className="font-medium text-sm">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.school} | {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
              Skip for now
            </Button>
            <Button onClick={handleContinue} disabled={isExtracting}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
