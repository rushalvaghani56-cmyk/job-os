import { Card, CardContent } from "@/components/ui/card"
import {
  SearchIcon,
  TargetIcon,
  FileTextIcon,
  ZapIcon,
  MailIcon,
  BarChart3Icon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react"

const features = [
  {
    icon: SearchIcon,
    title: "Smart Discovery",
    description: "AI scans thousands of job boards and company sites to find roles that match your skills and preferences.",
  },
  {
    icon: TargetIcon,
    title: "Match Scoring",
    description: "Get an instant fit score for every job based on your experience, skills, and career goals.",
  },
  {
    icon: FileTextIcon,
    title: "Resume Tailoring",
    description: "Automatically customize your resume for each application to maximize your chances.",
  },
  {
    icon: ZapIcon,
    title: "Auto-Apply",
    description: "One-click applications powered by AI. Apply to dozens of jobs while you sleep.",
  },
  {
    icon: MailIcon,
    title: "Outreach Automation",
    description: "Generate personalized connection requests and follow-up emails for recruiters and hiring managers.",
  },
  {
    icon: BarChart3Icon,
    title: "Application Analytics",
    description: "Track every application, response rate, and interview conversion in one dashboard.",
  },
  {
    icon: SparklesIcon,
    title: "AI Copilot",
    description: "Get real-time coaching for interviews, salary negotiation, and career decisions.",
  },
  {
    icon: TrendingUpIcon,
    title: "Market Intelligence",
    description: "Stay ahead with salary benchmarks, hiring trends, and demand forecasts for your skills.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything you need to land your dream job
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A complete toolkit that handles the tedious parts of job searching so you can focus on acing interviews.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-xl border-border bg-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="flex flex-col gap-3 p-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
