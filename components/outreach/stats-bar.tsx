import { Card } from "@/components/ui/card"
import { Users, Send, Percent, Calendar } from "lucide-react"
import type { OutreachSummaryStats } from "@/lib/outreach-types"

interface StatsBarProps {
  stats: OutreachSummaryStats
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-t border-border bg-muted/30">
      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Contacts</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.totalContacts}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/10">
            <Send className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Messages Sent</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.messagesSent}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-green-500/10">
            <Percent className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Response Rate</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.responseRate}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Follow-ups Due Today</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              {stats.followUpsDueToday}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
