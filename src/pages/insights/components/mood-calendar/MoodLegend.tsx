
import React from 'react';

export function MoodLegend() {
  const moodTypes = [
    { value: 'amazing', color: 'bg-green-400', label: 'Amazing' },
    { value: 'good', color: 'bg-green-300', label: 'Good' },
    { value: 'okay', color: 'bg-blue-300', label: 'Okay' },
    { value: 'sad', color: 'bg-orange-300', label: 'Sad' },
    { value: 'awful', color: 'bg-red-300', label: 'Awful' }
  ];

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
      {moodTypes.map(mood => (
        <div key={mood.value} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${mood.color}`}></div>
          <span className="text-xs">{mood.label}</span>
        </div>
      ))}
    </div>
  );
}
