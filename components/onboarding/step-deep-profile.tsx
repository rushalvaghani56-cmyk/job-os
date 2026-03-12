'use client'

import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  OnboardingData,
  WORK_AUTHORIZATION_OPTIONS,
  LANGUAGE_PROFICIENCY,
  WRITING_TONES,
} from '@/lib/onboarding-types'
import { cn } from '@/lib/utils'

interface StepDeepProfileProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

function CompletenessIndicator({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            percentage === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && <Check className="h-3.5 w-3.5 text-green-500" />}
    </div>
  )
}

export function StepDeepProfile({ data, updateData }: StepDeepProfileProps) {
  const [newLanguage, setNewLanguage] = useState('')
  const [newProficiency, setNewProficiency] = useState('')
  const [newCustomKey, setNewCustomKey] = useState('')
  const [newCustomValue, setNewCustomValue] = useState('')

  const socialCompleteness =
    Object.values(data.socialUrls).filter((v) => v).length * 25

  const workAuthCompleteness = data.workAuthorization ? 100 : 0

  const languagesCompleteness = data.languages.length > 0 ? 100 : 0

  const workPrefCompleteness =
    [
      data.workPreferences.startDate,
      data.workPreferences.noticePeriod,
    ].filter((v) => v).length * 50

  const tonesCompleteness = data.writingTones.length > 0 ? 100 : 0

  const aiInstructionsCompleteness = data.aiInstructions ? 100 : 0

  const handleAddLanguage = () => {
    if (newLanguage && newProficiency) {
      updateData({
        languages: [
          ...data.languages,
          { language: newLanguage, proficiency: newProficiency },
        ],
      })
      setNewLanguage('')
      setNewProficiency('')
    }
  }

  const handleRemoveLanguage = (index: number) => {
    updateData({
      languages: data.languages.filter((_, i) => i !== index),
    })
  }

  const handleAddCustomField = () => {
    if (newCustomKey && newCustomValue) {
      updateData({
        customFields: [
          ...data.customFields,
          { key: newCustomKey, value: newCustomValue },
        ],
      })
      setNewCustomKey('')
      setNewCustomValue('')
    }
  }

  const handleRemoveCustomField = (index: number) => {
    updateData({
      customFields: data.customFields.filter((_, i) => i !== index),
    })
  }

  const handleToneToggle = (tone: string) => {
    if (data.writingTones.includes(tone)) {
      updateData({
        writingTones: data.writingTones.filter((t) => t !== tone),
      })
    } else {
      updateData({ writingTones: [...data.writingTones, tone] })
    }
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="social">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Social URLs</span>
              <CompletenessIndicator percentage={socialCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/..."
                  value={data.socialUrls.linkedin}
                  onChange={(e) =>
                    updateData({
                      socialUrls: { ...data.socialUrls, linkedin: e.target.value },
                    })
                  }
                  className="rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/..."
                  value={data.socialUrls.github}
                  onChange={(e) =>
                    updateData({
                      socialUrls: { ...data.socialUrls, github: e.target.value },
                    })
                  }
                  className="rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  placeholder="https://..."
                  value={data.socialUrls.portfolio}
                  onChange={(e) =>
                    updateData({
                      socialUrls: { ...data.socialUrls, portfolio: e.target.value },
                    })
                  }
                  className="rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/..."
                  value={data.socialUrls.twitter}
                  onChange={(e) =>
                    updateData({
                      socialUrls: { ...data.socialUrls, twitter: e.target.value },
                    })
                  }
                  className="rounded-md"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="work-auth">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Work Authorization</span>
              <CompletenessIndicator percentage={workAuthCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={data.workAuthorization}
                onValueChange={(value) =>
                  updateData({ workAuthorization: value })
                }
              >
                <SelectTrigger className="w-full rounded-md">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Languages</span>
              <CompletenessIndicator percentage={languagesCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {data.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((lang, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {lang.language} ({lang.proficiency})
                      <button
                        onClick={() => handleRemoveLanguage(index)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label>Proficiency</Label>
                  <Select
                    value={newProficiency}
                    onValueChange={setNewProficiency}
                  >
                    <SelectTrigger className="w-full rounded-md">
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
                  className="rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="work-pref">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Work Preferences</span>
              <CompletenessIndicator percentage={workPrefCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Earliest Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={data.workPreferences.startDate}
                    onChange={(e) =>
                      updateData({
                        workPreferences: {
                          ...data.workPreferences,
                          startDate: e.target.value,
                        },
                      })
                    }
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    placeholder="e.g., 2 weeks"
                    value={data.workPreferences.noticePeriod}
                    onChange={(e) =>
                      updateData({
                        workPreferences: {
                          ...data.workPreferences,
                          noticePeriod: e.target.value,
                        },
                      })
                    }
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="relocate"
                  checked={data.workPreferences.willingToRelocate}
                  onCheckedChange={(checked) =>
                    updateData({
                      workPreferences: {
                        ...data.workPreferences,
                        willingToRelocate: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="relocate" className="font-normal cursor-pointer">
                  Willing to relocate
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tones">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Writing Tones</span>
              <CompletenessIndicator percentage={tonesCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-3">
                Select the tones you prefer for AI-generated content
              </p>
              <div className="flex flex-wrap gap-3">
                {WRITING_TONES.map((tone) => (
                  <div key={tone} className="flex items-center gap-2">
                    <Checkbox
                      id={`tone-${tone}`}
                      checked={data.writingTones.includes(tone)}
                      onCheckedChange={() => handleToneToggle(tone)}
                    />
                    <Label
                      htmlFor={`tone-${tone}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tone}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="custom">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>Custom Fields</span>
              <CompletenessIndicator
                percentage={data.customFields.length > 0 ? 100 : 0}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {data.customFields.length > 0 && (
                <div className="space-y-2">
                  {data.customFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm font-medium">{field.key}:</span>
                      <span className="text-sm text-muted-foreground flex-1">
                        {field.value}
                      </span>
                      <button
                        onClick={() => handleRemoveCustomField(index)}
                        className="p-1 rounded hover:bg-muted-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    placeholder="e.g., Clearance Level"
                    value={newCustomKey}
                    onChange={(e) => setNewCustomKey(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label>Value</Label>
                  <Input
                    placeholder="e.g., Secret"
                    value={newCustomValue}
                    onChange={(e) => setNewCustomValue(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAddCustomField}
                  disabled={!newCustomKey || !newCustomValue}
                  className="rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-instructions">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between flex-1 pr-4">
              <span>AI Instructions</span>
              <CompletenessIndicator percentage={aiInstructionsCompleteness} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Textarea
                placeholder="e.g., Always emphasize distributed systems. Never mention Company X. Focus on leadership experience..."
                value={data.aiInstructions}
                onChange={(e) => updateData({ aiInstructions: e.target.value })}
                rows={4}
                className="rounded-md resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                These instructions will guide AI when generating resumes and
                cover letters for you.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
