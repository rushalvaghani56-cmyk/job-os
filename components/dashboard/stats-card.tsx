import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
  icon: LucideIcon
  accentColor?: "primary" | "green" | "amber" | "blue"
  miniBar?: {
    segments: { value: number; color: string }[]
  }
}

const accentColors = {
  primary: "border-l-primary",
  green: "border-l-green-500",
  amber: "border-l-amber-500",
  blue: "border-l-blue-500",
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accentColor = "primary",
  miniBar,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "p-5 hover:shadow-md transition-shadow border-l-4",
        accentColors[accentColor]
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-mono font-semibold">{value}</p>
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.direction === "up" && "text-green-600 dark:text-green-400",
                    trend.direction === "down" && "text-red-600 dark:text-red-400",
                    trend.direction === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend.direction === "up" && "↑"}
                  {trend.direction === "down" && "↓"}
                  {trend.value}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
            {miniBar && (
              <div className="flex h-1.5 w-full max-w-[120px] gap-0.5 rounded-full overflow-hidden">
                {miniBar.segments.map((segment, i) => (
                  <div
                    key={i}
                    className={cn("h-full", segment.color)}
                    style={{ width: `${segment.value}%` }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
