
import { useState, useEffect } from "react";
import { Plus, Search, Calendar, SortAsc, Filter } from "lucide-react";
import { RecentJournals } from "./components/RecentJournals";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NewJournalForm } from "./components/NewJournalForm";
import { Input } from "@/components/ui/input";
import { JournalEntry } from "@/types/journal";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JournalDetails } from "./components/JournalDetails";

export default function Journal() {
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Load journal entries on component mount
  useEffect(() => {
    if (!user) return;
    
    const storageKey = `soulsync_journal_${user.id}`;
    const storedEntries = localStorage.getItem(storageKey);
    
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
        setFilteredEntries(parsedEntries);
      } catch (error) {
        console.error("Failed to parse journal entries:", error);
        toast({
          variant: "destructive",
          title: "Error loading entries",
          description: "There was a problem loading your journal entries."
        });
      }
    }
  }, [toast, user]);
  
  // Filter entries when search query changes
  useEffect(() => {
    if (!entries.length) return;
    
    let result = [...entries];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.title.toLowerCase().includes(lowerQuery) || 
        entry.content.toLowerCase().includes(lowerQuery) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        entry.mood?.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply category filter
    if (filterBy) {
      if (filterBy === "withAttachments") {
        result = result.filter(entry => entry.attachments && entry.attachments.length > 0);
      } else if (filterBy === "withTags") {
        result = result.filter(entry => entry.tags && entry.tags.length > 0);
      } else if (filterBy === "withMood") {
        result = result.filter(entry => entry.mood);
      }
    }
    
    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredEntries(result);
  }, [searchQuery, entries, sortOrder, filterBy]);
  
  const addNewEntry = (entry: JournalEntry) => {
    if (!user) return;
    
    // Make sure date is properly serialized 
    const entryWithDate = {
      ...entry,
      date: new Date().toISOString()
    };
    
    const updatedEntries = [entryWithDate, ...entries];
    setEntries(updatedEntries);
    
    const storageKey = `soulsync_journal_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    toast({
      title: "Journal entry saved",
      description: `"${entry.title}" has been added to your journal.`
    });
    
    setIsNewJournalOpen(false);
  };
  
  const toggleFavorite = (entryId: string) => {
    if (!user) return;
    
    const updatedEntries = entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, favorite: !entry.favorite }
        : entry
    );
    
    setEntries(updatedEntries);
    
    const storageKey = `soulsync_journal_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
  };
  
  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
    toast({
      title: `Sorted ${sortOrder === "desc" ? "oldest" : "newest"} first`,
      description: "Your journal entries have been reordered."
    });
  };
  
  const toggleFilter = () => {
    const filters = [null, "withAttachments", "withTags", "withMood"];
    const currentIndex = filters.indexOf(filterBy);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    
    setFilterBy(nextFilter);
    
    const filterNames: Record<string, string> = {
      "withAttachments": "entries with attachments",
      "withTags": "entries with tags",
      "withMood": "entries with mood"
    };
    
    if (nextFilter) {
      toast({
        title: "Filter applied",
        description: `Showing ${filterNames[nextFilter]}.`
      });
    } else {
      toast({
        title: "Filter removed",
        description: "Showing all journal entries."
      });
    }
  };
  
  // Handle the "Write First Entry" button click
  const handleWriteFirstEntry = () => {
    setIsNewJournalOpen(true);
  };
  
  const openJournalDetails = (entry: JournalEntry) => {
    setSelectedJournal(entry);
  };
  
  const closeJournalDetails = () => {
    setSelectedJournal(null);
  };
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Journal</h1>
          <p className="text-muted-foreground">Track your thoughts and feelings</p>
        </div>
        
        <button 
          onClick={() => setIsNewJournalOpen(true)}
          className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
          aria-label="New Entry"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journal entries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-mindscape-light focus:border-mindscape-primary"
          />
        </div>
        
        <button 
          className={`w-10 h-10 rounded-lg ${filterBy ? 'bg-mindscape-primary text-white' : 'border border-input bg-background hover:bg-accent'} flex items-center justify-center`}
          aria-label="Filter"
          onClick={toggleFilter}
        >
          <Filter className="h-4 w-4" />
        </button>
        
        <button 
          className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
          aria-label="Sort"
          onClick={toggleSort}
        >
          <SortAsc className={`h-4 w-4 transform ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
        </button>
        
        <button 
          className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
          aria-label="Calendar view"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="all">All Entries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-4">
          <RecentJournals 
            entries={filteredEntries.slice(0, 10)} 
            onToggleFavorite={toggleFavorite}
            onJournalClick={openJournalDetails}
            onWriteFirstEntry={handleWriteFirstEntry}
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          <RecentJournals 
            entries={filteredEntries.filter(entry => entry.favorite)} 
            onToggleFavorite={toggleFavorite}
            onJournalClick={openJournalDetails}
            emptyMessage="No favorite entries yet. Star an entry to add it to favorites."
            onWriteFirstEntry={handleWriteFirstEntry}
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <RecentJournals 
            entries={filteredEntries} 
            showDateGroups={true}
            onToggleFavorite={toggleFavorite}
            onJournalClick={openJournalDetails}
            onWriteFirstEntry={handleWriteFirstEntry}
          />
        </TabsContent>
      </Tabs>
      
      {/* New Journal Sheet */}
      <Sheet open={isNewJournalOpen} onOpenChange={setIsNewJournalOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6">
          <SheetHeader>
            <SheetTitle>New Journal Entry</SheetTitle>
          </SheetHeader>
          <NewJournalForm onComplete={addNewEntry} onCancel={() => setIsNewJournalOpen(false)} />
        </SheetContent>
      </Sheet>
      
      {/* Journal Details Dialog */}
      {selectedJournal && (
        <JournalDetails 
          entry={selectedJournal} 
          isOpen={!!selectedJournal} 
          onClose={closeJournalDetails}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
