'use client'

import { useState } from 'react'
import { Eye, EyeOff, ExternalLink, Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OnboardingData } from '@/lib/onboarding-types'

interface StepAIKeysProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const providers = [
  {
    id: 'anthropic' as const,
    name: 'Anthropic',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500',
    bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
    helpUrl: 'https://console.anthropic.com/settings/keys',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },
  {
    id: 'openai' as const,
    name: 'OpenAI',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    bgHover: 'hover:bg-green-50 dark:hover:bg-green-950/20',
    helpUrl: 'https://platform.openai.com/api-keys',
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  },
  {
    id: 'google' as const,
    name: 'Google',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
    helpUrl: 'https://aistudio.google.com/app/apikey',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
  },
]

const tasks = [
  { id: 'resumeTailoring', name: 'Resume Tailoring' },
  { id: 'coverLetter', name: 'Cover Letter' },
  { id: 'jobMatching', name: 'Job Matching' },
] as const

export function StepAIKeys({ data, updateData }: StepAIKeysProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [testingKey, setTestingKey] = useState<string | null>(null)

  const toggleShowKey = (providerId: string) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  const handleKeyChange = (
    providerId: 'anthropic' | 'openai' | 'google',
    key: string
  ) => {
    updateData({
      apiKeys: {
        ...data.apiKeys,
        [providerId]: { key, valid: null },
      },
    })
  }

  const testKey = async (providerId: 'anthropic' | 'openai' | 'google') => {
    setTestingKey(providerId)
    // Simulate API key validation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const isValid = data.apiKeys[providerId].key.length > 10
    updateData({
      apiKeys: {
        ...data.apiKeys,
        [providerId]: { ...data.apiKeys[providerId], valid: isValid },
      },
    })
    setTestingKey(null)
  }

  const hasValidKey = Object.values(data.apiKeys).some((k) => k.valid === true)

  const getAvailableProviders = () =>
    providers.filter((p) => data.apiKeys[p.id].valid === true)

  const getModelsForProvider = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    return provider?.models || []
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Connect AI Providers</h3>
        <p className="text-sm text-muted-foreground">
          Add at least one API key to enable AI features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const keyData = data.apiKeys[provider.id]
          const isValid = keyData.valid === true
          const isInvalid = keyData.valid === false
          const isTesting = testingKey === provider.id

          return (
            <div
              key={provider.id}
              className={cn(
                'rounded-xl border-2 p-5 transition-all',
                isValid && provider.borderColor,
                !isValid && 'border-border',
                provider.bgHover
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn('h-10 w-10 rounded-lg', provider.color)}
                />
                <div>
                  <p className="font-semibold">{provider.name}</p>
                  <a
                    href={provider.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                  >
                    How to get a key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={keyData.key}
                    onChange={(e) =>
                      handleKeyChange(provider.id, e.target.value)
                    }
                    className={cn(
                      'pr-10 rounded-md font-mono text-sm',
                      isValid && 'border-green-500',
                      isInvalid && 'border-destructive'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(provider.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKeys[provider.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testKey(provider.id)}
                    disabled={!keyData.key || isTesting}
                    className="flex-1 rounded-lg"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test Key'
                    )}
                  </Button>
                  {isValid && (
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Valid</span>
                    </div>
                  )}
                  {isInvalid && (
                    <div className="flex items-center gap-1 text-destructive">
                      <X className="h-4 w-4" />
                      <span className="text-xs font-medium">Invalid</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!hasValidKey && (
        <p className="text-sm text-destructive text-center">
          At least one valid API key is required to continue
        </p>
      )}

      {hasValidKey && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Default Model Assignments</h4>
            <p className="text-sm text-muted-foreground">
              Choose which provider and model to use for each task
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Task</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const assignment = data.modelAssignments[task.id]
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <Select
                          value={assignment.provider}
                          onValueChange={(value) =>
                            updateData({
                              modelAssignments: {
                                ...data.modelAssignments,
                                [task.id]: {
                                  provider: value,
                                  model: '',
                                },
                              },
                            })
                          }
                        >
                          <SelectTrigger className="w-[140px] rounded-md">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableProviders().map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={assignment.model}
                          onValueChange={(value) =>
                            updateData({
                              modelAssignments: {
                                ...data.modelAssignments,
                                [task.id]: {
                                  ...assignment,
                                  model: value,
                                },
                              },
                            })
                          }
                          disabled={!assignment.provider}
                        >
                          <SelectTrigger className="w-[180px] rounded-md">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {getModelsForProvider(assignment.provider).map(
                              (model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <Label>Copilot Model</Label>
            <p className="text-xs text-muted-foreground mb-2">
              This model powers the AI assistant throughout the app
            </p>
            <div className="flex gap-3">
              <Select
                value={data.copilotModel.provider}
                onValueChange={(value) =>
                  updateData({
                    copilotModel: { provider: value, model: '' },
                  })
                }
              >
                <SelectTrigger className="w-[140px] rounded-md">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProviders().map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={data.copilotModel.model}
                onValueChange={(value) =>
                  updateData({
                    copilotModel: { ...data.copilotModel, model: value },
                  })
                }
                disabled={!data.copilotModel.provider}
              >
                <SelectTrigger className="w-[180px] rounded-md">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {getModelsForProvider(data.copilotModel.provider).map(
                    (model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
