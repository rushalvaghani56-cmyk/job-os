"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { useOnboardingStore } from "@/stores/onboardingStore"
import { FieldGroup, Field, FieldError } from "@/components/ui/field"
import { useState } from "react"

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Import" },
  { id: 3, label: "Deep Profile" },
  { id: 4, label: "Resumes" },
  { id: 5, label: "AI Keys" },
]

const SENIORITY_OPTIONS = [
  { value: "intern", label: "Internship/Co-op" },
  { value: "entry", label: "Entry Level/Fresh Graduate" },
  { value: "junior", label: "Junior (1-3 YOE)" },
  { value: "mid", label: "Mid-Level (3-6 YOE)" },
  { value: "senior", label: "Senior (6-10 YOE)" },
  { value: "staff", label: "Staff/Principal (10+)" },
  { value: "lead", label: "Lead/Manager" },
  { value: "director", label: "Director/VP/C-Level" },
]

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract/Freelance",
  "Temporary/Fixed-term",
]

const LOCATION_TYPES = [
  { id: "remote", label: "Fully Remote" },
  { id: "remote-tz", label: "Remote (timezone restricted)" },
  { id: "hybrid-flex", label: "Hybrid (flexible)" },
  { id: "hybrid-fixed", label: "Hybrid (fixed days)" },
  { id: "onsite", label: "Onsite" },
]

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "SGD"]

const ROLE_SUGGESTIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "Engineering Manager",
  "Machine Learning Engineer",
]

const step1Schema = z.object({
  profileName: z.string().min(1, "Profile name is required"),
  targetRole: z.string().min(1, "Target role is required"),
  currentTitle: z.string().optional(),
  yearsOfExperience: z.number().min(0).max(50),
  seniority: z.string().min(1, "Seniority level is required"),
  employmentTypes: z.array(z.string()).min(1, "Select at least one employment type"),
  locations: z.array(z.string()).default([]),
  locationTypes: z.array(z.string()).default([]),
  negativeLocations: z.array(z.string()).default([]),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default("USD"),
})

type Step1FormData = z.infer<typeof step1Schema>

export default function OnboardingStep1() {
  const router = useRouter()
  const { data, updateData, completedSteps, markStepComplete } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationInput, setLocationInput] = useState("")
  const [negativeLocationInput, setNegativeLocationInput] = useState("")
  const [roleInput, setRoleInput] = useState(data.targetRole || "")
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      profileName: data.profileName || "",
      targetRole: data.targetRole || "",
      currentTitle: data.currentTitle || "",
      yearsOfExperience: data.yearsOfExperience || 0,
      seniority: data.seniority || "",
      employmentTypes: data.employmentTypes || [],
      locations: data.locations || [],
      locationTypes: Object.entries(data.workModes || {})
        .filter(([, v]) => v)
        .map(([k]) => k),
      negativeLocations: data.negativeLocations || [],
      salaryMin: data.salaryRange?.min || undefined,
      salaryMax: data.salaryRange?.max || undefined,
      salaryCurrency: data.salaryRange?.currency || "USD",
    },
  })

  const watchedLocations = watch("locations")
  const watchedNegativeLocations = watch("negativeLocations")
  const watchedEmploymentTypes = watch("employmentTypes")
  const watchedLocationTypes = watch("locationTypes")

  const filteredRoles = ROLE_SUGGESTIONS.filter((role) =>
    role.toLowerCase().includes(roleInput.toLowerCase())
  )

  const handleAddLocation = () => {
    if (locationInput && !watchedLocations.includes(locationInput)) {
      setValue("locations", [...watchedLocations, locationInput])
      setLocationInput("")
    }
  }

  const handleRemoveLocation = (location: string) => {
    setValue(
      "locations",
      watchedLocations.filter((l) => l !== location)
    )
  }

  const handleAddNegativeLocation = () => {
    if (negativeLocationInput && !watchedNegativeLocations.includes(negativeLocationInput)) {
      setValue("negativeLocations", [...watchedNegativeLocations, negativeLocationInput])
      setNegativeLocationInput("")
    }
  }

  const handleRemoveNegativeLocation = (location: string) => {
    setValue(
      "negativeLocations",
      watchedNegativeLocations.filter((l) => l !== location)
    )
  }

  const handleEmploymentTypeToggle = (type: string) => {
    if (watchedEmploymentTypes.includes(type)) {
      setValue(
        "employmentTypes",
        watchedEmploymentTypes.filter((t) => t !== type)
      )
    } else {
      setValue("employmentTypes", [...watchedEmploymentTypes, type])
    }
  }

  const handleLocationTypeToggle = (type: string) => {
    if (watchedLocationTypes.includes(type)) {
      setValue(
        "locationTypes",
        watchedLocationTypes.filter((t) => t !== type)
      )
    } else {
      setValue("locationTypes", [...watchedLocationTypes, type])
    }
  }

  const onSubmit = async (formData: Step1FormData) => {
    setIsSubmitting(true)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 400))

    updateData({
      profileName: formData.profileName,
      targetRole: formData.targetRole,
      currentTitle: formData.currentTitle || "",
      yearsOfExperience: formData.yearsOfExperience,
      seniority: formData.seniority,
      employmentTypes: formData.employmentTypes,
      locations: formData.locations,
      workModes: {
        remote: formData.locationTypes.includes("remote") || formData.locationTypes.includes("remote-tz"),
        hybrid: formData.locationTypes.includes("hybrid-flex") || formData.locationTypes.includes("hybrid-fixed"),
        onsite: formData.locationTypes.includes("onsite"),
      },
      negativeLocations: formData.negativeLocations,
      salaryRange: {
        min: formData.salaryMin || 0,
        max: formData.salaryMax || 0,
        currency: formData.salaryCurrency,
      },
    })

    markStepComplete(1)
    setIsSubmitting(false)
    router.push("/onboarding/step-2")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <ProgressStepper steps={steps} currentStep={1} completedSteps={completedSteps} />
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Profile Basics</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tell us about your job search goals
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identity Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Identity</h3>

              <FieldGroup>
                <Field>
                  <Label htmlFor="profileName">
                    Profile Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="profileName"
                    placeholder="e.g., Backend Engineer Search"
                    {...register("profileName")}
                    aria-invalid={!!errors.profileName}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give this search profile a memorable name
                  </p>
                  {errors.profileName && (
                    <FieldError>{errors.profileName.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="targetRole">
                    Target Role <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="targetRole"
                      placeholder="e.g., Senior Backend Engineer"
                      value={roleInput}
                      {...register("targetRole", {
                        onChange: (e) => {
                          setRoleInput(e.target.value)
                          setShowRoleSuggestions(true)
                        },
                      })}
                      onFocus={() => setShowRoleSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
                      aria-invalid={!!errors.targetRole}
                    />
                    {showRoleSuggestions && roleInput && filteredRoles.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-auto">
                        {filteredRoles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
                            onClick={() => {
                              setRoleInput(role)
                              setValue("targetRole", role)
                              setShowRoleSuggestions(false)
                            }}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.targetRole && (
                    <FieldError>{errors.targetRole.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="currentTitle">Current Title</Label>
                    <Input
                      id="currentTitle"
                      placeholder="e.g., Software Engineer"
                      {...register("currentTitle")}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min={0}
                      max={50}
                      className="font-mono"
                      {...register("yearsOfExperience", { valueAsNumber: true })}
                      aria-invalid={!!errors.yearsOfExperience}
                    />
                    {errors.yearsOfExperience && (
                      <FieldError>{errors.yearsOfExperience.message}</FieldError>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </div>

            {/* Seniority & Employment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Seniority & Employment</h3>

              <FieldGroup>
                <Field>
                  <Label>
                    Seniority Level <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="seniority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          {SENIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.seniority && (
                    <FieldError>{errors.seniority.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <Label>
                    Employment Types <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={`employment-${type}`}
                          checked={watchedEmploymentTypes.includes(type)}
                          onCheckedChange={() => handleEmploymentTypeToggle(type)}
                        />
                        <Label
                          htmlFor={`employment-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.employmentTypes && (
                    <FieldError>{errors.employmentTypes.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>

            {/* Location Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Location Preferences</h3>

              <FieldGroup>
                <Field>
                  <Label htmlFor="locations">Preferred Locations</Label>
                  <div className="flex gap-2">
                    <Input
                      id="locations"
                      placeholder="Add a city (e.g., San Francisco, CA)"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddLocation()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddLocation}>
                      Add
                    </Button>
                  </div>
                  {watchedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchedLocations.map((location) => (
                        <Badge key={location} variant="secondary" className="gap-1 pr-1">
                          {location}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(location)}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </Field>

                <Field>
                  <Label>Location Types</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {LOCATION_TYPES.map((type) => (
                      <div key={type.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`location-${type.id}`}
                          checked={watchedLocationTypes.includes(type.id)}
                          onCheckedChange={() => handleLocationTypeToggle(type.id)}
                        />
                        <Label
                          htmlFor={`location-${type.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Field>

                <Field>
                  <Label htmlFor="negativeLocations">Never show jobs in...</Label>
                  <div className="flex gap-2">
                    <Input
                      id="negativeLocations"
                      placeholder="Add locations to exclude"
                      value={negativeLocationInput}
                      onChange={(e) => setNegativeLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddNegativeLocation()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddNegativeLocation}>
                      Add
                    </Button>
                  </div>
                  {watchedNegativeLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchedNegativeLocations.map((location) => (
                        <Badge
                          key={location}
                          variant="outline"
                          className="gap-1 pr-1 border-destructive/50 text-destructive"
                        >
                          {location}
                          <button
                            type="button"
                            onClick={() => handleRemoveNegativeLocation(location)}
                            className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </Field>
              </FieldGroup>
            </div>

            {/* Compensation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Compensation</h3>

              <Field>
                <Label>Salary Range</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  <Controller
                    name="salaryCurrency"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    type="number"
                    placeholder="Minimum"
                    className="w-32 font-mono"
                    {...register("salaryMin", { valueAsNumber: true })}
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Preferred"
                    className="w-32 font-mono"
                    {...register("salaryMax", { valueAsNumber: true })}
                  />
                </div>
              </Field>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-end pt-4 border-t">
              <Button type="submit" disabled={!isValid || isSubmitting} className="min-w-[120px]">
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
