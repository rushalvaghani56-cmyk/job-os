'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  label: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
}

export function ProgressStepper({
  steps,
  currentStep,
  completedSteps,
}: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isUpcoming = !isCompleted && !isCurrent

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted &&
                      'border-primary bg-primary text-primary-foreground',
                    isCurrent &&
                      'border-primary bg-primary/10 text-primary',
                    isUpcoming &&
                      'border-muted-foreground/30 bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-mono">{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-foreground',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-colors',
                    completedSteps.includes(step.id)
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
