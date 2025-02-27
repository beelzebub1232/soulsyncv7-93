
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

// Sample quotes for demonstration
const quotes = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela"
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "The greatest discovery of all time is that a person can change his future by merely changing his attitude.",
    author: "Oprah Winfrey"
  }
];

export function DailyMotivation() {
  const [quote, setQuote] = useState<typeof quotes[0] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };
  
  const refreshQuote = () => {
    setRefreshing(true);
    setTimeout(() => {
      setQuote(fetchRandomQuote());
      setRefreshing(false);
    }, 600);
  };
  
  useEffect(() => {
    setQuote(fetchRandomQuote());
  }, []);
  
  if (!quote) return null;
  
  return (
    <div className="card-primary p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-mindscape-light text-mindscape-primary rounded-full">
            Daily Motivation
          </span>
        </div>
        <button 
          onClick={refreshQuote} 
          className="text-mindscape-primary p-1 rounded-full hover:bg-mindscape-light transition-colors"
          disabled={refreshing}
        >
          <RefreshCw 
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} 
          />
        </button>
      </div>
      
      <blockquote className="mt-2">
        <p className="text-base italic">"{quote.text}"</p>
        <footer className="mt-2 text-sm text-muted-foreground">— {quote.author}</footer>
      </blockquote>
    </div>
  );
}
