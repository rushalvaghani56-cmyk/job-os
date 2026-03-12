import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="bg-foreground py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-background sm:text-3xl">
            Ready to automate your job search?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-background/70 sm:text-base">
            Join thousands of job seekers who have streamlined their search with AI.
            Completely free — no credit card required.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-primary px-8 text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              <Link href="/auth/signup">Start Free Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
