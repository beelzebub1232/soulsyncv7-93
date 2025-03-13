
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

export default function AdminDashboard() {
  const { pendingProfessionals, user } = useUser();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    professionals: 0,
    reports: 0,
    content: 0
  });
  const [activityData, setActivityData] = useState<any[]>([]);
  
  // Get all mock data from the local storage or mock source
  useEffect(() => {
    // Get total users count
    const mockUsers = Object.values(JSON.parse(localStorage.getItem('soulsync_users') || '{}'));
    const regularUsers = mockUsers.filter((user: any) => user.role === 'user').length;
    const professionalUsers = mockUsers.filter((user: any) => user.role === 'professional').length;
    
    // Get reports count
    const storedReports = JSON.parse(localStorage.getItem('soulsync_reports') || '[]');
    
    // Get content count
    const storedPosts = JSON.parse(localStorage.getItem('soulsync_posts') || '[]');
    const storedReplies = JSON.parse(localStorage.getItem('soulsync_replies') || '[]');
    const contentCount = storedPosts.length + storedReplies.length;
    
    setStats({
      users: regularUsers || mockUsers.length || 15, // Fallback to at least some number
      professionals: professionalUsers || pendingProfessionals.length || 3,
      reports: storedReports.length || 7,
      content: contentCount || 85
    });
    
    // Generate activity data for the chart
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityData = daysOfWeek.map(day => ({
      name: day,
      users: Math.floor(Math.random() * 10) + 1,
      posts: Math.floor(Math.random() * 20) + 5,
      reports: Math.floor(Math.random() * 3)
    }));
    
    setActivityData(activityData);
    
    // Generate recent activity
    const activities = [];
    
    // Add activities for pending professionals
    pendingProfessionals.forEach(pro => {
      activities.push({
        id: `pro_${pro.id}`,
        type: 'verification',
        user: pro.username,
        description: `requested professional verification as ${pro.occupation}`,
        time: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 2)
      });
    });
    
    // Add some actual activities based on stored data
    if (storedReports.length > 0) {
      storedReports.slice(0, 2).forEach((report: any, index: number) => {
        activities.push({
          id: `report_${report.id || index}`,
          type: 'report',
          user: report.reportedBy || 'User',
          description: `reported a ${report.contentType || 'post'}`,
          time: new Date(report.date || Date.now() - 1000 * 60 * 60 * 3)
        });
      });
    }
    
    if (storedPosts.length > 0) {
      storedPosts.slice(0, 2).forEach((post: any, index: number) => {
        activities.push({
          id: `content_${post.id || index}`,
          type: 'content',
          user: post.author || 'User',
          description: `created a new post in ${post.categoryName || 'Community'}`,
          time: new Date(post.date || Date.now() - 1000 * 60 * 60 * 8)
        });
      });
    }
    
    // Add user registrations
    mockUsers.slice(0, 2).forEach((user: any, index: number) => {
      activities.push({
        id: `user_${user.id || index}`,
        type: 'user',
        user: user.username || 'NewUser',
        description: 'registered a new account',
        time: new Date(Date.now() - 1000 * 60 * 60 * (5 + index * 2))
      });
    });
    
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
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Active regular users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pros</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professionals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-black dark:text-white font-medium">{pendingProfessionals.length}</span> pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">{Math.min(5, stats.reports)}</span> need review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.content}</div>
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
                      <stop offset="5%" stopColor="#666" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#666" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#333" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#333" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#999" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#999" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stroke="#666" fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="posts" stroke="#333" fillOpacity={1} fill="url(#colorPosts)" />
                  <Area type="monotone" dataKey="reports" stroke="#999" fillOpacity={1} fill="url(#colorReports)" />
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
                        "bg-muted/50 dark:bg-gray-800/50"
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
                
                {stats.reports > 0 && (
                  <div className="flex flex-col gap-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Content Reports</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.min(5, stats.reports)} reported content items require review
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/admin/reports">
                        Review Reports
                      </Link>
                    </Button>
                  </div>
                )}
                
                {pendingProfessionals.length === 0 && stats.reports === 0 && (
                  <div className="text-center py-6">
                    <ActivitySquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No pending tasks</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
