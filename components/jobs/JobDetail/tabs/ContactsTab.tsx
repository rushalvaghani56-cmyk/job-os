"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Linkedin,
  Plus,
  Search,
  ExternalLink,
  MessageSquare,
  Send,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MockJob } from "@/lib/mock-data/jobs";

interface ContactsTabProps {
  job: MockJob;
}

type ContactRole = "hiring_manager" | "recruiter" | "engineer" | "founder" | "hr" | "other";

interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  title: string;
  email?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  lastContacted?: Date;
  notes?: string;
}

// Generate mock contacts
function generateMockContacts(job: MockJob): Contact[] {
  const firstNames = ["Sarah", "Michael", "Emily", "David", "Jessica", "James"];
  const lastNames = ["Chen", "Johnson", "Williams", "Brown", "Garcia", "Miller"];
  
  return [
    {
      id: "1",
      name: `${firstNames[0]} ${lastNames[0]}`,
      role: "hiring_manager",
      title: "Engineering Manager",
      email: `${firstNames[0].toLowerCase()}.${lastNames[0].toLowerCase()}@${job.company.toLowerCase().replace(/\s+/g, "")}.com`,
      linkedinUrl: "https://linkedin.com/in/example",
      lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: `${firstNames[1]} ${lastNames[1]}`,
      role: "recruiter",
      title: "Technical Recruiter",
      email: `${firstNames[1].toLowerCase()}.${lastNames[1].toLowerCase()}@${job.company.toLowerCase().replace(/\s+/g, "")}.com`,
      linkedinUrl: "https://linkedin.com/in/example2",
      lastContacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: "Very responsive, prefers email",
    },
    {
      id: "3",
      name: `${firstNames[2]} ${lastNames[2]}`,
      role: "engineer",
      title: "Senior Software Engineer",
      linkedinUrl: "https://linkedin.com/in/example3",
    },
  ];
}

const roleLabels: Record<ContactRole, string> = {
  hiring_manager: "Hiring Manager",
  recruiter: "Recruiter",
  engineer: "Engineer",
  founder: "Founder",
  hr: "HR",
  other: "Other",
};

const roleColors: Record<ContactRole, string> = {
  hiring_manager: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  recruiter: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  engineer: "bg-green-500/10 text-green-600 border-green-500/30",
  founder: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  hr: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  other: "bg-slate-500/10 text-slate-600 border-slate-500/30",
};

function ContactCard({ contact }: { contact: Contact }) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={contact.avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-muted-foreground">{contact.title}</p>
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs", roleColors[contact.role])}
              >
                {roleLabels[contact.role]}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {contact.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="mr-2 h-3 w-3" />
                    Email
                  </a>
                </Button>
              )}
              {contact.linkedinUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-3 w-3" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>

            {contact.lastContacted && (
              <p className="mt-2 text-xs text-muted-foreground">
                Last contacted:{" "}
                {contact.lastContacted.toLocaleDateString()}
              </p>
            )}

            {contact.notes && (
              <p className="mt-2 text-xs text-muted-foreground italic">
                Note: {contact.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactsTab({ job }: ContactsTabProps) {
  const [contacts, setContacts] = useState(generateMockContacts(job));
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "other" as ContactRole,
    title: "",
    email: "",
    linkedinUrl: "",
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContact.name || !newContact.title) {
      toast.error("Please fill in required fields");
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: "",
      role: "other",
      title: "",
      email: "",
      linkedinUrl: "",
    });
    setIsAddingContact(false);
    toast.success("Contact added");
  };

  const groupedContacts = {
    primary: filteredContacts.filter(
      (c) => c.role === "hiring_manager" || c.role === "recruiter"
    ),
    team: filteredContacts.filter(
      (c) => c.role === "engineer" || c.role === "founder"
    ),
    other: filteredContacts.filter(
      (c) => c.role === "hr" || c.role === "other"
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription>
                Add a new contact related to this job at {job.company}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newContact.title}
                  onChange={(e) =>
                    setNewContact({ ...newContact, title: e.target.value })
                  }
                  placeholder="Engineering Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newContact.role}
                  onValueChange={(v) =>
                    setNewContact({ ...newContact, role: v as ContactRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={newContact.linkedinUrl}
                  onChange={(e) =>
                    setNewContact({ ...newContact, linkedinUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Company Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{job.company}</p>
              <p className="text-sm text-muted-foreground">
                {contacts.length} contacts found
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contacts */}
      {groupedContacts.primary.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Primary Contacts
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {groupedContacts.primary.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      {groupedContacts.team.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Team Members
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {groupedContacts.team.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Other */}
      {groupedContacts.other.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Other</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {groupedContacts.other.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No contacts found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search"
                : "Add contacts to track your networking"}
            </p>
            <Button className="mt-4" onClick={() => setIsAddingContact(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
