'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  OnboardingData,
  SENIORITY_OPTIONS,
  EMPLOYMENT_TYPES,
  CURRENCIES,
} from '@/lib/onboarding-types'

interface StepProfileBasicsProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const ROLE_SUGGESTIONS = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'Engineering Manager',
]

export function StepProfileBasics({ data, updateData }: StepProfileBasicsProps) {
  const [roleInput, setRoleInput] = useState(data.targetRole)
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [negativeLocationInput, setNegativeLocationInput] = useState('')

  const filteredRoles = ROLE_SUGGESTIONS.filter((role) =>
    role.toLowerCase().includes(roleInput.toLowerCase())
  )

  const handleAddLocation = (location: string) => {
    if (location && !data.locations.includes(location)) {
      updateData({ locations: [...data.locations, location] })
    }
    setLocationInput('')
  }

  const handleRemoveLocation = (location: string) => {
    updateData({ locations: data.locations.filter((l) => l !== location) })
  }

  const handleAddNegativeLocation = (location: string) => {
    if (location && !data.negativeLocations.includes(location)) {
      updateData({ negativeLocations: [...data.negativeLocations, location] })
    }
    setNegativeLocationInput('')
  }

  const handleRemoveNegativeLocation = (location: string) => {
    updateData({
      negativeLocations: data.negativeLocations.filter((l) => l !== location),
    })
  }

  const handleEmploymentTypeToggle = (type: string) => {
    if (data.employmentTypes.includes(type)) {
      updateData({
        employmentTypes: data.employmentTypes.filter((t) => t !== type),
      })
    } else {
      updateData({ employmentTypes: [...data.employmentTypes, type] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="profileName">Profile Name</Label>
        <Input
          id="profileName"
          placeholder="e.g., Backend Engineer Search"
          value={data.profileName}
          onChange={(e) => updateData({ profileName: e.target.value })}
          className="rounded-md"
        />
        <p className="text-xs text-muted-foreground">
          Give this search profile a memorable name
        </p>
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="targetRole">Target Role</Label>
        <Input
          id="targetRole"
          placeholder="e.g., Software Engineer"
          value={roleInput}
          onChange={(e) => {
            setRoleInput(e.target.value)
            updateData({ targetRole: e.target.value })
            setShowRoleSuggestions(true)
          }}
          onFocus={() => setShowRoleSuggestions(true)}
          onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
          className="rounded-md"
        />
        {showRoleSuggestions && roleInput && filteredRoles.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
            {filteredRoles.map((role) => (
              <button
                key={role}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
                onClick={() => {
                  setRoleInput(role)
                  updateData({ targetRole: role })
                  setShowRoleSuggestions(false)
                }}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seniority">Seniority Level</Label>
          <Select
            value={data.seniority}
            onValueChange={(value) => updateData({ seniority: value })}
          >
            <SelectTrigger className="w-full rounded-md">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {SENIORITY_OPTIONS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentTitle">Current Title</Label>
          <Input
            id="currentTitle"
            placeholder="e.g., Senior Developer"
            value={data.currentTitle}
            onChange={(e) => updateData({ currentTitle: e.target.value })}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Employment Types</Label>
        <div className="flex flex-wrap gap-4">
          {EMPLOYMENT_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`employment-${type}`}
                checked={data.employmentTypes.includes(type)}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="locations">Preferred Locations</Label>
        <div className="flex gap-2">
          <Input
            id="locations"
            placeholder="Add a city (e.g., San Francisco, CA)"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddLocation(locationInput)
              }
            }}
            className="rounded-md"
          />
        </div>
        {data.locations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.locations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {location}
                <button
                  onClick={() => handleRemoveLocation(location)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Work Mode Preferences</Label>
        <div className="flex gap-6">
          {(['remote', 'hybrid', 'onsite'] as const).map((mode) => (
            <div key={mode} className="flex items-center gap-2">
              <Switch
                id={`workmode-${mode}`}
                checked={data.workModes[mode]}
                onCheckedChange={(checked) =>
                  updateData({
                    workModes: { ...data.workModes, [mode]: checked },
                  })
                }
              />
              <Label
                htmlFor={`workmode-${mode}`}
                className="text-sm font-normal capitalize cursor-pointer"
              >
                {mode}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="negativeLocations">
          Never show jobs in...
        </Label>
        <div className="flex gap-2">
          <Input
            id="negativeLocations"
            placeholder="Add locations to exclude"
            value={negativeLocationInput}
            onChange={(e) => setNegativeLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddNegativeLocation(negativeLocationInput)
              }
            }}
            className="rounded-md"
          />
        </div>
        {data.negativeLocations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.negativeLocations.map((location) => (
              <Badge
                key={location}
                variant="outline"
                className="gap-1 pr-1 border-destructive/50 text-destructive"
              >
                {location}
                <button
                  onClick={() => handleRemoveNegativeLocation(location)}
                  className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Input
          id="yearsOfExperience"
          type="number"
          min={0}
          max={50}
          placeholder="0"
          value={data.yearsOfExperience || ''}
          onChange={(e) =>
            updateData({ yearsOfExperience: parseInt(e.target.value) || 0 })
          }
          className="w-32 rounded-md font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label>Salary Range</Label>
        <div className="flex items-center gap-3">
          <Select
            value={data.salaryRange.currency}
            onValueChange={(value) =>
              updateData({
                salaryRange: { ...data.salaryRange, currency: value },
              })
            }
          >
            <SelectTrigger className="w-24 rounded-md">
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
          <Input
            type="number"
            placeholder="Min"
            value={data.salaryRange.min || ''}
            onChange={(e) =>
              updateData({
                salaryRange: {
                  ...data.salaryRange,
                  min: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-32 rounded-md font-mono"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={data.salaryRange.max || ''}
            onChange={(e) =>
              updateData({
                salaryRange: {
                  ...data.salaryRange,
                  max: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-32 rounded-md font-mono"
          />
        </div>
      </div>
    </div>
  )
}
