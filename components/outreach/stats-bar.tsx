import { Card } from "@/components/ui/card"
import { Send, Eye, Reply, Star, Clock } from "lucide-react"
import type { OutreachStats } from "@/lib/outreach-types"

interface StatsBarProps {
  stats: OutreachStats
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-t border-border bg-muted/30">
      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Send className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sent</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.sent}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Open Rate</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.openRate}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-green-500/10">
            <Reply className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reply Rate</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.replyRate}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10">
            <Star className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Template</p>
            <p className="text-sm font-medium text-foreground truncate">
              {stats.bestTemplate}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
