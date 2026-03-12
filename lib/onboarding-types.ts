export interface OnboardingData {
  // Step 1 - Profile Basics
  profileName: string
  targetRole: string
  seniority: string
  employmentTypes: string[]
  locations: string[]
  workModes: {
    remote: boolean
    hybrid: boolean
    onsite: boolean
  }
  negativeLocations: string[]
  yearsOfExperience: number
  currentTitle: string
  salaryRange: {
    min: number
    max: number
    currency: string
  }

  // Step 2 - Import Data
  importMethod: 'resume' | 'linkedin' | 'manual' | null
  uploadedFile: File | null
  extractedData: Record<string, string> | null

  // Step 3 - Deep Profile
  socialUrls: {
    linkedin: string
    github: string
    portfolio: string
    twitter: string
  }
  workAuthorization: string
  languages: { language: string; proficiency: string }[]
  workPreferences: {
    startDate: string
    noticePeriod: string
    willingToRelocate: boolean
  }
  writingTones: string[]
  customFields: { key: string; value: string }[]
  aiInstructions: string

  // Step 4 - Master Resumes
  masterResumes: { name: string; type: string; size: number }[]
  resumeTemplate: File | null

  // Step 5 - AI Keys
  apiKeys: {
    anthropic: { key: string; valid: boolean | null }
    openai: { key: string; valid: boolean | null }
    google: { key: string; valid: boolean | null }
  }
  modelAssignments: {
    resumeTailoring: { provider: string; model: string }
    coverLetter: { provider: string; model: string }
    jobMatching: { provider: string; model: string }
  }
  copilotModel: { provider: string; model: string }
}

export const initialOnboardingData: OnboardingData = {
  profileName: '',
  targetRole: '',
  seniority: '',
  employmentTypes: [],
  locations: [],
  workModes: { remote: false, hybrid: false, onsite: false },
  negativeLocations: [],
  yearsOfExperience: 0,
  currentTitle: '',
  salaryRange: { min: 0, max: 0, currency: 'USD' },
  importMethod: null,
  uploadedFile: null,
  extractedData: null,
  socialUrls: { linkedin: '', github: '', portfolio: '', twitter: '' },
  workAuthorization: '',
  languages: [],
  workPreferences: { startDate: '', noticePeriod: '', willingToRelocate: false },
  writingTones: [],
  customFields: [],
  aiInstructions: '',
  masterResumes: [],
  resumeTemplate: null,
  apiKeys: {
    anthropic: { key: '', valid: null },
    openai: { key: '', valid: null },
    google: { key: '', valid: null },
  },
  modelAssignments: {
    resumeTailoring: { provider: '', model: '' },
    coverLetter: { provider: '', model: '' },
    jobMatching: { provider: '', model: '' },
  },
  copilotModel: { provider: '', model: '' },
}

export const SENIORITY_OPTIONS = [
  'Intern',
  'Entry Level',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
  'Manager',
  'C-Level',
]

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
]

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY']

export const WORK_AUTHORIZATION_OPTIONS = [
  'US Citizen',
  'Green Card',
  'H1B Visa',
  'OPT/CPT',
  'Need Sponsorship',
  'EU Citizen',
  'UK Right to Work',
  'Other',
]

export const LANGUAGE_PROFICIENCY = [
  'Native',
  'Fluent',
  'Professional',
  'Conversational',
  'Basic',
]

export const WRITING_TONES = [
  'Professional',
  'Conversational',
  'Technical',
  'Creative',
  'Formal',
  'Friendly',
]
