
import { formatDistanceToNow } from "date-fns";
import { Smile, ThumbsUp } from "lucide-react";

// Sample journal entries for demonstration
const journalEntries = [
  {
    id: "1",
    title: "Finding clarity in chaos",
    excerpt: "Today was challenging but I managed to find moments of peace...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    mood: "good",
  },
  {
    id: "2",
    title: "Morning reflections",
    excerpt: "Woke up feeling refreshed. The sunrise was beautiful and I took time to appreciate...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    mood: "amazing",
  },
];

export function RecentJournals() {
  if (journalEntries.length === 0) {
    return (
      <div className="card-primary p-5 text-center rounded-xl shadow-sm border border-mindscape-light/30 bg-white">
        <p className="text-muted-foreground">You haven't created any journal entries yet.</p>
        <button className="button-primary mt-3">Write First Entry</button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {journalEntries.map((entry) => (
        <a 
          key={entry.id}
          href={`/journal/${entry.id}`}
          className="card-primary block p-4 hover:shadow-md transition-all rounded-xl border border-mindscape-light/30 bg-white"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-mindscape-primary">{entry.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(entry.date, { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {entry.excerpt}
          </p>
          
          <div className="mt-2 flex items-center text-xs">
            <span className="flex items-center gap-1 text-mindscape-primary font-medium">
              {entry.mood === "amazing" ? (
                <>
                  <Smile className="h-3.5 w-3.5 text-green-500" />
                  <span>Amazing</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />
                  <span>Good</span>
                </>
              )}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
