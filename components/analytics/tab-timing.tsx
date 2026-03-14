"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { timingData } from "./mock-data"

function TimingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="mb-1 h-5 w-40" />
        <Skeleton className="mb-4 h-4 w-72" />
        <Skeleton className="h-[360px] w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am to 7pm

// Generate heatmap data with realistic patterns
function generateHeatmapData() {
  const data: { day: string; hour: number; value: number }[] = []
  
  days.forEach((day) => {
    hours.forEach((hour) => {
      // Simulate realistic response patterns
      let baseValue = 20
      
      // Higher during business hours
      if (hour >= 9 && hour <= 17) baseValue += 20
      
      // Peak mid-morning
      if (hour >= 10 && hour <= 11) baseValue += 15
      
      // Tuesday/Wednesday tend to be best
      if (day === "Tue" || day === "Wed") baseValue += 10
      
      // Lower on weekends
      if (day === "Sat" || day === "Sun") baseValue = Math.max(5, baseValue - 30)
      
      // Add some randomness
      const value = Math.min(100, Math.max(0, baseValue + Math.random() * 20 - 10))
      
      data.push({ day, hour, value: Math.round(value) })
    })
  })
  
  return data
}

const heatmapData = generateHeatmapData()

function getColorForValue(value: number) {
  if (value >= 50) return "bg-emerald-500"
  if (value >= 40) return "bg-emerald-400"
  if (value >= 30) return "bg-emerald-300 dark:bg-emerald-600"
  if (value >= 20) return "bg-emerald-200 dark:bg-emerald-700"
  if (value >= 10) return "bg-emerald-100 dark:bg-emerald-800"
  return "bg-muted"
}

export function TabTiming() {
  const [selectedCell, setSelectedCell] = React.useState<{ day: string; hour: number } | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])
  
  const selectedData = selectedCell 
    ? heatmapData.find(d => d.day === selectedCell.day && d.hour === selectedCell.hour)
    : null

  // Find best times
  const sortedByValue = [...heatmapData].sort((a, b) => b.value - a.value)
  
  if (isLoading) {
    return <TimingSkeleton />
  }
  const bestTimes = sortedByValue.slice(0, 5)
  const worstTimes = sortedByValue.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Heatmap */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-1 text-sm font-semibold">Response Rate Heatmap</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Estimated response rates by day and time based on historical data
        </p>
        
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="mb-2 ml-12 flex">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="flex-1 text-center text-xs text-muted-foreground"
                >
                  {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : `${hour}am`}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {days.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-10 text-xs text-muted-foreground">{day}</div>
                  <div className="flex flex-1 gap-1">
                    {hours.map((hour) => {
                      const cell = heatmapData.find(d => d.day === day && d.hour === hour)
                      const isSelected = selectedCell?.day === day && selectedCell?.hour === hour
                      return (
                        <button
                          key={hour}
                          onClick={() => setSelectedCell(isSelected ? null : { day, hour })}
                          className={cn(
                            "flex-1 h-8 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            getColorForValue(cell?.value || 0),
                            isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          )}
                          title={`${day} ${hour}:00 - ${cell?.value}% response rate`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-xs text-muted-foreground">Lower</span>
              <div className="flex gap-1">
                <div className="h-4 w-6 rounded-sm bg-muted" />
                <div className="h-4 w-6 rounded-sm bg-emerald-100 dark:bg-emerald-800" />
                <div className="h-4 w-6 rounded-sm bg-emerald-200 dark:bg-emerald-700" />
                <div className="h-4 w-6 rounded-sm bg-emerald-300 dark:bg-emerald-600" />
                <div className="h-4 w-6 rounded-sm bg-emerald-400" />
                <div className="h-4 w-6 rounded-sm bg-emerald-500" />
              </div>
              <span className="text-xs text-muted-foreground">Higher</span>
            </div>
          </div>
        </div>

        {/* Selected cell details */}
        {selectedData && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">
              {selectedCell?.day} at {selectedCell!.hour > 12 ? `${selectedCell!.hour - 12}pm` : `${selectedCell?.hour}am`}
            </p>
            <p className="text-xs text-muted-foreground">
              Estimated response rate: <span className="font-mono font-medium">{selectedData.value}%</span>
            </p>
          </div>
        )}
      </div>

      {/* Best/Worst Times */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Best Times to Apply
          </h3>
          <div className="space-y-2">
            {bestTimes.map((time, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2">
                <span className="text-sm">
                  {time.day} {time.hour > 12 ? `${time.hour - 12}pm` : `${time.hour}am`}
                </span>
                <span className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {time.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-red-600 dark:text-red-400">
            Avoid These Times
          </h3>
          <div className="space-y-2">
            {worstTimes.map((time, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-red-500/10 px-3 py-2">
                <span className="text-sm">
                  {time.day} {time.hour > 12 ? `${time.hour - 12}pm` : `${time.hour}am`}
                </span>
                <span className="font-mono text-sm font-medium text-red-600 dark:text-red-400">
                  {time.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Timing Insights</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Best Day</p>
            <p className="mt-1 text-lg font-semibold">Tuesday</p>
            <p className="text-xs text-muted-foreground">38% avg response rate</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Best Hour</p>
            <p className="mt-1 text-lg font-semibold">10:00 AM</p>
            <p className="text-xs text-muted-foreground">42% avg response rate</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Avoid</p>
            <p className="mt-1 text-lg font-semibold">Weekends</p>
            <p className="text-xs text-muted-foreground">8% avg response rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
