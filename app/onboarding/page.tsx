'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressStepper } from '@/components/onboarding/progress-stepper'
import { StepProfileBasics } from '@/components/onboarding/step-profile-basics'
import { StepImportData } from '@/components/onboarding/step-import-data'
import { StepDeepProfile } from '@/components/onboarding/step-deep-profile'
import { StepMasterResumes } from '@/components/onboarding/step-master-resumes'
import { StepAIKeys } from '@/components/onboarding/step-ai-keys'
import { OnboardingData, initialOnboardingData } from '@/lib/onboarding-types'

const steps = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Import' },
  { id: 3, label: 'Deep Profile' },
  { id: 4, label: 'Resumes' },
  { id: 5, label: 'AI Keys' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [data, setData] = useState<OnboardingData>(initialOnboardingData)

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return (
          data.profileName.trim() !== '' &&
          data.targetRole.trim() !== '' &&
          data.seniority !== ''
        )
      case 5:
        return Object.values(data.apiKeys).some((k) => k.valid === true)
      default:
        return true
    }
  }

  const handleContinue = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Complete onboarding
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const isSkippable = currentStep >= 2 && currentStep <= 4

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProfileBasics data={data} updateData={updateData} />
      case 2:
        return <StepImportData data={data} updateData={updateData} />
      case 3:
        return <StepDeepProfile data={data} updateData={updateData} />
      case 4:
        return <StepMasterResumes data={data} updateData={updateData} />
      case 5:
        return <StepAIKeys data={data} updateData={updateData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg group-hover:text-primary transition-colors">
              JobOS
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <ProgressStepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 pb-8 max-w-2xl">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {steps.find((s) => s.id === currentStep)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStep === 1 && 'Tell us about your job search goals'}
                {currentStep === 2 && 'Import your existing profile data'}
                {currentStep === 3 && 'Add additional details to your profile'}
                {currentStep === 4 && 'Upload your resume files'}
                {currentStep === 5 && 'Connect your AI providers'}
              </p>
            </div>
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-lg"
            >
              Back
            </Button>

            {isSkippable && (
              <Button
                variant="link"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            )}

            <Button
              onClick={handleContinue}
              disabled={!canContinue()}
              className="rounded-lg min-w-[120px]"
            >
              {currentStep === 5 ? 'Finish Setup' : 'Continue'}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
