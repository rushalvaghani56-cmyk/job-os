"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { useFunnelData } from "@/hooks/useAnalytics"
import type { FunnelStage } from "@/types/analytics"

function FunnelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Map API FunnelStage[] to the local FunnelNode shape used by the diagram */
function mapStagesToNodes(stages: FunnelStage[]) {
  return stages.map((s, i) => ({
    id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: s.name,
    value: s.count,
    color: `hsl(var(--chart-${(i % 5) + 1}))`,
  }))
}

/** Map API FunnelStage[] to the local ConversionRow shape used by the table */
function mapStagesToConversionRows(stages: FunnelStage[]) {
  return stages.slice(1).map((s, i) => ({
    from: stages[i].name,
    to: s.name,
    count: s.count,
    rate: s.conversion_rate,
    changeVsLastPeriod: s.change,
  }))
}

// Simple Sankey-like visualization using SVG
function SankeyDiagram({ funnelNodes }: { funnelNodes: { id: string; name: string; value: number; color: string }[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 })
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null)

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 400,
        })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const { width, height } = dimensions
  const padding = { top: 40, right: 120, bottom: 40, left: 20 }
  const nodeWidth = 24
  const nodeSpacing = (width - padding.left - padding.right - nodeWidth) / (funnelNodes.length - 1)

  // Calculate node positions
  const maxValue = Math.max(...funnelNodes.map(n => n.value))
  const nodePositions = funnelNodes.map((node, i) => {
    const nodeHeight = Math.max((node.value / maxValue) * (height - padding.top - padding.bottom - 60), 40)
    return {
      ...node,
      x: padding.left + i * nodeSpacing,
      y: (height - nodeHeight) / 2,
      width: nodeWidth,
      height: nodeHeight,
    }
  })

  // Generate smooth curved paths between nodes
  const generatePath = (sourceIdx: number, targetIdx: number) => {
    const source = nodePositions[sourceIdx]
    const target = nodePositions[targetIdx]
    
    const sourceX = source.x + source.width
    const targetX = target.x
    const sourceY = source.y + source.height / 2
    const targetY = target.y + target.height / 2
    
    const linkThickness = Math.max((target.value / source.value) * source.height * 0.8, 8)
    const controlPointOffset = (targetX - sourceX) / 2

    return {
      path: `
        M ${sourceX} ${sourceY - linkThickness / 2}
        C ${sourceX + controlPointOffset} ${sourceY - linkThickness / 2},
          ${targetX - controlPointOffset} ${targetY - linkThickness / 2},
          ${targetX} ${targetY - linkThickness / 2}
        L ${targetX} ${targetY + linkThickness / 2}
        C ${targetX - controlPointOffset} ${targetY + linkThickness / 2},
          ${sourceX + controlPointOffset} ${sourceY + linkThickness / 2},
          ${sourceX} ${sourceY + linkThickness / 2}
        Z
      `,
      thickness: linkThickness,
    }
  }

  const links = funnelNodes.slice(0, -1).map((_, i) => ({
    id: `link-${i}`,
    sourceIdx: i,
    targetIdx: i + 1,
    ...generatePath(i, i + 1),
  }))

  // Gradient colors from indigo to emerald
  const gradientColors = [
    "hsl(239, 84%, 67%)", // indigo-500
    "hsl(224, 76%, 62%)",
    "hsl(199, 89%, 57%)",
    "hsl(173, 80%, 50%)",
    "hsl(160, 84%, 45%)",
    "hsl(152, 76%, 42%)",
    "hsl(142, 71%, 35%)", // emerald-600
  ]

  return (
    <div ref={containerRef} className="relative w-full">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          {links.map((link, i) => (
            <linearGradient
              key={`gradient-${link.id}`}
              id={`gradient-${link.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradientColors[i]} />
              <stop offset="100%" stopColor={gradientColors[i + 1]} />
            </linearGradient>
          ))}
        </defs>

        {/* Links */}
        <g>
          {links.map((link) => {
            const isHovered = hoveredLink === link.id || 
                             hoveredNode === funnelNodes[link.sourceIdx].id ||
                             hoveredNode === funnelNodes[link.targetIdx].id
            return (
              <path
                key={link.id}
                d={link.path}
                fill={`url(#gradient-${link.id})`}
                opacity={hoveredLink || hoveredNode ? (isHovered ? 0.8 : 0.2) : 0.6}
                className="transition-opacity duration-200"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              />
            )
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodePositions.map((node, i) => {
            const isHovered = hoveredNode === node.id
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={4}
                  fill={gradientColors[i]}
                  className={cn(
                    "transition-all duration-200",
                    isHovered && "filter drop-shadow-lg"
                  )}
                  style={{
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px`,
                  }}
                />
                {/* Node label */}
                <text
                  x={node.x + node.width / 2}
                  y={node.y - 12}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {node.name}
                </text>
                {/* Node value */}
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height + 20}
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs font-mono"
                >
                  {node.value.toLocaleString()}
                </text>
                {/* Conversion rate (except for first node) */}
                {i > 0 && (
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + node.height + 36}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {((node.value / funnelNodes[i - 1].value) * 100).toFixed(1)}%
                  </text>
                )}
              </g>
            )
          })}
        </g>

        {/* Tooltip */}
        {hoveredNode && (
          <foreignObject
            x={nodePositions.find(n => n.id === hoveredNode)!.x - 60}
            y={nodePositions.find(n => n.id === hoveredNode)!.y - 70}
            width={140}
            height={60}
          >
            <div className="rounded-lg border bg-popover p-2 shadow-md">
              <p className="text-sm font-medium">
                {funnelNodes.find(n => n.id === hoveredNode)?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Count: {funnelNodes.find(n => n.id === hoveredNode)?.value.toLocaleString()}
              </p>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  )
}

export function TabFunnel() {
  const { data, isLoading, error } = useFunnelData()

  if (isLoading) {
    return <FunnelSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <p className="text-sm text-destructive">Failed to load funnel data. Please try again later.</p>
      </div>
    )
  }

  const stages = data?.stages ?? []
  const funnelNodes = mapStagesToNodes(stages)
  const conversionRows = mapStagesToConversionRows(stages)

  return (
    <div className="space-y-6">
      {/* Sankey Diagram */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Application Funnel</h3>
        <SankeyDiagram funnelNodes={funnelNodes} />
      </div>

      {/* Conversion Rate Table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <h3 className="text-sm font-semibold">Conversion Rates</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">From</TableHead>
              <TableHead className="text-xs">To</TableHead>
              <TableHead className="text-right text-xs">Count</TableHead>
              <TableHead className="text-right text-xs">Rate</TableHead>
              <TableHead className="text-right text-xs">vs Last Period</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversionRows.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm">{row.from}</TableCell>
                <TableCell className="text-sm">{row.to}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.rate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1 font-mono",
                      row.changeVsLastPeriod > 0 && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      row.changeVsLastPeriod < 0 && "bg-red-500/10 text-red-600 dark:text-red-400",
                      row.changeVsLastPeriod === 0 && "bg-muted text-muted-foreground"
                    )}
                  >
                    {row.changeVsLastPeriod > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : row.changeVsLastPeriod < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {row.changeVsLastPeriod > 0 && "+"}
                    {row.changeVsLastPeriod.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
