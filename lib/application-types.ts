export type ApplicationStatus =
  | 'discovered'
  | 'scored'
  | 'in_review'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'ghosted'

export interface Application {
  id: string
  companyName: string
  companyLogo?: string
  jobTitle: string
  score: number
  status: ApplicationStatus
  submittedDate?: Date
  interviewDate?: Date
  lastActivity: Date
  daysInStage: number
  interviewProbability?: number
  location?: string
  salary?: string
  notes?: string
}

export const STATUS_CONFIG: Record<ApplicationStatus, {
  label: string
  color: string
  borderColor: string
  bgColor: string
}> = {
  discovered: {
    label: 'Discovered',
    color: 'text-slate-600 dark:text-slate-400',
    borderColor: 'border-t-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-900/50',
  },
  scored: {
    label: 'Scored',
    color: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-t-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
  },
  in_review: {
    label: 'In Review',
    color: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-t-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
  },
  applied: {
    label: 'Applied',
    color: 'text-green-600 dark:text-green-400',
    borderColor: 'border-t-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
  },
  screening: {
    label: 'Screening',
    color: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-t-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/30',
  },
  interview: {
    label: 'Interview',
    color: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-t-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  offer: {
    label: 'Offer',
    color: 'text-green-600 dark:text-green-400',
    borderColor: 'border-t-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600 dark:text-red-400',
    borderColor: 'border-t-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-t-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
  },
  ghosted: {
    label: 'Ghosted',
    color: 'text-gray-500 dark:text-gray-500',
    borderColor: 'border-t-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/30',
  },
}

export const KANBAN_COLUMNS: ApplicationStatus[] = [
  'discovered',
  'scored',
  'in_review',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
  'ghosted',
]

// Mock data for demonstration
export const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    companyName: 'Vercel',
    companyLogo: 'https://logo.clearbit.com/vercel.com',
    jobTitle: 'Senior Frontend Engineer',
    score: 92,
    status: 'interview',
    submittedDate: new Date('2025-03-01'),
    interviewDate: new Date('2025-03-18'),
    lastActivity: new Date('2025-03-10'),
    daysInStage: 3,
    interviewProbability: 85,
    location: 'Remote',
    salary: '$180k - $220k',
  },
  {
    id: '2',
    companyName: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    jobTitle: 'Full Stack Engineer',
    score: 88,
    status: 'applied',
    submittedDate: new Date('2025-03-05'),
    lastActivity: new Date('2025-03-08'),
    daysInStage: 5,
    interviewProbability: 72,
    location: 'San Francisco, CA',
    salary: '$190k - $240k',
  },
  {
    id: '3',
    companyName: 'Linear',
    companyLogo: 'https://logo.clearbit.com/linear.app',
    jobTitle: 'Product Engineer',
    score: 95,
    status: 'screening',
    submittedDate: new Date('2025-03-02'),
    lastActivity: new Date('2025-03-09'),
    daysInStage: 4,
    interviewProbability: 90,
    location: 'Remote',
    salary: '$160k - $200k',
  },
  {
    id: '4',
    companyName: 'Notion',
    companyLogo: 'https://logo.clearbit.com/notion.so',
    jobTitle: 'Senior Software Engineer',
    score: 78,
    status: 'discovered',
    lastActivity: new Date('2025-03-11'),
    daysInStage: 2,
    location: 'New York, NY',
    salary: '$175k - $215k',
  },
  {
    id: '5',
    companyName: 'Figma',
    companyLogo: 'https://logo.clearbit.com/figma.com',
    jobTitle: 'Frontend Developer',
    score: 82,
    status: 'scored',
    lastActivity: new Date('2025-03-10'),
    daysInStage: 3,
    interviewProbability: 65,
    location: 'San Francisco, CA',
    salary: '$165k - $200k',
  },
  {
    id: '6',
    companyName: 'GitHub',
    companyLogo: 'https://logo.clearbit.com/github.com',
    jobTitle: 'Staff Engineer',
    score: 70,
    status: 'in_review',
    lastActivity: new Date('2025-03-07'),
    daysInStage: 6,
    location: 'Remote',
    salary: '$200k - $280k',
  },
  {
    id: '7',
    companyName: 'Airbnb',
    companyLogo: 'https://logo.clearbit.com/airbnb.com',
    jobTitle: 'Software Engineer II',
    score: 65,
    status: 'rejected',
    submittedDate: new Date('2025-02-20'),
    lastActivity: new Date('2025-03-05'),
    daysInStage: 8,
    location: 'San Francisco, CA',
    salary: '$170k - $210k',
  },
  {
    id: '8',
    companyName: 'Shopify',
    companyLogo: 'https://logo.clearbit.com/shopify.com',
    jobTitle: 'Senior Developer',
    score: 86,
    status: 'offer',
    submittedDate: new Date('2025-02-15'),
    lastActivity: new Date('2025-03-12'),
    daysInStage: 2,
    location: 'Remote',
    salary: '$185k - $225k',
  },
  {
    id: '9',
    companyName: 'Coinbase',
    companyLogo: 'https://logo.clearbit.com/coinbase.com',
    jobTitle: 'Blockchain Engineer',
    score: 58,
    status: 'withdrawn',
    submittedDate: new Date('2025-02-25'),
    lastActivity: new Date('2025-03-01'),
    daysInStage: 12,
    location: 'Remote',
    salary: '$200k - $300k',
  },
  {
    id: '10',
    companyName: 'Slack',
    companyLogo: 'https://logo.clearbit.com/slack.com',
    jobTitle: 'Platform Engineer',
    score: 74,
    status: 'ghosted',
    submittedDate: new Date('2025-02-10'),
    lastActivity: new Date('2025-02-20'),
    daysInStage: 21,
    location: 'San Francisco, CA',
    salary: '$175k - $220k',
  },
  {
    id: '11',
    companyName: 'Datadog',
    companyLogo: 'https://logo.clearbit.com/datadoghq.com',
    jobTitle: 'Backend Engineer',
    score: 81,
    status: 'discovered',
    lastActivity: new Date('2025-03-12'),
    daysInStage: 1,
    location: 'New York, NY',
    salary: '$180k - $230k',
  },
  {
    id: '12',
    companyName: 'Supabase',
    companyLogo: 'https://logo.clearbit.com/supabase.com',
    jobTitle: 'Developer Experience Engineer',
    score: 91,
    status: 'scored',
    lastActivity: new Date('2025-03-11'),
    daysInStage: 2,
    interviewProbability: 88,
    location: 'Remote',
    salary: '$150k - $190k',
  },
]
