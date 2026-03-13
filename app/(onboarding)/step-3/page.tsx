"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Plus, X, Check, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { useOnboardingStore } from "@/stores/onboardingStore"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Import" },
  { id: 3, label: "Deep Profile" },
  { id: 4, label: "Resumes" },
  { id: 5, label: "AI Keys" },
]

const WORK_AUTHORIZATION_OPTIONS = [
  "US Citizen",
  "Green Card Holder",
  "H1B Visa",
  "L1 Visa",
  "TN Visa",
  "OPT/CPT",
  "Tier 2 (UK)",
  "EU Blue Card",
  "Need Sponsorship",
  "Not Authorized",
]

const VISA_TYPES = ["H1B", "L1", "TN", "Tier 2", "EU Blue Card", "O1", "E2", "Other"]

const LANGUAGE_PROFICIENCY = ["Native", "Fluent", "Professional", "Conversational", "Basic"]

const COMPANY_SIZES = ["Startup (1-50)", "Scale-up (51-200)", "Mid-size (201-1000)", "Enterprise (1000+)"]

const COMPANY_STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Public"]

const INDUSTRIES = [
  "Fintech",
  "Healthcare",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "Cybersecurity",
  "EdTech",
  "Gaming",
  "Web3/Crypto",
  "Climate Tech",
  "Other",
]

const MANAGEMENT_OPTIONS = [
  { value: "ic", label: "IC only (no management)" },
  { value: "open", label: "Open to leading a team" },
  { value: "want", label: "Want management track" },
  { value: "coach", label: "Player-coach role" },
]

const WRITING_TONES = ["Professional", "Casual", "Technical", "Executive"]

const PRONOUNS = ["He/Him", "She/Her", "They/Them", "Custom"]

function CompletenessIndicator({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percentage === 100 ? "bg-success" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && <Check className="h-3.5 w-3.5 text-success" />}
    </div>
  )
}

export default function OnboardingStep3() {
  const router = useRouter()
  const { data, updateData, completedSteps, markStepComplete } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Local state for form fields
  const [socialUrls, setSocialUrls] = useState(data.socialUrls || { linkedin: "", github: "", portfolio: "", twitter: "" })
  const [workAuthorization, setWorkAuthorization] = useState("")
  const [visaType, setVisaType] = useState("")
  const [visaExpiry, setVisaExpiry] = useState("")
  const [relocationWillingness, setRelocationWillingness] = useState("")
  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>(data.languages || [])
  const [newLanguage, setNewLanguage] = useState("")
  const [newProficiency, setNewProficiency] = useState("")
  const [companySizes, setCompanySizes] = useState<string[]>([])
  const [companyStages, setCompanyStages] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [managementInterest, setManagementInterest] = useState("")
  const [dealBreakers, setDealBreakers] = useState<string[]>([])
  const [newDealBreaker, setNewDealBreaker] = useState("")
  const [resumeTone, setResumeTone] = useState("")
  const [coverLetterTone, setCoverLetterTone] = useState("")
  const [outreachTone, setOutreachTone] = useState("")
  const [pronouns, setPronouns] = useState("")
  const [bioSnippet, setBioSnippet] = useState("")
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>(data.customFields || [])
  const [newCustomKey, setNewCustomKey] = useState("")
  const [newCustomValue, setNewCustomValue] = useState("")
  const [aiInstructions, setAiInstructions] = useState(data.aiInstructions || "")
  const [customUrls, setCustomUrls] = useState<{ label: string; url: string }[]>([])
  const [newUrlLabel, setNewUrlLabel] = useState("")
  const [newUrlValue, setNewUrlValue] = useState("")

  // Calculate completeness for each section
  const socialCompleteness = Math.round(
    (Object.values(socialUrls).filter((v) => v).length / 4) * 100
  )
  const workAuthCompleteness = workAuthorization ? 100 : 0
  const languagesCompleteness = languages.length > 0 ? 100 : 0
  const workPrefCompleteness = Math.round(
    ([companySizes.length > 0, companyStages.length > 0, industries.length > 0, managementInterest].filter(Boolean).length / 4) * 100
  )
  const writingCompleteness = Math.round(
    ([resumeTone, coverLetterTone, outreachTone, pronouns].filter(Boolean).length / 4) * 100
  )
  const customCompleteness = customFields.length > 0 ? 100 : 0
  const aiInstructionsCompleteness = aiInstructions.trim() ? 100 : 0

  const handleAddLanguage = () => {
    if (newLanguage && newProficiency) {
      setLanguages([...languages, { language: newLanguage, proficiency: newProficiency }])
      setNewLanguage("")
      setNewProficiency("")
    }
  }

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const handleAddCustomField = () => {
    if (newCustomKey && newCustomValue) {
      setCustomFields([...customFields, { key: newCustomKey, value: newCustomValue }])
      setNewCustomKey("")
      setNewCustomValue("")
    }
  }

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const handleAddDealBreaker = () => {
    if (newDealBreaker && !dealBreakers.includes(newDealBreaker)) {
      setDealBreakers([...dealBreakers, newDealBreaker])
      setNewDealBreaker("")
    }
  }

  const handleRemoveDealBreaker = (item: string) => {
    setDealBreakers(dealBreakers.filter((d) => d !== item))
  }

  const handleAddCustomUrl = () => {
    if (newUrlLabel && newUrlValue) {
      setCustomUrls([...customUrls, { label: newUrlLabel, url: newUrlValue }])
      setNewUrlLabel("")
      setNewUrlValue("")
    }
  }

  const handleRemoveCustomUrl = (index: number) => {
    setCustomUrls(customUrls.filter((_, i) => i !== index))
  }

  const handleBack = () => {
    router.push("/step-2")
  }

  const handleSkip = () => {
    router.push("/step-4")
  }

  const handleContinue = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    updateData({
      socialUrls,
      workAuthorization,
      languages,
      customFields,
      aiInstructions,
    })

    markStepComplete(3)
    setIsSubmitting(false)
    router.push("/step-4")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <ProgressStepper steps={steps} currentStep={3} completedSteps={completedSteps} />
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Deep Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add additional details to enhance your profile
            </p>
          </div>

          <Accordion type="multiple" className="w-full space-y-2">
            {/* Social & Online Presence */}
            <AccordionItem value="social" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Social & Online Presence</span>
                  <CompletenessIndicator percentage={socialCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="linkedin">LinkedIn URL *</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/..."
                        value={socialUrls.linkedin}
                        onChange={(e) => setSocialUrls({ ...socialUrls, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/..."
                        value={socialUrls.github}
                        onChange={(e) => setSocialUrls({ ...socialUrls, github: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="portfolio">Portfolio/Personal Site</Label>
                      <Input
                        id="portfolio"
                        placeholder="https://..."
                        value={socialUrls.portfolio}
                        onChange={(e) => setSocialUrls({ ...socialUrls, portfolio: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/..."
                        value={socialUrls.twitter}
                        onChange={(e) => setSocialUrls({ ...socialUrls, twitter: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Custom URLs */}
                  {customUrls.length > 0 && (
                    <div className="space-y-2">
                      {customUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium">{url.label}:</span>
                          <span className="text-sm text-muted-foreground flex-1 truncate">{url.url}</span>
                          <button
                            onClick={() => handleRemoveCustomUrl(index)}
                            className="p-1 rounded hover:bg-muted-foreground/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label>Custom URL Label</Label>
                      <Input
                        placeholder="e.g., Dribbble"
                        value={newUrlLabel}
                        onChange={(e) => setNewUrlLabel(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Label>URL</Label>
                      <Input
                        placeholder="https://..."
                        value={newUrlValue}
                        onChange={(e) => setNewUrlValue(e.target.value)}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleAddCustomUrl}
                      disabled={!newUrlLabel || !newUrlValue}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Work Authorization */}
            <AccordionItem value="work-auth" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Work Authorization</span>
                  <CompletenessIndicator percentage={workAuthCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  <div className="space-y-1.5">
                    <Label>Authorization Status</Label>
                    <Select value={workAuthorization} onValueChange={setWorkAuthorization}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your work authorization" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_AUTHORIZATION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(workAuthorization.includes("Visa") || workAuthorization.includes("Tier")) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Visa Type</Label>
                        <Select value={visaType} onValueChange={setVisaType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                          <SelectContent>
                            {VISA_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Visa Expiry Date</Label>
                        <Input
                          type="date"
                          value={visaExpiry}
                          onChange={(e) => setVisaExpiry(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>Relocation Willingness</Label>
                    <Select value={relocationWillingness} onValueChange={setRelocationWillingness}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="conditional">Conditionally</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Languages */}
            <AccordionItem value="languages" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Languages</span>
                  <CompletenessIndicator percentage={languagesCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  {languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="gap-1 pr-1">
                          {lang.language} ({lang.proficiency})
                          <button
                            onClick={() => handleRemoveLanguage(index)}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label>Language</Label>
                      <Input
                        placeholder="e.g., Spanish"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Label>Proficiency</Label>
                      <Select value={newProficiency} onValueChange={setNewProficiency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_PROFICIENCY.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleAddLanguage}
                      disabled={!newLanguage || !newProficiency}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Work Preferences */}
            <AccordionItem value="work-pref" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Work Preferences</span>
                  <CompletenessIndicator percentage={workPrefCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  <div className="space-y-2">
                    <Label>Company Size Preferences</Label>
                    <div className="flex flex-wrap gap-3">
                      {COMPANY_SIZES.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={companySizes.includes(size)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCompanySizes([...companySizes, size])
                              } else {
                                setCompanySizes(companySizes.filter((s) => s !== size))
                              }
                            }}
                          />
                          <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Stage Preferences</Label>
                    <div className="flex flex-wrap gap-3">
                      {COMPANY_STAGES.map((stage) => (
                        <div key={stage} className="flex items-center gap-2">
                          <Checkbox
                            id={`stage-${stage}`}
                            checked={companyStages.includes(stage)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCompanyStages([...companyStages, stage])
                              } else {
                                setCompanyStages(companyStages.filter((s) => s !== stage))
                              }
                            }}
                          />
                          <Label htmlFor={`stage-${stage}`} className="text-sm font-normal cursor-pointer">
                            {stage}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry Preferences</Label>
                    <div className="flex flex-wrap gap-3">
                      {INDUSTRIES.map((industry) => (
                        <div key={industry} className="flex items-center gap-2">
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={industries.includes(industry)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIndustries([...industries, industry])
                              } else {
                                setIndustries(industries.filter((i) => i !== industry))
                              }
                            }}
                          />
                          <Label htmlFor={`industry-${industry}`} className="text-sm font-normal cursor-pointer">
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Management Interest</Label>
                    <Select value={managementInterest} onValueChange={setManagementInterest}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {MANAGEMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Deal Breakers</Label>
                    {dealBreakers.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dealBreakers.map((item) => (
                          <Badge key={item} variant="outline" className="gap-1 pr-1 border-destructive/50 text-destructive">
                            {item}
                            <button
                              onClick={() => handleRemoveDealBreaker(item)}
                              className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., no-oncall, no-travel, no-leetcode"
                        value={newDealBreaker}
                        onChange={(e) => setNewDealBreaker(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddDealBreaker()
                          }
                        }}
                      />
                      <Button variant="outline" onClick={handleAddDealBreaker}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Writing & Communication */}
            <AccordionItem value="writing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Writing & Communication</span>
                  <CompletenessIndicator percentage={writingCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Resume Tone</Label>
                      <Select value={resumeTone} onValueChange={setResumeTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {WRITING_TONES.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cover Letter Tone</Label>
                      <Select value={coverLetterTone} onValueChange={setCoverLetterTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {WRITING_TONES.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Outreach Tone</Label>
                      <Select value={outreachTone} onValueChange={setOutreachTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {WRITING_TONES.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Pronoun Preference</Label>
                      <Select value={pronouns} onValueChange={setPronouns}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pronouns" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRONOUNS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Bio Snippet (2-3 sentences)</Label>
                    <Textarea
                      placeholder="A brief professional summary about yourself..."
                      value={bioSnippet}
                      onChange={(e) => setBioSnippet(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Custom Fields */}
            <AccordionItem value="custom" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>Custom Fields</span>
                  <CompletenessIndicator percentage={customCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-4">
                  {customFields.length > 0 && (
                    <div className="space-y-2">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium">{field.key}:</span>
                          <span className="text-sm text-muted-foreground flex-1">{field.value}</span>
                          <button
                            onClick={() => handleRemoveCustomField(index)}
                            className="p-1 rounded hover:bg-muted-foreground/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label>Field Name</Label>
                      <Input
                        placeholder="e.g., Security Clearance"
                        value={newCustomKey}
                        onChange={(e) => setNewCustomKey(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Label>Value</Label>
                      <Input
                        placeholder="e.g., Secret"
                        value={newCustomValue}
                        onChange={(e) => setNewCustomValue(e.target.value)}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleAddCustomField}
                      disabled={!newCustomKey || !newCustomValue}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* AI Instructions */}
            <AccordionItem value="ai-instructions" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <span>AI Instructions</span>
                  <CompletenessIndicator percentage={aiInstructionsCompleteness} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">
                  <Textarea
                    placeholder="e.g., Always emphasize distributed systems experience. Never mention Company X. Focus on leadership roles."
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    These instructions guide how AI generates your resumes and cover letters.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
              Skip for now
            </Button>
            <Button onClick={handleContinue} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
