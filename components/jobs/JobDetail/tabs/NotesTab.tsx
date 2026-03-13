"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Pin,
  PinOff,
  Clock,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  tags?: string[];
}

interface NotesTabProps {
  jobId: string;
  isLoading?: boolean;
}

const mockNotes: Note[] = [
  {
    id: "note-1",
    content:
      "Had a great conversation with the recruiter Sarah. She mentioned they're looking for someone who can hit the ground running with their Kubernetes migration. Team seems collaborative and engineering-focused. Salary range confirmed at $180-220k + equity.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPinned: true,
    author: {
      name: "You",
      initials: "ME",
    },
    tags: ["recruiter-call", "compensation"],
  },
  {
    id: "note-2",
    content:
      "Research notes: Company raised Series C last year ($120M), growing engineering team from 50 to 150. Stack is Go + TypeScript + React. Strong emphasis on testing and CI/CD practices. Recent blog posts show they're investing heavily in developer experience.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isPinned: true,
    author: {
      name: "You",
      initials: "ME",
    },
    tags: ["research", "company-info"],
  },
  {
    id: "note-3",
    content:
      "Questions to ask in next interview:\n- What does the on-call rotation look like?\n- How are technical decisions made?\n- What's the path to Staff Engineer?\n- Remote work policy post-pandemic?",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isPinned: false,
    author: {
      name: "You",
      initials: "ME",
    },
    tags: ["interview-prep"],
  },
  {
    id: "note-4",
    content:
      "Technical screen went well. System design question was about designing a real-time notification system. Interviewer (Mike, Staff Eng) was friendly and gave good hints. Follow-up scheduled for next week.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isPinned: false,
    author: {
      name: "You",
      initials: "ME",
    },
    tags: ["interview", "technical"],
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}: {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        note.isPinned && "border-primary/50 bg-primary/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={note.author.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {note.author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{note.author.name}</span>
                {note.isPinned && (
                  <Pin className="h-3 w-3 text-primary fill-primary" />
                )}
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {note.content}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(note.createdAt)}</span>
                {note.updatedAt > note.createdAt && (
                  <span className="ml-1">(edited)</span>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Note actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTogglePin(note.id)}>
                {note.isPinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin to top
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function NoteCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotesTab({ jobId, isLoading = false }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);
  const sortedNotes = [...pinnedNotes, ...unpinnedNotes];

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      author: {
        name: "You",
        initials: "ME",
      },
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent("");
    setIsAddingNote(false);
    setIsSaving(false);
    toast.success("Note added successfully");
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editContent.trim()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setNotes(
      notes.map((n) =>
        n.id === editingNote.id
          ? { ...n, content: editContent.trim(), updatedAt: new Date() }
          : n
      )
    );
    setEditingNote(null);
    setEditContent("");
    setIsSaving(false);
    toast.success("Note updated successfully");
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;

    setNotes(notes.filter((n) => n.id !== deleteNoteId));
    setDeleteNoteId(null);
    toast.success("Note deleted");
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(
      notes.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
    const note = notes.find((n) => n.id === noteId);
    toast.success(note?.isPinned ? "Note unpinned" : "Note pinned");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          <NoteCardSkeleton />
          <NoteCardSkeleton />
          <NoteCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Notes</h3>
          <Badge variant="secondary" className="text-xs">
            {notes.length}
          </Badge>
        </div>
        {!isAddingNote && (
          <Button size="sm" onClick={() => setIsAddingNote(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card>
          <CardContent className="p-4">
            <Textarea
              placeholder="Write your note here... (interview feedback, research, questions to ask, etc.)"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[120px] resize-none mb-3"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent("");
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Note Dialog */}
      {editingNote && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Editing Note
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px] resize-none mb-3"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingNote(null);
                  setEditContent("");
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Add notes to track important details about this opportunity - interview feedback, research, questions to ask, and more."
          action={
            <Button size="sm" onClick={() => setIsAddingNote(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Note
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={setDeleteNoteId}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteNoteId}
        onOpenChange={() => setDeleteNoteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
