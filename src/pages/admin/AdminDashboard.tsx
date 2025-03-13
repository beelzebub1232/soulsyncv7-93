
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, AlertTriangle, FileText, ActivitySquare } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { 
  AreaChart, 
  BarChart,
  Area, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock activity data for charts (would be replaced by real data in production)
const activityData = [
  { name: 'Mon', users: 5, posts: 12, reports: 1 },
  { name: 'Tue', users: 3, posts: 18, reports: 2 },
  { name: 'Wed', users: 7, posts: 15, reports: 0 },
  { name: 'Thu', users: 2, posts: 11, reports: 3 },
  { name: 'Fri', users: 6, posts: 14, reports: 1 },
  { name: 'Sat', users: 9, posts: 17, reports: 0 },
  { name: 'Sun', users: 4, posts: 10, reports: 2 },
];

// Mock content distribution data
const contentDistribution = [
  { name: 'Journal', value: 120 },
  { name: 'Community', value: 85 },
  { name: 'Comments', value: 63 },
];

export default function AdminDashboard() {
  const { pendingProfessionals } = useUser();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Generate recent activity based on current data
  useEffect(() => {
    const activities = [];
    
    // Add activities for pending professionals
    pendingProfessionals.forEach(pro => {
      activities.push({
        id: `pro_${pro.id}`,
        type: 'verification',
        user: pro.username,
        description: `requested professional verification as ${pro.occupation}`,
        time: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 2) // Random time in last 2 days
      });
    });
    
    // Add some mock activities
    activities.push(
      {
        id: 'report_1',
        type: 'report',
        user: 'JaneDoe',
        description: 'reported a post in Anxiety Support',
        time: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
      },
      {
        id: 'user_1',
        type: 'user',
        user: 'NewUser123',
        description: 'registered a new account',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      },
      {
        id: 'content_1',
        type: 'content',
        user: 'JohnSmith',
        description: 'created a new post in Depression Support',
        time: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
      }
    );
    
    // Sort by time (most recent first)
    activities.sort((a, b) => b.time.getTime() - a.time.getTime());
    
    setRecentActivity(activities);
  }, [pendingProfessionals]);
  
  // Format time for display
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    
    if (diffMin < 60) {
      return `${diffMin} min ago`;
    } else if (diffMin < 60 * 24) {
      return `${Math.floor(diffMin / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMin / (60 * 24))} days ago`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the SoulSync platform administration.</p>
      </div>
      
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pros</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">{pendingProfessionals.length}</span> pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">5</span> need review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">358</div>
            <p className="text-xs text-muted-foreground">Posts and replies</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mb-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>New users, posts, and reports over the past week</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="posts" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPosts)" />
                  <Area type="monotone" dataKey="reports" stroke="#ffc658" fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-6">
                    <ActivitySquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  recentActivity.slice(0, 5).map((activity) => (
                    <div 
                      key={activity.id} 
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg",
                        "bg-muted/50"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {activity.type === 'verification' && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'report' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        {activity.type === 'user' && <Users className="h-5 w-5 text-green-500" />}
                        {activity.type === 'content' && <FileText className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          <span className="font-medium">{activity.user}</span> {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTime(activity.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>
                Tasks that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProfessionals.length > 0 && (
                  <div className="flex flex-col gap-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Professional Verification Requests</p>
                        <p className="text-xs text-muted-foreground">
                          {pendingProfessionals.length} professionals awaiting verification
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/admin/verifications">
                        Review Verifications
                      </Link>
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-col gap-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Content Reports</p>
                      <p className="text-xs text-muted-foreground">
                        5 reported content items require review
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/admin/reports">
                      Review Reports
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
