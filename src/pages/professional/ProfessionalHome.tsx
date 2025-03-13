
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Users, MessageCircle, AlertTriangle, Clock, HelpCircle, Trophy, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProfessionalHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [recentReports, setRecentReports] = useState(2);
  const [pendingQuestions, setPendingQuestions] = useState(3);
  const [totalContributions, setTotalContributions] = useState(0);
  
  useEffect(() => {
    const getTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      return 'evening';
    };
    
    setTimeOfDay(getTimeOfDay());
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setTotalContributions(17);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good {timeOfDay}, {user?.username}
        </h1>
        <p className="text-muted-foreground">
          Welcome to your professional dashboard. You're making a difference in the community.
        </p>
      </div>
      
      {user?.isVerified && (
        <Alert className="bg-primary/10 border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle>Verified Professional</AlertTitle>
          <AlertDescription>
            Your account has been verified. You now have full access to all professional features.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports > 0 && (
              <div className="flex justify-between items-center p-3 rounded-md bg-background">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>{recentReports} new content reports</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/professional/community')}
                >
                  Review
                </Button>
              </div>
            )}
            
            {pendingQuestions > 0 && (
              <div className="flex justify-between items-center p-3 rounded-md bg-background">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  <span>{pendingQuestions} unanswered questions</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/professional/community')}
                >
                  Answer
                </Button>
              </div>
            )}
            
            {recentReports === 0 && pendingQuestions === 0 && (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-muted-foreground">All caught up!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-amber-500" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Community Responses</span>
              </div>
              <span className="font-medium">{totalContributions}</span>
            </div>
            
            <div className="w-full bg-background rounded-full h-2.5 mb-6">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((totalContributions / 20) * 100, 100)}%` }}
              ></div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/professional/community')}
            >
              Contribute More
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-card border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Recent Community Activity
          </CardTitle>
          <CardDescription>
            Recent posts that may need your professional insight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[240px] pr-4">
            <div className="space-y-4">
              {[
                {
                  id: '1',
                  title: 'Struggling with anxiety at night',
                  category: 'Anxiety Support',
                  time: '2 hours ago',
                  replies: 2
                },
                {
                  id: '2',
                  title: 'Can\'t focus on work after recent loss',
                  category: 'Depression',
                  time: '5 hours ago',
                  replies: 1
                },
                {
                  id: '3',
                  title: 'New meditation technique that helped me',
                  category: 'Mindfulness',
                  time: '6 hours ago',
                  replies: 4
                },
                {
                  id: '4',
                  title: 'Feeling overwhelmed by work stress',
                  category: 'Stress Management',
                  time: '8 hours ago',
                  replies: 3
                },
                {
                  id: '5',
                  title: 'Tips for talking to teens about mental health',
                  category: 'General Discussions',
                  time: '12 hours ago',
                  replies: 5
                }
              ].map(post => (
                <div 
                  key={post.id} 
                  className="p-3 rounded-md bg-background hover:bg-background/70 cursor-pointer"
                  onClick={() => navigate(`/professional/community/post/${post.id}`)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{post.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.replies}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4">
            <Button 
              className="w-full"
              onClick={() => navigate('/professional/community')}
            >
              Go to Community
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Professional Resources
          </CardTitle>
          <CardDescription>
            Tools and resources to help you in your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-background">
              <h3 className="font-medium mb-2">Community Guidelines</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Review the guidelines for providing mental health support in our community.
              </p>
              <Button variant="outline" size="sm" className="w-full">View Guidelines</Button>
            </div>
            
            <div className="p-4 rounded-md bg-background">
              <h3 className="font-medium mb-2">Crisis Response Protocol</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Important procedures for identifying and responding to crisis situations.
              </p>
              <Button variant="outline" size="sm" className="w-full">View Protocol</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
