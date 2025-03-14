
import { Play, Clock, Heart } from "lucide-react";

export default function Mindful() {
  // Sample meditation categories
  const categories = [
    {
      id: "stress",
      name: "Stress Relief",
      sessions: 8,
      color: "bg-orange-100 border-orange-300 text-orange-700",
      icon: "😌"
    },
    {
      id: "sleep",
      name: "Better Sleep",
      sessions: 6,
      color: "bg-blue-100 border-blue-300 text-blue-700",
      icon: "😴"
    },
    {
      id: "focus",
      name: "Improve Focus",
      sessions: 5,
      color: "bg-green-100 border-green-300 text-green-700",
      icon: "🧠"
    },
    {
      id: "anxiety",
      name: "Anxiety Relief",
      sessions: 7,
      color: "bg-purple-100 border-purple-300 text-purple-700",
      icon: "🙏"
    }
  ];
  
  // Sample meditation sessions
  const sessions = [
    {
      id: "1",
      title: "Deep Breathing",
      duration: "5 min",
      category: "Stress Relief",
      instructor: "Sarah Johnson",
      image: "url-to-image",
      favorite: true
    },
    {
      id: "2",
      title: "Body Scan Relaxation",
      duration: "10 min",
      category: "Better Sleep",
      instructor: "Michael Lee",
      image: "url-to-image",
      favorite: false
    },
    {
      id: "3",
      title: "Mindful Awareness",
      duration: "15 min",
      category: "Improve Focus",
      instructor: "Emily Chen",
      image: "url-to-image",
      favorite: true
    }
  ];
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Mindful</h1>
        <p className="text-muted-foreground">Guided meditations and exercises</p>
      </header>
      
      <div className="card-highlight p-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white/50 rounded-full">
              Recommended for You
            </span>
            <h2 className="text-lg font-semibold mt-1">Morning Calm</h2>
            <div className="flex items-center text-sm mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>7 min</span>
            </div>
          </div>
          
          <button className="rounded-full bg-white h-12 w-12 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            <Play className="h-5 w-5 text-mindscape-primary" />
          </button>
        </div>
        
        <p className="text-sm mt-3">
          Start your day with calm focus and positive intentions.
        </p>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`/mindful/category/${category.id}`}
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${category.color}`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-xs mt-1">{category.sessions} sessions</p>
            </a>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Popular Sessions</h2>
        
        {sessions.map((session) => (
          <a 
            key={session.id}
            href={`/mindful/session/${session.id}`}
            className="card-primary flex items-center gap-4 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 bg-mindscape-light rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-mindscape-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{session.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{session.category} · {session.duration}</span>
                {session.favorite && (
                  <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">By {session.instructor}</p>
            </div>
          </a>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <button className="button-secondary">
          See All Sessions
        </button>
      </div>
    </div>
  );
}
