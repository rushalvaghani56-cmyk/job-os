import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, CheckSquare, Send, Calendar, TrendingUp, Target } from "lucide-react"

const stats = [
  {
    title: "Jobs Found",
    value: "247",
    change: "+12 today",
    icon: Briefcase,
    trend: "up",
  },
  {
    title: "Pending Review",
    value: "24",
    change: "8 high match",
    icon: CheckSquare,
    trend: "neutral",
  },
  {
    title: "Applications",
    value: "38",
    change: "5 this week",
    icon: Send,
    trend: "up",
  },
  {
    title: "Interviews",
    value: "3",
    change: "Next: Tomorrow",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Response Rate",
    value: "24%",
    change: "+3% vs last month",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Match Score Avg",
    value: "78",
    change: "Top 15%",
    icon: Target,
    trend: "up",
  },
]

const recentActivity = [
  { action: "Applied to", target: "Senior Frontend Engineer at Vercel", time: "2h ago" },
  { action: "Interview scheduled", target: "Stripe - Technical Round", time: "3h ago" },
  { action: "New job match", target: "Staff Engineer at Linear (92% match)", time: "5h ago" },
  { action: "Resume tailored", target: "For Notion application", time: "1d ago" },
  { action: "Outreach sent", target: "Engineering Manager at Figma", time: "1d ago" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, John. Here's your job search overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend === "up" && (
                  <span className="text-green-600 dark:text-green-400">↑ </span>
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest job search actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs font-normal">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
