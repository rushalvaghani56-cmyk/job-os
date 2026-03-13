"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Briefcase,
  Search,
  Target,
  FileText,
  Send,
  Users,
  BarChart,
  MessageSquare,
  TrendingUp,
  Menu,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Feature cards data
const features = [
  {
    icon: Search,
    title: "Discovery",
    description: "8+ job boards scanned automatically. New roles appear while you sleep.",
  },
  {
    icon: Target,
    title: "AI Scoring",
    description: "Every job scored across 8 dimensions. See exactly why it matches.",
  },
  {
    icon: FileText,
    title: "Resume Tailoring",
    description: "Two custom resume variants per job. ATS-optimized, zero hallucination.",
  },
  {
    icon: Send,
    title: "Auto-Apply",
    description: "One-click submission. Or fully automatic for high-score matches.",
  },
  {
    icon: Users,
    title: "Outreach",
    description: "Find recruiters, generate personalized messages, track follow-ups.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Funnel metrics, rejection patterns, and weekly reports.",
  },
  {
    icon: MessageSquare,
    title: "AI Copilot",
    description: "Ask anything. Get context-aware advice. Execute actions.",
  },
  {
    icon: TrendingUp,
    title: "Market Intel",
    description: "Trending skills, hiring velocity, salary benchmarks.",
  },
]

// How it works steps
const steps = [
  {
    number: 1,
    title: "Create Profile",
    description: "Add your skills, experience, and preferences. Import from resume or LinkedIn.",
  },
  {
    number: 2,
    title: "AI Discovers Jobs",
    description: "8+ sources scanned on your schedule. New matches surface automatically.",
  },
  {
    number: 3,
    title: "Score & Generate",
    description: "Every job scored. Top matches get tailored resumes and cover letters.",
  },
  {
    number: 4,
    title: "Review & Apply",
    description: "Approve AI-generated content. Auto-submit or apply manually.",
  },
  {
    number: 5,
    title: "Track & Iterate",
    description: "Kanban board, analytics, interview prep, and negotiation support.",
  },
]

// Footer links
const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  company: [
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
  ],
}

function StickyNav() {
  const [isOpen, setIsOpen] = React.useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">Job Application OS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild className="rounded-lg">
            <Link href="/auth/signup">Start Free</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-lg font-medium hover:text-primary transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-lg font-medium hover:text-primary transition-colors"
              >
                How It Works
              </button>
              <div className="pt-4 border-t">
                <Button asChild className="w-full rounded-lg">
                  <Link href="/auth/signup">Start Free</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-14">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl">
            Your AI-powered job search command center
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground max-w-2xl">
            Discover, score, generate, apply, and track — all automated. You just review and approve.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" className="rounded-lg text-base px-8">
              <Link href="/auth/signup">
                Start Free — No Credit Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-lg text-base"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Everything you need to land your dream job
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            How it works
          </h2>
        </div>
        
        {/* Desktop - Horizontal steps */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-primary/30" />
          
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center max-w-[180px]"
            >
              {/* Number circle */}
              <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {step.number}
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile - Vertical steps */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-primary/30 my-2" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-slate-900 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl mb-8">
          Ready to automate your job search?
        </h2>
        <Button asChild size="lg" className="rounded-lg text-base px-8">
          <Link href="/auth/signup">
            Start Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Job Application OS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your AI-powered job search command center.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Job Application OS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StickyNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
