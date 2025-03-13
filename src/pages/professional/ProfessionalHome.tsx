
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, MessageCircle, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfessionalHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Professional Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}. Manage your mental health support activities.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Manage community posts and provide professional support
            </p>
            <Button 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/professional/community')}
            >
              View Community
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              View and respond to user messages and questions
            </p>
            <Button 
              size="sm"
              variant="secondary" 
              className="w-full"
              onClick={() => navigate('/professional/messages')}
            >
              Check Messages
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="mr-4 bg-blue-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Community Posts</p>
                  <p className="text-sm text-muted-foreground">Responses to user posts</p>
                </div>
              </div>
              <div className="text-2xl font-semibold">12</div>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="mr-4 bg-green-100 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">Direct messages with users</p>
                </div>
              </div>
              <div className="text-2xl font-semibold">5</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 bg-purple-100 p-2 rounded-full">
                  <CalendarClock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Active Hours</p>
                  <p className="text-sm text-muted-foreground">Hours active this week</p>
                </div>
              </div>
              <div className="text-2xl font-semibold">8.5</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
              <div className="text-center">
                <BarChart2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Community impact visualization
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate('/professional/insights')}
                >
                  View Detailed Insights
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
