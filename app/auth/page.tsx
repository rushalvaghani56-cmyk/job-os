"use client"

import * as React from "react"
import Link from "next/link"
import { Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const [activeTab, setActiveTab] = React.useState("login")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <Card className="relative w-full max-w-md shadow-lg p-8 gap-0">
        <CardHeader className="p-0 pb-6">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
              <Briefcase className="size-5" />
            </div>
            <span className="text-xl font-semibold">Job OS</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Your AI-powered job search command center
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
