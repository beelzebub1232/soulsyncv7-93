
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Clock, Filter, XCircle } from "lucide-react";
import BreathingSession from "./BreathingSession";
import { breathingExercises } from "../../data/breathingExercises";
import FilterSection from "../mindfulness/filters/FilterSection";
import SearchBar from "../mindfulness/filters/SearchBar";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Separator } from "@/components/ui/separator";

interface BreathingExercisesProps {
  onSessionComplete?: (exerciseId: string, duration: number) => void;
}

export default function BreathingExercises({ onSessionComplete }: BreathingExercisesProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useLocalStorage<string[]>("breathing-favorites", []);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeDurationFilter, setActiveDurationFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState(breathingExercises);
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleFavorite = (id: string) => {
    if (favoriteExercises.includes(id)) {
      setFavoriteExercises(favoriteExercises.filter(exerciseId => exerciseId !== id));
    } else {
      setFavoriteExercises([...favoriteExercises, id]);
    }
  };

  const filters = [
    { label: "All", value: null },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Favorites", value: "favorites" }
  ];

  const durationFilters = [
    { label: "All Durations", value: null },
    { label: "Quick (< 5 min)", value: "quick" },
    { label: "Medium (5-7 min)", value: "medium" },
    { label: "Long (> 7 min)", value: "long" }
  ];

  // Filter exercises whenever filter, search, or favorites change
  useEffect(() => {
    let result = breathingExercises;
    
    // Apply level filter
    if (activeFilter === "favorites") {
      result = result.filter(exercise => favoriteExercises.includes(exercise.id));
    } else if (activeFilter) {
      result = result.filter(exercise => exercise.level === activeFilter);
    }
    
    // Apply duration filter
    if (activeDurationFilter) {
      result = result.filter(exercise => {
        const duration = exercise.duration;
        switch (activeDurationFilter) {
          case "quick": return duration < 5;
          case "medium": return duration >= 5 && duration <= 7;
          case "long": return duration > 7;
          default: return true;
        }
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        exercise => 
          exercise.name.toLowerCase().includes(query) || 
          exercise.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredExercises(result);
  }, [activeFilter, activeDurationFilter, searchQuery, favoriteExercises]);

  const clearFilters = () => {
    setActiveFilter(null);
    setActiveDurationFilter(null);
    setSearchQuery("");
  };

  const handleSessionComplete = (exerciseId: string) => {
    // Find the exercise to get its duration
    const exercise = breathingExercises.find(ex => ex.id === exerciseId);
    if (exercise && onSessionComplete) {
      onSessionComplete(exerciseId, exercise.duration);
    }
    setActiveSession(null);
  };

  if (activeSession) {
    const exercise = breathingExercises.find(ex => ex.id === activeSession);
    if (!exercise) return null;
    
    return (
      <BreathingSession 
        exercise={exercise} 
        onClose={() => setActiveSession(null)} 
        onComplete={() => handleSessionComplete(exercise.id)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          Breathing
        </h2>
        <button 
          className="text-xs text-muted-foreground flex items-center gap-1 p-1.5 rounded-full hover:bg-background/80"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>
      
      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search breathing exercises..."
      />
      
      {/* Collapsible Filters */}
      {showFilters && (
        <div className="space-y-3 p-3 bg-background/50 rounded-xl border border-border/30 animate-fade-in">
          {/* Level Filters */}
          <FilterSection
            title="Level"
            icon={<Filter className="h-4 w-4 text-muted-foreground" />}
            options={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <Separator className="bg-border/30" />
          
          {/* Duration Filters */}
          <FilterSection
            title="Duration"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            options={durationFilters}
            activeFilter={activeDurationFilter}
            onFilterChange={setActiveDurationFilter}
          />
        </div>
      )}
      
      {/* Clear Filters Button */}
      {(activeFilter || activeDurationFilter || searchQuery) && (
        <button 
          className="text-mindscape-primary text-xs font-medium flex items-center gap-1 mx-auto px-3 py-1.5 rounded-full bg-mindscape-light/20"
          onClick={clearFilters}
        >
          <XCircle className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
      
      <ScrollArea className="h-[calc(100vh-400px)]">
        {filteredExercises.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-3 pt-1 pb-20">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorite={favoriteExercises.includes(exercise.id)}
                onToggleFavorite={toggleFavorite}
                onStartSession={setActiveSession}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
