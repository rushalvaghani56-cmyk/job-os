const steps = [
  {
    number: 1,
    title: "Create Profile",
    description: "Upload your resume and set your job preferences in minutes.",
  },
  {
    number: 2,
    title: "AI Discovers Jobs",
    description: "Our AI scans thousands of sources to find matching opportunities.",
  },
  {
    number: 3,
    title: "Scores & Generates",
    description: "Each job gets a fit score and a tailored resume is generated.",
  },
  {
    number: 4,
    title: "Auto-Applies",
    description: "Approved jobs get applications submitted automatically.",
  },
  {
    number: 5,
    title: "Track & Iterate",
    description: "Monitor progress and refine your strategy with analytics.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            How it works
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            From profile to offer in five simple steps
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <div className="relative flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-0">
            {/* Connecting line - desktop only */}
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-border md:block" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
            </div>
            
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex w-full flex-col items-center text-center md:w-auto"
              >
                {/* Vertical line for mobile - connects to next step */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 h-8 w-0.5 -translate-x-1/2 bg-border md:hidden" aria-hidden="true" />
                )}
                
                {/* Step circle */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-semibold text-primary">
                  {step.number}
                </div>
                
                {/* Step content */}
                <div className="mt-4 max-w-[140px]">
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
