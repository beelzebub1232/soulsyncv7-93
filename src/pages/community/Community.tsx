
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, ShieldCheck } from "lucide-react";

export default function Community() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("posts");
  
  useEffect(() => {
    // Set default tab based on user role
    if (user?.role === "admin") {
      setActiveTab("admin");
    } else if (user?.role === "professional" && user?.isVerified) {
      setActiveTab("professional");
    } else {
      setActiveTab("posts");
    }
  }, [user]);
  
  return (
    <div className="container py-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          
          {user?.role === "professional" && user?.isVerified && (
            <TabsTrigger value="professional" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Professional</span>
            </TabsTrigger>
          )}
          
          {user?.role === "admin" && (
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="posts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is where community posts will appear. Implementation coming in the next step.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {user?.role === "professional" && user?.isVerified && (
          <TabsContent value="professional" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Here you can access professional features like moderation and community management.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {user?.role === "admin" && (
          <TabsContent value="admin" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Here you can manage users, verify professionals, and moderate the community.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
