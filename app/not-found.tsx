"use client"

import { useRouter } from "next/navigation"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="default" asChild>
          <Link href="/dashboard" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
