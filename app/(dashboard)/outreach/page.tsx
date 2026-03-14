"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Filter, Users, Loader2, UserPlus, Linkedin } from "lucide-react"
import { ContactCard } from "@/components/outreach/contact-card"
import { ContactDetail, EmptyContactDetail } from "@/components/outreach/contact-detail"
import { StatsBar } from "@/components/outreach/stats-bar"
import {
  mockContacts,
  mockMessages,
  mockSummaryStats,
  mockProspectedContacts,
  type Contact,
  type WarmthLevel,
  type ContactStatus,
  type ProspectedContact,
} from "@/lib/outreach-types"

export default function OutreachPage() {
  const { toast } = useToast()
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [warmthFilter, setWarmthFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [prospectCompany, setProspectCompany] = useState("")
  const [isSearchingProspects, setIsSearchingProspects] = useState(false)
  const [showProspects, setShowProspects] = useState(false)

  const handleSearchProspects = () => {
    if (!prospectCompany.trim()) return
    setIsSearchingProspects(true)
    setTimeout(() => {
      setIsSearchingProspects(false)
      setShowProspects(true)
    }, 1500)
  }

  const handleAddProspect = (prospect: ProspectedContact) => {
    toast({
      title: "Contact added",
      description: `${prospect.name} has been added to your outreach list.`,
    })
  }

  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(mockContacts.map((c) => c.company))]
    return uniqueCompanies.sort()
  }, [])

  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          contact.name.toLowerCase().includes(query) ||
          contact.company.toLowerCase().includes(query) ||
          contact.title.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Company filter
      if (companyFilter !== "all" && contact.company !== companyFilter) {
        return false
      }

      // Warmth filter
      if (warmthFilter !== "all" && contact.warmth !== warmthFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && contact.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, companyFilter, warmthFilter, statusFilter])

  const selectedContact = selectedContactId
    ? mockContacts.find((c) => c.id === selectedContactId)
    : null

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="shrink-0 p-5 border-b border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            Outreach Hub
          </h1>

          <Button className="gap-2 rounded-lg md:order-last">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div className="flex flex-col gap-3 mt-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={warmthFilter} onValueChange={setWarmthFilter}>
              <SelectTrigger className="w-[120px] rounded-lg">
                <SelectValue placeholder="Warmth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warmth</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="no-response">No Response</SelectItem>
                <SelectItem value="do-not-contact">Do Not Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 md:flex-row">
        {/* Contact List */}
        <div className={`w-full md:w-[40%] border-r border-border flex flex-col ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
          <ScrollArea className="flex-1">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <Filter className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No contacts found
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isSelected={contact.id === selectedContactId}
                  onClick={() => setSelectedContactId(contact.id)}
                />
              ))
            )}
          </ScrollArea>

          <div className="shrink-0 p-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Prospecting Section */}
          <div className="shrink-0 p-4 border-t border-border">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Find New Contacts
                </CardTitle>
                <CardDescription className="text-xs">
                  Discover contacts at target companies
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Input
                    placeholder="Company name..."
                    value={prospectCompany}
                    onChange={(e) => setProspectCompany(e.target.value)}
                    className="flex-1 h-8 text-sm rounded-lg"
                    onKeyDown={(e) => e.key === "Enter" && handleSearchProspects()}
                  />
                  <Button
                    size="sm"
                    className="h-8 rounded-lg"
                    onClick={handleSearchProspects}
                    disabled={isSearchingProspects || !prospectCompany.trim()}
                  >
                    {isSearchingProspects ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>

                {showProspects && (
                  <div className="mt-3 space-y-2">
                    {mockProspectedContacts.map((prospect) => (
                      <div
                        key={prospect.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border bg-surface hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-xs">
                              {prospect.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">
                              {prospect.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {prospect.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <Linkedin className="h-2.5 w-2.5" />
                            {prospect.mutualConnections}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 rounded-lg"
                            onClick={() => handleAddProspect(prospect)}
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Detail */}
        <div className={`flex-1 flex flex-col ${selectedContactId ? 'flex' : 'hidden md:flex'}`}>
          {selectedContact ? (
            <ContactDetail
              contact={selectedContact}
              messages={mockMessages}
              onBack={() => setSelectedContactId(null)}
            />
          ) : (
            <EmptyContactDetail />
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar stats={mockSummaryStats} />
    </div>
  )
}
