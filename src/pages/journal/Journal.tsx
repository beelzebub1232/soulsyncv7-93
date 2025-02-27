
import { useState } from "react";
import { Plus } from "lucide-react";
import { RecentJournals } from "../home/components/RecentJournals";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewJournalForm } from "./components/NewJournalForm";

export default function Journal() {
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Journal</h1>
          <p className="text-muted-foreground">Track your thoughts and feelings</p>
        </div>
        
        <Sheet open={isNewJournalOpen} onOpenChange={setIsNewJournalOpen}>
          <SheetTrigger asChild>
            <button className="button-primary flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>New Entry</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6">
            <SheetHeader>
              <SheetTitle>New Journal Entry</SheetTitle>
            </SheetHeader>
            <NewJournalForm onComplete={() => setIsNewJournalOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recent Entries</h2>
          <RecentJournals />
        </div>
      </div>
    </div>
  );
}
