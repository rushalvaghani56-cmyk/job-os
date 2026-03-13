"use client";

import { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Settings2,
  ChevronDown,
  Wand2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MockJob } from "@/lib/mock-data/jobs";

interface ContentTabProps {
  job: MockJob;
}

// Mock generated content
function generateMockCoverLetter(job: MockJob) {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in software engineering and passion for building impactful products, I believe I would be an excellent addition to your team.

Throughout my career, I have developed expertise in ${job.skills_matched?.slice(0, 3).join(", ") || "modern web technologies"}, which directly align with the requirements for this role. At my previous position, I led initiatives that improved system performance by 40% and contributed to launching products that serve millions of users.

What excites me most about ${job.company} is your commitment to innovation and the opportunity to work on challenging problems at scale. I am particularly drawn to your focus on ${job.work_location_type === "remote" ? "building a distributed team culture" : "collaborative in-office work"} and believe my experience would contribute meaningfully to your goals.

I am eager to bring my technical skills, collaborative mindset, and passion for excellence to ${job.company}. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success.

Thank you for considering my application.

Best regards,
[Your Name]`;
}

function generateMockResumeTailoring(job: MockJob) {
  return {
    highlights: [
      `Add "${job.skills_matched?.[0] || "React"}" to skills section with 4+ years experience`,
      `Emphasize "${job.seniority}" level experience in summary`,
      `Include metrics showing ${job.work_location_type === "remote" ? "remote team collaboration" : "cross-functional teamwork"}`,
      `Add projects using ${job.skills_matched?.slice(0, 2).join(" and ") || "relevant technologies"}`,
    ],
    summary: `Results-driven ${job.seniority} software engineer with 5+ years of experience building scalable applications. Proven track record in ${job.skills_matched?.slice(0, 3).join(", ") || "modern web development"}. Passionate about ${job.work_location_type === "remote" ? "distributed team collaboration" : "collaborative development"} and delivering high-quality software solutions.`,
  };
}

type ToneOption = "professional" | "conversational" | "enthusiastic";

export function ContentTab({ job }: ContentTabProps) {
  const [coverLetter, setCoverLetter] = useState(generateMockCoverLetter(job));
  const [resumeTailoring] = useState(generateMockResumeTailoring(job));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);
  const [tone, setTone] = useState<ToneOption>("professional");
  const [length, setLength] = useState([75]); // percentage
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCoverLetter(generateMockCoverLetter(job));
      setIsGenerating(false);
      toast.success("Cover letter regenerated");
    }, 1500);
  };

  const handleCopyCoverLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopiedCover(true);
    toast.success("Cover letter copied");
    setTimeout(() => setCopiedCover(false), 2000);
  };

  const handleCopyResumeSummary = async () => {
    await navigator.clipboard.writeText(resumeTailoring.summary);
    setCopiedResume(true);
    toast.success("Summary copied");
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleFeedback = (type: "positive" | "negative") => {
    toast.success(`Feedback recorded. ${type === "positive" ? "Thanks!" : "We'll improve."}`);
  };

  return (
    <div className="space-y-6">
      {/* AI Status */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-500/20 p-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-medium">AI-Generated Content</p>
            <p className="text-xs text-muted-foreground">
              Personalized based on your profile and this job
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600">
          Ready
        </Badge>
      </div>

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-500" />
              Cover Letter
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeedback("positive")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Good quality</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeedback("negative")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Needs improvement</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings */}
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Settings2 className="mr-2 h-4 w-4" />
                Generation Settings
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    settingsOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={(v) => setTone(v as ToneOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Length: {length[0]}%
                  </label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    min={25}
                    max={150}
                    step={25}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Cover Letter Text */}
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleRegenerate}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
            <Button onClick={handleCopyCoverLetter} variant="outline">
              {copiedCover ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume Tailoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-green-500" />
            Resume Tailoring Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Highlights */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Key Changes</h4>
            <ul className="space-y-2">
              {resumeTailoring.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-medium text-green-600">
                    {idx + 1}
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Generated Summary */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">Tailored Summary</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyResumeSummary}
              >
                {copiedResume ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copy
              </Button>
            </div>
            <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              {resumeTailoring.summary}
            </p>
          </div>

          {/* Download Options */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Tailored Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
