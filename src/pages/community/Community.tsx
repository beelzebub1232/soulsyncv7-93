
import { MessageSquare, Users } from "lucide-react";

export default function Community() {
  // Sample forum categories
  const categories = [
    {
      id: "anxiety",
      name: "Anxiety Support",
      description: "Share coping strategies and support for anxiety",
      icon: <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">😰</div>,
      posts: 128,
      color: "border-yellow-300"
    },
    {
      id: "depression",
      name: "Depression Support",
      description: "A safe space to discuss depression and find support",
      icon: <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">😔</div>,
      posts: 215,
      color: "border-blue-300"
    },
    {
      id: "mindfulness",
      name: "Mindfulness Practice",
      description: "Discussions about meditation and mindfulness techniques",
      icon: <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">🧘</div>,
      posts: 96,
      color: "border-green-300"
    },
    {
      id: "general",
      name: "General Wellness",
      description: "General discussions about mental wellbeing",
      icon: <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">💜</div>,
      posts: 173,
      color: "border-purple-300"
    }
  ];
  
  // Recent posts sample data
  const recentPosts = [
    {
      id: "1",
      title: "How do you manage panic attacks?",
      category: "Anxiety Support",
      author: "Anonymous",
      time: "2 hours ago",
      replies: 12
    },
    {
      id: "2",
      title: "First time trying meditation - any tips?",
      category: "Mindfulness Practice",
      author: "Anonymous",
      time: "5 hours ago",
      replies: 8
    },
    {
      id: "3",
      title: "Does anyone else feel overwhelmed by work?",
      category: "General Wellness",
      author: "Anonymous",
      time: "Yesterday",
      replies: 21
    }
  ];
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Community</h1>
        <p className="text-muted-foreground">Support forums and discussions</p>
      </header>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-mindscape-primary" />
            <span>Support Forums</span>
          </h2>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`/community/${category.id}`}
              className={`card-primary block hover:shadow-md transition-all border-l-4 ${category.color}`}
            >
              <div className="flex items-center gap-4">
                {category.icon}
                <div className="flex-1">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="mt-1 text-xs text-mindscape-primary">
                    {category.posts} posts
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mindscape-primary" />
            <span>Recent Discussions</span>
          </h2>
          <a href="/community/all" className="text-sm text-primary">View all</a>
        </div>
        
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <a 
              key={post.id}
              href={`/community/post/${post.id}`}
              className="card-primary block hover:shadow-md transition-all"
            >
              <h3 className="font-medium">{post.title}</h3>
              
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-mindscape-primary">{post.category}</span>
                <div className="text-muted-foreground">
                  Posted by {post.author} · {post.time}
                </div>
              </div>
              
              <div className="mt-2 text-xs">
                <span className="text-muted-foreground">{post.replies} replies</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="button-primary">
          Start a Discussion
        </button>
      </div>
    </div>
  );
}
