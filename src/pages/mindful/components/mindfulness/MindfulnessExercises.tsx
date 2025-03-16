
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import FilterSection from "./filters/FilterSection";
import SearchBar from "./filters/SearchBar";
import MindfulnessSession from "./MindfulnessSession";
import { toast } from "@/hooks/use-toast";
import { MindfulnessExerciseType } from "../../types";

interface MindfulnessExercisesProps {
  onExerciseStateChange?: (isActive: boolean) => void;
}

export default function MindfulnessExercises({ onExerciseStateChange }: MindfulnessExercisesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<MindfulnessExerciseType | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    // Load completed exercises and favorites from local storage
    const storedCompleted = localStorage.getItem('completed-mindfulness');
    const storedFavorites = localStorage.getItem('favorite-mindfulness');
    
    if (storedCompleted) {
      setCompletedExercises(JSON.parse(storedCompleted));
    }
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
  
  const handleSelectExercise = (exercise: MindfulnessExerciseType) => {
    setSelectedExercise(exercise);
    if (onExerciseStateChange) {
      onExerciseStateChange(true);
    }
  };
  
  const handleCloseExercise = () => {
    setSelectedExercise(null);
    if (onExerciseStateChange) {
      onExerciseStateChange(false);
    }
  };
  
  const handleToggleFavorite = (exerciseId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      
      localStorage.setItem('favorite-mindfulness', JSON.stringify(newFavorites));
      return newFavorites;
    });
    
    toast({
      title: favorites.includes(exerciseId) ? "Removed from favorites" : "Added to favorites",
      description: "Your preferences have been updated.",
    });
  };
  
  const filteredExercises = mindfulnessExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = difficultyFilter.length === 0 || difficultyFilter.includes(exercise.level || '');
    const matchesDuration = durationFilter.length === 0 || durationFilter.includes(exercise.duration.toString());
    
    return matchesSearch && matchesDifficulty && matchesDuration;
  });
  
  // No exercises matching filters
  if (filteredExercises.length === 0) {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
          <FilterSection 
            difficultyFilter={difficultyFilter}
            durationFilter={durationFilter}
            onToggleDifficulty={handleToggleDifficulty}
            onToggleDuration={handleToggleDuration}
          />
        </div>
        <EmptyState 
          title="No mindfulness exercises found" 
          description="Try adjusting your filters or search query."
        />
      </div>
    );
  }
  
  return (
    <div>
      <AnimatePresence mode="wait">
        {selectedExercise ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="session"
          >
            <MindfulnessSession 
              exercise={selectedExercise}
              onClose={handleCloseExercise}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="list"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
              <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
              <FilterSection 
                difficultyFilter={difficultyFilter}
                durationFilter={durationFilter}
                onToggleDifficulty={handleToggleDifficulty}
                onToggleDuration={handleToggleDuration}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={() => handleSelectExercise(exercise)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(exercise.id)}
                  isCompleted={completedExercises.includes(exercise.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
