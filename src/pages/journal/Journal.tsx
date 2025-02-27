
import { useState, useEffect } from "react";
import { Plus, Search, Calendar, SortAsc, Filter } from "lucide-react";
import { RecentJournals } from "./components/RecentJournals";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NewJournalForm } from "./components/NewJournalForm";
import { Input } from "@/components/ui/input";
import { JournalEntry } from "@/types/journal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Journal() {
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();
  
  // Load journal entries on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('soulsync_journal');
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
  }, [toast]);
  
  // Filter entries when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = entries.filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) || 
      entry.content.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredEntries(filtered);
  }, [searchQuery, entries]);
  
  const addNewEntry = (entry: JournalEntry) => {
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('soulsync_journal', JSON.stringify(updatedEntries));
    
    toast({
      title: "Journal entry saved",
      description: `"${entry.title}" has been added to your journal.`
    });
    
    setIsNewJournalOpen(false);
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
          className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
          aria-label="Filter"
        >
          <Filter className="h-4 w-4" />
        </button>
        
        <button 
          className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
          aria-label="Sort"
        >
          <SortAsc className="h-4 w-4" />
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
          <RecentJournals entries={filteredEntries.slice(0, 10)} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          <RecentJournals 
            entries={filteredEntries.filter(entry => entry.favorite)} 
            emptyMessage="No favorite entries yet. Star an entry to add it to favorites."
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <RecentJournals 
            entries={filteredEntries} 
            showDateGroups={true}
          />
        </TabsContent>
      </Tabs>
      
      {/* New Journal Sheet */}
      <Sheet open={isNewJournalOpen} onOpenChange={setIsNewJournalOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6">
          <SheetHeader>
            <SheetTitle>New Journal Entry</SheetTitle>
          </SheetHeader>
          <NewJournalForm onComplete={addNewEntry} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
