
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Clock, Filter, XCircle } from "lucide-react";
import BreathingSession from "./BreathingSession";
import { breathingExercises } from "../../data/breathingExercises";
import FilterSection from "../shared/FilterSection";
import SearchBar from "../shared/SearchBar";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import * as mindfulStorage from "../../services/mindfulStorage";

export default function BreathingExercises() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeDurationFilter, setActiveDurationFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState(breathingExercises);
  
  useEffect(() => {
    // Get favorites from persistent storage
    setFavoriteExercises(mindfulStorage.getBreathingFavorites());
  }, []);
  
  const toggleFavorite = (id: string) => {
    const newFavorites = favoriteExercises.includes(id)
      ? favoriteExercises.filter(exerciseId => exerciseId !== id)
      : [...favoriteExercises, id];
    
    setFavoriteExercises(newFavorites);
    mindfulStorage.saveBreathingFavorites(newFavorites);
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

  const handleSessionComplete = (exerciseId: string, durationMinutes: number) => {
    mindfulStorage.logExerciseCompletion(exerciseId, "breathing", durationMinutes);
    setActiveSession(null);
  };

  if (activeSession) {
    const exercise = breathingExercises.find(ex => ex.id === activeSession);
    if (!exercise) return null;
    
    return (
      <BreathingSession 
        exercise={exercise} 
        onClose={() => setActiveSession(null)} 
        onComplete={handleSessionComplete}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          Breathing Exercises
        </h2>
        <span className="text-sm text-muted-foreground">Choose an exercise to begin</span>
      </div>
      
      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search breathing exercises..."
      />
      
      <div className="space-y-3">
        {/* Level Filters */}
        <FilterSection
          title="Level"
          icon={<Filter className="h-4 w-4 text-muted-foreground" />}
          options={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        {/* Duration Filters */}
        <FilterSection
          title="Duration"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          options={durationFilters}
          activeFilter={activeDurationFilter}
          onFilterChange={setActiveDurationFilter}
        />
      </div>
      
      {/* Clear Filters Button */}
      {(activeFilter || activeDurationFilter || searchQuery) && (
        <button 
          className="text-mindscape-primary text-sm font-medium flex items-center gap-1"
          onClick={clearFilters}
        >
          <XCircle className="h-4 w-4" />
          Clear all filters
        </button>
      )}
      
      <ScrollArea className="h-[calc(100vh-420px)]">
        {filteredExercises.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-4">
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
