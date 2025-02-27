
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { RecentJournals } from "../home/components/RecentJournals";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewJournalForm } from "./components/NewJournalForm";
import { Input } from "@/components/ui/input";

export default function Journal() {
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search journal entries"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-mindscape-light focus:border-mindscape-primary"
        />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recent Entries</h2>
          <RecentJournals />
        </div>
      </div>
      
      {/* New Journal Sheet */}
      <Sheet open={isNewJournalOpen} onOpenChange={setIsNewJournalOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6">
          <SheetHeader>
            <SheetTitle>New Journal Entry</SheetTitle>
          </SheetHeader>
          <NewJournalForm onComplete={() => setIsNewJournalOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
