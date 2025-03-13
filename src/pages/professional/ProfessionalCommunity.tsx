
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumCategory } from "@/types/community";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Bell, AlertTriangle, Filter, MessageSquare, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfessionalForumCategoryList } from "./components/ProfessionalForumCategoryList";
import { ProfessionalReportedContent } from "./components/ProfessionalReportedContent";
import { ProfessionalPendingQuestions } from "./components/ProfessionalPendingQuestions";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProfessionalCommunity() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching categories
    setTimeout(() => {
      setCategories([
        {
          id: "anxiety",
          name: "Anxiety Support",
          description: "Discuss anxiety management techniques and share experiences",
          icon: "heart",
          posts: 24,
          color: "bg-primary/10"
        },
        {
          id: "depression",
          name: "Depression",
          description: "A safe space to talk about depression and coping strategies",
          icon: "heart",
          posts: 18,
          color: "bg-primary/10"
        },
        {
          id: "mindfulness",
          name: "Mindfulness",
          description: "Share mindfulness practices and meditation techniques",
          icon: "heart",
          posts: 32,
          color: "bg-primary/10"
        },
        {
          id: "stress",
          name: "Stress Management",
          description: "Tips and discussions about managing stress in daily life",
          icon: "heart",
          posts: 15,
          color: "bg-primary/10"
        },
        {
          id: "general",
          name: "General Discussions",
          description: "Open discussions about mental wellness and self-care",
          icon: "heart",
          posts: 42,
          color: "bg-primary/10"
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Provide professional support to community members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search discussions..." 
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum" className="relative">
            Forum
            <Badge className="ml-1 bg-primary hover:bg-primary/90">{categories.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="questions" className="relative">
            Questions
            <Badge className="ml-1 bg-primary hover:bg-primary/90">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="reports" className="relative">
            Reports
            <Badge className="ml-1 bg-destructive hover:bg-destructive/90">2</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="forum" className="mt-4">
          <Card className="bg-card border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Forum Categories
              </CardTitle>
              <CardDescription>
                Browse categories to provide professional support
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : (
                <ProfessionalForumCategoryList categories={categories} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-4">
          <ProfessionalPendingQuestions />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <ProfessionalReportedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
