
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import { MindfulnessExerciseType } from "../../types";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import SearchBar from "./filters/SearchBar";
import FilterSection from "./filters/FilterSection";
import MindfulnessSession from "./MindfulnessSession";
import { cn } from "@/lib/utils";

interface MindfulnessExercisesProps {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export default function MindfulnessExercises({ onSessionStart, onSessionEnd }: MindfulnessExercisesProps) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<MindfulnessExerciseType | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mindfulness-favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    const savedCompleted = localStorage.getItem('mindfulness-completed');
    if (savedCompleted) setCompletedExercises(JSON.parse(savedCompleted));
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mindfulness-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('mindfulness-completed', JSON.stringify(completedExercises));
  }, [completedExercises]);
  
  // Filter exercises based on search, difficulty, and duration
  const getFilteredExercises = () => {
    let filtered = [...mindfulnessExercises];
    
    // First filter by tab
    if (activeTab === "favorites") {
      filtered = filtered.filter(exercise => favorites.includes(exercise.id));
    } else if (activeTab === "completed") {
      filtered = filtered.filter(exercise => completedExercises.includes(exercise.id));
    }
    
    // Then apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        exercise => 
          exercise.name.toLowerCase().includes(query) || 
          exercise.description.toLowerCase().includes(query)
      );
    }
    
    // Then apply difficulty and duration filters
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter(exercise => exercise.level && difficultyFilter.includes(exercise.level));
    }
    
    if (durationFilter.length > 0) {
      filtered = filtered.filter(exercise => {
        // Map duration to categories
        let durationCategory = "";
        if (exercise.duration <= 5) durationCategory = "short";
        else if (exercise.duration <= 15) durationCategory = "medium";
        else durationCategory = "long";
        
        return durationFilter.includes(durationCategory);
      });
    }
    
    return filtered;
  };
  
  const filteredExercises = getFilteredExercises();
  
  const handleToggleFavorite = (exerciseId: string) => {
    setFavorites(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };
  
  const handleToggleDifficulty = (difficulty: string) => {
    setDifficultyFilter(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };
  
  const handleToggleDuration = (duration: string) => {
    setDurationFilter(prev => {
      if (prev.includes(duration)) {
        return prev.filter(d => d !== duration);
      } else {
        return [...prev, duration];
      }
    });
  };
  
  const handleExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
    }
  };
  
  const handleCloseSession = () => {
    setSelectedExercise(null);
    if (onSessionEnd) onSessionEnd();
  };
  
  // If an exercise is selected, show the mindfulness session
  if (selectedExercise) {
    return (
      <MindfulnessSession 
        exercise={selectedExercise} 
        onClose={handleCloseSession}
      />
    );
  }
  
  const handleSelectExercise = (exercise: MindfulnessExerciseType) => {
    setSelectedExercise(exercise);
    if (onSessionStart) onSessionStart();
  };
  
  return (
    <div className="pb-16">
      {/* Mobile view */}
      {isMobile && (
        <div className="space-y-4">
          <SearchBar 
            onSearch={(query) => setSearchQuery(query)} 
          />
          
          <FilterSection 
            difficultyFilter={difficultyFilter} 
            durationFilter={durationFilter} 
            onToggleDifficulty={handleToggleDifficulty} 
            onToggleDuration={handleToggleDuration} 
          />
          
          {filteredExercises.length === 0 && (
            <EmptyState 
              title="No exercises found" 
              description="Try adjusting your filters or search query."
            />
          )}
          
          <div className="space-y-3 pb-6">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={() => handleSelectExercise(exercise)}
                onToggleFavorite={() => handleToggleFavorite(exercise.id)}
                isFavorite={favorites.includes(exercise.id)}
                isCompleted={completedExercises.includes(exercise.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Desktop view */}
      {!isMobile && (
        <div className="flex gap-8">
          <div className="w-64 shrink-0">
            <div className="space-y-6 sticky top-4">
              <SearchBar 
                onSearch={(query) => setSearchQuery(query)} 
              />
              
              <FilterSection 
                difficultyFilter={difficultyFilter} 
                durationFilter={durationFilter} 
                onToggleDifficulty={handleToggleDifficulty} 
                onToggleDuration={handleToggleDuration} 
              />
            </div>
          </div>
          
          <div className="flex-1">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All Exercises</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredExercises.length === 0 && (
                    <EmptyState 
                      title="No exercises found" 
                      description="Try adjusting your filters or search query."
                    />
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
                    {filteredExercises.map(exercise => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onSelect={() => handleSelectExercise(exercise)}
                        onToggleFavorite={() => handleToggleFavorite(exercise.id)}
                        isFavorite={favorites.includes(exercise.id)}
                        isCompleted={completedExercises.includes(exercise.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
