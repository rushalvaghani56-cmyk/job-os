"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { OnboardingData, initialOnboardingData } from "@/lib/onboarding-types"

interface OnboardingState {
  data: OnboardingData
  currentStep: number
  completedSteps: number[]
  updateData: (updates: Partial<OnboardingData>) => void
  setCurrentStep: (step: number) => void
  markStepComplete: (step: number) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      data: initialOnboardingData,
      currentStep: 1,
      completedSteps: [],

      updateData: (updates: Partial<OnboardingData>) => {
        set((state) => ({
          data: { ...state.data, ...updates },
        }))
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },

      markStepComplete: (step: number) => {
        const { completedSteps } = get()
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] })
        }
      },

      reset: () => {
        set({
          data: initialOnboardingData,
          currentStep: 1,
          completedSteps: [],
        })
      },
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        data: state.data,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
)
